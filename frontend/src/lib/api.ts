export type MarineSpot = {
  city: string;
  data: any;
};

export type MarineResponse = {
  spots: MarineSpot[];
};

// Base URL – תמיד יחסי, כך שיפנה דרך ה-Ingress (/api)
const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

export async function fetchMarine(): Promise<MarineResponse> {
  const res = await fetch(`${API_BASE}/api/marine`);
  if (!res.ok) throw new Error('Failed to load marine data');
  return res.json();
}

export async function searchMarine(q: string): Promise<{ spot: { city: string, latitude: number, longitude: number }, data: any }> {
  const res = await fetch(`${API_BASE}/api/marine/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

export async function suggestPlaces(q: string): Promise<{ results: Array<{ name: string, latitude: number, longitude: number, country?: string, admin1?: string }> }> {
  const res = await fetch(`${API_BASE}/api/marine/suggest?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error('Suggest failed');
  return res.json();
}
