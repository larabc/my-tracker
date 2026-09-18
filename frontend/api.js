const API_URL = 'http://192.168.1.146:8000/api';

export async function getDeckStats() {
  const response = await fetch(`${API_URL}/decks/stats/`);
  return response.json();
}
