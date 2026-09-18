import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const STARTING_LIFE = 20;
const QUICK_CHANGES = [-5, -1, 1, 5];

function PlayerLife({ name, life, setLife, flipped }) {
  return (
    <View style={[styles.player, flipped && styles.flipped]}>
      <Text style={styles.name}>{name}</Text>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={() => setLife(life - 1)}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.life}>{life}</Text>
        <TouchableOpacity style={styles.button} onPress={() => setLife(life + 1)}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.quickRow}>
        {QUICK_CHANGES.map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[styles.quickButton, amount > 0 ? styles.quickButtonUp : styles.quickButtonDown]}
            onPress={() => setLife(life + amount)}
          >
            <Text style={amount > 0 ? styles.quickButtonTextUp : styles.quickButtonTextDown}>
              {amount > 0 ? `+${amount}` : amount}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function LifeCounter() {
  const [life1, setLife1] = useState(STARTING_LIFE);
  const [life2, setLife2] = useState(STARTING_LIFE);

  const reset = () => {
    setLife1(STARTING_LIFE);
    setLife2(STARTING_LIFE);
  };

  return (
    <View style={styles.container}>
      <PlayerLife name="Player 2" life={life2} setLife={setLife2} flipped />

      <TouchableOpacity style={styles.resetButton} onPress={reset}>
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>

      <PlayerLife name="Player 1" life={life1} setLife={setLife1} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  player: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipped: {
    transform: [{ rotate: '180deg' }],
  },
  name: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  life: {
    color: '#fff',
    fontSize: 64,
    fontWeight: 'bold',
    marginHorizontal: 24,
    minWidth: 80,
    textAlign: 'center',
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
  },
  quickRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  quickButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginHorizontal: 4,
  },
  quickButtonUp: {
    borderColor: '#3a7',
  },
  quickButtonDown: {
    borderColor: '#a33',
  },
  quickButtonTextUp: {
    color: '#3a7',
  },
  quickButtonTextDown: {
    color: '#a33',
  },
  resetButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 6,
  },
  resetButtonText: {
    color: '#aaa',
  },
});
