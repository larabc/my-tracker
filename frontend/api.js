const API_URL = 'http://192.168.1.146:8000/api';

export async function getDecks() {
  const response = await fetch(`${API_URL}/decks/`);
  return response.json();
}

export async function getEventTypes() {
  const response = await fetch(`${API_URL}/event-types/`);
  return response.json();
}

export async function getMatches() {
  const response = await fetch(`${API_URL}/matches/`);
  return response.json();
}

export async function createDeck(deck) {
  const response = await fetch(`${API_URL}/decks/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deck),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
}

export async function createMatch(match) {
  const response = await fetch(`${API_URL}/matches/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(match),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
}
