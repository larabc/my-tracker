import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { getDeckStats } from './api';

export default function App() {
  const [decks, setDecks] = useState([]);

  useEffect(() => {
    getDeckStats().then(setDecks);
  }, []);

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  name: {
    fontWeight: 'bold',
  },
});
