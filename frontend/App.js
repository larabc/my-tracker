import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { getDeckStats } from './api';
import LifeCounter from './LifeCounter';

function DeckStats() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    getDeckStats().then(setDecks);
  }, []);

  return (
    <FlatList
      data={decks}
      keyExtractor={(deck) => String(deck.deck_id)}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.name}>{item.deck_name}</Text>
          <Text>Win rate: {item.win_rate}%</Text>
        </View>
      )}
    />
  );
}

export default function App() {
  const [screen, setScreen] = useState('match');

  return (
    <View style={styles.container}>
      {screen === 'match' ? <LifeCounter /> : <DeckStats />}
      <View style={styles.tabs}>
        <Button title="Live Match" onPress={() => setScreen('match')} />
        <Button title="Stats" onPress={() => setScreen('stats')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10,
  },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  name: {
    fontWeight: 'bold',
  },
});
