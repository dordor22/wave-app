import { Router } from 'express';
import fetch from 'node-fetch';

type City = {
  name: string;
  latitude: number;
  longitude: number;
};

const cities: City[] = [
  { name: 'Herzliya', latitude: 32.165, longitude: 34.808 },
  { name: 'Netanya', latitude: 32.332, longitude: 34.856 },
  { name: 'Beit Yanai', latitude: 32.385, longitude: 34.855 }
];

const MARINE_API_URL = 'https://marine-api.open-meteo.com/v1/marine';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

export const marineRouter = Router();

marineRouter.get('/', async (_req, res) => {
  try {
    const params = new URLSearchParams({
      hourly: [
        'wave_height',
        'wave_direction',
        'wave_period',
        'wind_wave_height',
        'wind_wave_direction',
        'wind_wave_period',
        'swell_wave_height',
        'swell_wave_direction',
        'swell_wave_period'
      ].join(','),
      timezone: 'auto'
    });

    const results = await Promise.all(
      cities.map(async (city) => {
        const marineUrl = `${MARINE_API_URL}?latitude=${city.latitude}&longitude=${city.longitude}&${params.toString()}`;
        const weatherUrl = `${WEATHER_API_URL}?latitude=${city.latitude}&longitude=${city.longitude}&hourly=wind_speed_10m,wind_direction_10m&windspeed_unit=kmh&timezone=auto`;
        const [mr, wr] = await Promise.all([fetch(marineUrl), fetch(weatherUrl)]);
        if (!mr.ok) throw new Error(`Upstream marine error ${mr.status}`);
        if (!wr.ok) throw new Error(`Upstream weather error ${wr.status}`);
        const marine = (await mr.json()) as any;
        const weather = (await wr.json()) as any;
        const merged = {
          ...(marine as Record<string, unknown>),
          hourly: {
            ...((marine?.hourly as Record<string, unknown>) ?? {}),
            wind_speed_10m: weather?.hourly?.wind_speed_10m,
            wind_direction_10m: weather?.hourly?.wind_direction_10m
          }
        } as any;
        return { city: city.name, data: merged };
      })
    );

    res.json({ spots: results });
  } catch (error) {
    console.error('marine route error', error);
    res.status(500).json({ error: 'Failed to fetch marine data' });
  }
});

// Search by free-text place name: /api/marine/search?q=Herzliya
marineRouter.get('/search', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) return res.status(400).json({ error: 'Missing q' });

    // 1) Geocode
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=1&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error(`Geocoding error ${geoRes.status}`);
    const geoData = (await geoRes.json()) as any;
    const first = (geoData?.results ?? [])[0];
    if (!first) return res.status(404).json({ error: 'Place not found' });

    const params = new URLSearchParams({
      hourly: [
        'wave_height',
        'wave_direction',
        'wave_period',
        'wind_wave_height',
        'wind_wave_direction',
        'wind_wave_period',
        'swell_wave_height',
        'swell_wave_direction',
        'swell_wave_period'
      ].join(','),
      timezone: 'auto'
    });

    const marineUrl = `${MARINE_API_URL}?latitude=${first.latitude}&longitude=${first.longitude}&${params.toString()}`;
    const weatherUrl = `${WEATHER_API_URL}?latitude=${first.latitude}&longitude=${first.longitude}&hourly=wind_speed_10m,wind_direction_10m&windspeed_unit=kmh&timezone=auto`;
    const [mr, wr] = await Promise.all([fetch(marineUrl), fetch(weatherUrl)]);
    if (!mr.ok) throw new Error(`Marine error ${mr.status}`);
    if (!wr.ok) throw new Error(`Weather error ${wr.status}`);
    const marine = (await mr.json()) as any;
    const weather = (await wr.json()) as any;
    const merged = {
      ...(marine as Record<string, unknown>),
      hourly: {
        ...((marine?.hourly as Record<string, unknown>) ?? {}),
        wind_speed_10m: weather?.hourly?.wind_speed_10m,
        wind_direction_10m: weather?.hourly?.wind_direction_10m
      }
    } as any;
    res.json({ spot: { city: first.name, latitude: first.latitude, longitude: first.longitude }, data: merged });
  } catch (error) {
    console.error('marine search error', error);
    res.status(500).json({ error: 'Failed to search marine data' });
  }
});

// Autocomplete suggest places: /api/marine/suggest?q=Herz
marineRouter.get('/suggest', async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (!q) return res.json({ results: [] });
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`;
    const geoRes = await fetch(geoUrl);
    if (!geoRes.ok) throw new Error(`Geocoding error ${geoRes.status}`);
    const geoData = (await geoRes.json()) as any;
    const results = ((geoData?.results as any[]) || []).map((r: any) => ({
      name: r.name,
      latitude: r.latitude,
      longitude: r.longitude,
      country: r.country,
      admin1: r.admin1
    }));
    res.json({ results });
  } catch (error) {
    console.error('marine suggest error', error);
    res.status(500).json({ error: 'Failed to suggest places' });
  }
});

export default marineRouter;


