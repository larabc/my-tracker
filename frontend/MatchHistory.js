import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getDecks, getEventTypes, getMatches } from './api';
import { mulliganSummary, outcome } from './matchUtils';

const RESULT_OPTIONS = [
  { value: 'WIN', label: 'Win' },
  { value: 'LOSS', label: 'Loss' },
  { value: 'DRAW', label: 'Draw' },
];

function Choice({ label, selected, onPress }) {
  return (
    <TouchableOpacity style={[styles.choice, selected && styles.choiceSelected]} onPress={onPress}>
      <Text style={styles.choiceText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function MatchHistory() {
  const [matches, setMatches] = useState([]);
  const [decks, setDecks] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);

  const [deckId, setDeckId] = useState(null);
  const [opponentDeckId, setOpponentDeckId] = useState(null);
  const [result, setResult] = useState(null);
  const [eventTypeId, setEventTypeId] = useState(null);

  useEffect(() => {
    getMatches().then(setMatches);
    getDecks().then(setDecks);
    getEventTypes().then(setEventTypes);
  }, []);

  const deckName = (id) => decks.find((d) => d.id === id)?.name ?? 'Unknown';
  const eventTypeName = (id) => eventTypes.find((e) => e.id === id)?.name ?? '';

  const filteredMatches = matches
    .filter((match) => !deckId || match.deck === deckId)
    .filter((match) => !opponentDeckId || match.opponent_deck === opponentDeckId)
    .filter((match) => !result || outcome(match) === result)
    .filter((match) => !eventTypeId || match.event_type === eventTypeId)
    .sort((a, b) => new Date(b.played_at) - new Date(a.played_at));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Match History</Text>

      <Text style={styles.filterLabel}>Deck</Text>
      <View style={styles.row}>
        <Choice label="All" selected={deckId === null} onPress={() => setDeckId(null)} />
        {decks.map((deck) => (
          <Choice key={deck.id} label={deck.name} selected={deckId === deck.id} onPress={() => setDeckId(deck.id)} />
        ))}
      </View>

      <Text style={styles.filterLabel}>Opponent's deck</Text>
      <View style={styles.row}>
        <Choice label="All" selected={opponentDeckId === null} onPress={() => setOpponentDeckId(null)} />
        {decks.map((deck) => (
          <Choice
            key={deck.id}
            label={deck.name}
            selected={opponentDeckId === deck.id}
            onPress={() => setOpponentDeckId(deck.id)}
          />
        ))}
      </View>

      <Text style={styles.filterLabel}>Result</Text>
      <View style={styles.row}>
        <Choice label="All" selected={result === null} onPress={() => setResult(null)} />
        {RESULT_OPTIONS.map((option) => (
          <Choice
            key={option.value}
            label={option.label}
            selected={result === option.value}
            onPress={() => setResult(option.value)}
          />
        ))}
      </View>

      <Text style={styles.filterLabel}>Event type</Text>
      <View style={styles.row}>
        <Choice label="All" selected={eventTypeId === null} onPress={() => setEventTypeId(null)} />
        {eventTypes.map((eventType) => (
          <Choice
            key={eventType.id}
            label={eventType.name}
            selected={eventTypeId === eventType.id}
            onPress={() => setEventTypeId(eventType.id)}
          />
        ))}
      </View>

      <Text style={styles.filterLabel}>{filteredMatches.length} matches</Text>
      {filteredMatches.length === 0 && <Text style={styles.empty}>No matches found</Text>}
      {filteredMatches.map((match) => (
        <View key={match.id} style={styles.matchRow}>
          <View style={styles.matchHeader}>
            <Text style={styles.matchTitle}>
              {deckName(match.deck)} vs {match.opponent_deck ? deckName(match.opponent_deck) : 'Unknown'}
            </Text>
            <Text style={styles.result}>{match.result}</Text>
          </View>
          <Text style={styles.matchMeta}>
            {eventTypeName(match.event_type)} · {match.play_draw === 'PLAY' ? 'On the play' : 'On the draw'}
          </Text>
          {mulliganSummary(match) && <Text style={styles.matchMeta}>{mulliganSummary(match)}</Text>}
          <Text style={styles.matchMeta}>{new Date(match.played_at).toLocaleDateString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  filterLabel: {
    color: '#666',
    textTransform: 'uppercase',
    fontSize: 12,
    marginTop: 12,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  choice: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  choiceSelected: {
    borderColor: '#3a7',
    backgroundColor: '#e6f7ee',
  },
  choiceText: {
    color: '#000',
    fontSize: 16,
  },
  matchRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  matchTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    flexShrink: 1,
    marginRight: 8,
  },
  result: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  matchMeta: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
  empty: {
    color: '#999',
    paddingVertical: 12,
  },
});
