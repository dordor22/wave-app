export type MarineSpot = {
  city: string;
  data: any;
};

export type MarineResponse = {
  spots: MarineSpot[];
};

export async function fetchMarine(): Promise<MarineResponse> {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/marine`);
  if (!res.ok) throw new Error('Failed to load marine data');
  return res.json();
}

export async function searchMarine(q: string): Promise<{ spot: { city: string, latitude: number, longitude: number }, data: any }> {
  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
  const res = await fetch(`${base}/api/marine/search?q=${encodeURIComponent(q)}`)
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}

export async function suggestPlaces(q: string): Promise<{ results: Array<{ name: string, latitude: number, longitude: number, country?: string, admin1?: string }> }> {
  const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
  const res = await fetch(`${base}/api/marine/suggest?q=${encodeURIComponent(q)}`)
  if (!res.ok) throw new Error('Suggest failed')
  return res.json()
}


