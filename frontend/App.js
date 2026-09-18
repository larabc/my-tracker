import { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import Decks from './Decks';
import LifeCounter from './LifeCounter';
import MatchHistory from './MatchHistory';

const SCREENS = {
  match: LifeCounter,
  decks: Decks,
  history: MatchHistory,
};

export default function App() {
  const [screen, setScreen] = useState('match');
  const Screen = SCREENS[screen];

  return (
    <View style={styles.container}>
      <Screen />
      <View style={styles.tabs}>
        <Button title="Live Match" onPress={() => setScreen('match')} />
        <Button title="Decks" onPress={() => setScreen('decks')} />
        <Button title="History" onPress={() => setScreen('history')} />
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
});
