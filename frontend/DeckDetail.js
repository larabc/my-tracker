import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getEventTypes, getMatches } from './api';

function outcome(match) {
  const [mine, theirs] = match.result.split('-').map(Number);
  if (mine > theirs) return 'WIN';
  if (mine < theirs) return 'LOSS';
  return 'DRAW';
}

function getRecord(matches) {
  return matches.reduce(
    (record, match) => {
      const result = outcome(match);
      if (result === 'WIN') record.wins += 1;
      else if (result === 'LOSS') record.losses += 1;
      else record.draws += 1;
      return record;
    },
    { wins: 0, losses: 0, draws: 0 }
  );
}

export default function DeckDetail({ deck, decks, onBack }) {
  const [matches, setMatches] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);

  useEffect(() => {
    getMatches().then(setMatches);
    getEventTypes().then(setEventTypes);
  }, []);

  const deckMatches = matches.filter((match) => match.deck === deck.id);
  const { wins, losses, draws } = getRecord(deckMatches);
  const total = deckMatches.length;
  const winRate = total ? Math.round((wins / total) * 100) : 0;

  const matchupGroups = {};
  deckMatches.forEach((match) => {
    const key = match.opponent_deck ?? 'unknown';
    if (!matchupGroups[key]) matchupGroups[key] = [];
    matchupGroups[key].push(match);
  });

  const deckName = (id) => decks.find((d) => d.id === id)?.name ?? 'Unknown';
  const eventTypeName = (id) => eventTypes.find((e) => e.id === id)?.name ?? '';

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>{'< Back'}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{deck.name}</Text>
      <Text style={styles.winRate}>{total ? `${winRate}%` : '—'}</Text>
      <Text style={styles.record}>
        {wins}W {draws}D {losses}L · {total} matches
      </Text>

      <Text style={styles.sectionTitle}>Match-ups</Text>
      {Object.entries(matchupGroups).length === 0 && <Text style={styles.empty}>No matches yet</Text>}
      {Object.entries(matchupGroups).map(([key, group]) => {
        const record = getRecord(group);
        return (
          <View key={key} style={styles.row}>
            <Text style={styles.rowTitle}>{key === 'unknown' ? 'Unknown' : deckName(Number(key))}</Text>
            <Text style={styles.rowMeta}>
              {record.wins}W {record.draws}D {record.losses}L · {group.length} matches
            </Text>
          </View>
        );
      })}

      <Text style={styles.sectionTitle}>Match History</Text>
      {deckMatches.length === 0 && <Text style={styles.empty}>No matches yet</Text>}
      {deckMatches.map((match) => (
        <View key={match.id} style={styles.row}>
          <View style={styles.historyHeader}>
            <Text style={styles.rowTitle}>vs {match.opponent_deck ? deckName(match.opponent_deck) : 'Unknown'}</Text>
            <Text style={styles.result}>{match.result}</Text>
          </View>
          <Text style={styles.rowMeta}>
            {eventTypeName(match.event_type)} · {match.play_draw === 'PLAY' ? 'On the play' : 'On the draw'}
            {match.mulligan ? ` · Mulligan to ${match.mulligan_to}` : ''}
          </Text>
          <Text style={styles.rowMeta}>{new Date(match.played_at).toLocaleDateString()}</Text>
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
  back: {
    color: '#3a7',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  winRate: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 8,
  },
  record: {
    color: '#666',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#666',
    textTransform: 'uppercase',
    fontSize: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rowTitle: {
    fontWeight: 'bold',
  },
  rowMeta: {
    color: '#666',
    marginTop: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  result: {
    fontWeight: 'bold',
  },
  empty: {
    color: '#999',
    paddingVertical: 12,
  },
});
