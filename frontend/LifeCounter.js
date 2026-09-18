import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const STARTING_LIFE = 20;
const QUICK_CHANGES = [-5, -1, 1, 5];
const EMPTY_MANA = { C: 0, G: 0, R: 0, B: 0, U: 0, W: 0 };
const DICE_OPTIONS = [
  { key: 'd6', label: 'D6', roll: () => String(Math.floor(Math.random() * 6) + 1) },
  { key: 'd20', label: 'D20', roll: () => String(Math.floor(Math.random() * 20) + 1) },
  { key: 'coin', label: 'Coin', roll: () => (Math.random() < 0.5 ? 'Heads' : 'Tails') },
];
const MANA_COLORS = [
  { key: 'C', label: '◇', bg: '#3a3f4b' },
  { key: 'G', label: 'G', bg: '#2f6b3a' },
  { key: 'R', label: 'R', bg: '#a33' },
  { key: 'B', label: 'B', bg: '#222' },
  { key: 'U', label: 'U', bg: '#245a8f' },
  { key: 'W', label: 'W', bg: '#e8e4d0', textColor: '#000' },
];

function ManaPool({ mana, onChange }) {
  return (
    <View style={styles.manaRow}>
      {MANA_COLORS.map((color) => (
        <View key={color.key} style={styles.manaColumn}>
          <TouchableOpacity onPress={() => onChange(color.key, 1)}>
            <Text style={styles.manaArrow}>+</Text>
          </TouchableOpacity>
          <View style={[styles.manaCircle, { backgroundColor: color.bg }]}>
            <Text style={[styles.manaCircleText, color.textColor && { color: color.textColor }]}>
              {color.label}
            </Text>
          </View>
          <Text style={styles.manaCount}>{mana[color.key]}</Text>
          <TouchableOpacity onPress={() => onChange(color.key, -1)}>
            <Text style={styles.manaArrow}>-</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

function PlayerLife({ name, life, setLife, mana, onManaChange, manaVisible, flipped }) {
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
      {manaVisible && <ManaPool mana={mana} onChange={onManaChange} />}
    </View>
  );
}

export default function LifeCounter() {
  const [life1, setLife1] = useState(STARTING_LIFE);
  const [life2, setLife2] = useState(STARTING_LIFE);
  const [mana1, setMana1] = useState(EMPTY_MANA);
  const [mana2, setMana2] = useState(EMPTY_MANA);
  const [manaVisible, setManaVisible] = useState(false);
  const [diceVisible, setDiceVisible] = useState(false);
  const [diceResult, setDiceResult] = useState(null);

  const reset = () => {
    setLife1(STARTING_LIFE);
    setLife2(STARTING_LIFE);
    setMana1(EMPTY_MANA);
    setMana2(EMPTY_MANA);
    setDiceResult(null);
  };

  const rollDice = (option) => {
    setDiceResult(`${option.label}: ${option.roll()}`);
  };

  const changeMana = (setMana) => (color, delta) => {
    setMana((prev) => ({ ...prev, [color]: Math.max(0, prev[color] + delta) }));
  };

  return (
    <View style={styles.container}>
      <PlayerLife
        name="Player 2"
        life={life2}
        setLife={setLife2}
        mana={mana2}
        onManaChange={changeMana(setMana2)}
        manaVisible={manaVisible}
        flipped
      />

      <View style={styles.middleBar}>
        <TouchableOpacity style={styles.middleButton} onPress={reset}>
          <Text style={styles.middleButtonText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.middleButton, manaVisible && styles.middleButtonActive]}
          onPress={() => setManaVisible((visible) => !visible)}
        >
          <Text style={styles.middleButtonText}>Mana</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.middleButton, diceVisible && styles.middleButtonActive]}
          onPress={() => setDiceVisible((visible) => !visible)}
        >
          <Text style={styles.middleButtonText}>Dice</Text>
        </TouchableOpacity>
      </View>

      {diceVisible && (
        <View style={styles.diceRow}>
          {DICE_OPTIONS.map((option) => (
            <TouchableOpacity key={option.key} style={styles.diceButton} onPress={() => rollDice(option)}>
              <Text style={styles.diceButtonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
          {diceResult && <Text style={styles.diceResult}>{diceResult}</Text>}
        </View>
      )}

      <PlayerLife
        name="Player 1"
        life={life1}
        setLife={setLife1}
        mana={mana1}
        onManaChange={changeMana(setMana1)}
        manaVisible={manaVisible}
      />
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
  manaRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  manaColumn: {
    alignItems: 'center',
    marginHorizontal: 6,
  },
  manaCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  manaCircleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  manaCount: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 4,
  },
  manaArrow: {
    color: '#888',
    fontSize: 16,
    paddingHorizontal: 8,
  },
  middleBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#222',
  },
  middleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 6,
    marginHorizontal: 8,
  },
  middleButtonActive: {
    borderColor: '#3a7',
  },
  middleButtonText: {
    color: '#aaa',
  },
  diceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#222',
  },
  diceButton: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  diceButtonText: {
    color: '#ccc',
  },
  diceResult: {
    color: '#fff',
    marginLeft: 12,
    fontSize: 14,
  },
});
