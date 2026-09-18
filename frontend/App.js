import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Decks from './Decks';
import LifeCounter from './LifeCounter';
import MatchHistory from './MatchHistory';

const TABS = [
  { key: 'match', label: 'Live Match', icon: 'flash', screen: LifeCounter },
  { key: 'decks', label: 'Decks', icon: 'albums', screen: Decks },
  { key: 'history', label: 'History', icon: 'time', screen: MatchHistory },
];

export default function App() {
  const [screen, setScreen] = useState('match');
  const activeTab = TABS.find((tab) => tab.key === screen);
  const Screen = activeTab.screen;

  return (
    <View style={styles.container}>
      <Screen />
      <View style={styles.tabs}>
        {TABS.map((tab) => {
          const active = tab.key === screen;
          return (
            <TouchableOpacity key={tab.key} style={styles.tab} onPress={() => setScreen(tab.key)}>
              <Ionicons name={active ? tab.icon : `${tab.icon}-outline`} size={26} color={active ? '#3a7' : '#888'} />
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
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
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 8,
    paddingBottom: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#3a7',
    fontWeight: 'bold',
  },
});
