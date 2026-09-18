import { useEffect, useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createDeck, getDecks } from './api';
import DeckDetail from './DeckDetail';

const FORMATS = [
  { value: 'STD', label: 'Standard' },
  { value: 'PIO', label: 'Pioneer' },
  { value: 'MOD', label: 'Modern' },
  { value: 'LEG', label: 'Legacy' },
  { value: 'VIN', label: 'Vintage' },
  { value: 'PAU', label: 'Pauper' },
  { value: 'CMD', label: 'Commander' },
];

const ARCHETYPES = [
  { value: 'AGGRO', label: 'Aggro' },
  { value: 'MIDRANGE', label: 'Midrange' },
  { value: 'CONTROL', label: 'Control' },
  { value: 'COMBO', label: 'Combo' },
  { value: 'TEMPO', label: 'Tempo' },
  { value: 'RAMP', label: 'Ramp' },
];

const COLOR_LETTERS = ['W', 'U', 'B', 'R', 'G'];

function Choice({ label, selected, onPress }) {
  return (
    <TouchableOpacity style={[styles.choice, selected && styles.choiceSelected]} onPress={onPress}>
      <Text style={styles.choiceText}>{label}</Text>
    </TouchableOpacity>
  );
}

function NewDeckModal({ visible, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [format, setFormat] = useState(null);
  const [colors, setColors] = useState([]);
  const [archetype, setArchetype] = useState(null);
  const [comments, setComments] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleColor = (letter) => {
    setColors((prev) => (prev.includes(letter) ? prev.filter((c) => c !== letter) : [...prev, letter]));
  };

  const save = async () => {
    if (!name || !format || !archetype) {
      return;
    }
    setSaving(true);
    try {
      await createDeck({
        name,
        format,
        archetype,
        colors: COLOR_LETTERS.filter((letter) => colors.includes(letter)).join(''),
        comments,
      });
      setName('');
      setFormat(null);
      setColors([]);
      setArchetype(null);
      setComments('');
      onCreated();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView>
            <Text style={styles.title}>New Deck</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Deck name"
              placeholderTextColor="#666"
            />

            <Text style={styles.label}>Format</Text>
            <View style={styles.row}>
              {FORMATS.map((option) => (
                <Choice
                  key={option.value}
                  label={option.label}
                  selected={format === option.value}
                  onPress={() => setFormat(option.value)}
                />
              ))}
            </View>

            <Text style={styles.label}>Colors</Text>
            <View style={styles.row}>
              {COLOR_LETTERS.map((letter) => (
                <Choice key={letter} label={letter} selected={colors.includes(letter)} onPress={() => toggleColor(letter)} />
              ))}
            </View>

            <Text style={styles.label}>Archetype</Text>
            <View style={styles.row}>
              {ARCHETYPES.map((option) => (
                <Choice
                  key={option.value}
                  label={option.label}
                  selected={archetype === option.value}
                  onPress={() => setArchetype(option.value)}
                />
              ))}
            </View>

            <Text style={styles.label}>Comments</Text>
            <TextInput
              style={[styles.input, styles.multiline]}
              value={comments}
              onChangeText={setComments}
              placeholder="Optional notes"
              placeholderTextColor="#666"
              multiline
            />

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={save} disabled={saving}>
                <Text style={styles.actionText}>{saving ? 'Saving...' : 'Create'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default function Decks() {
  const [decks, setDecks] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState(null);

  const loadDecks = () => {
    getDecks().then(setDecks);
  };

  useEffect(() => {
    loadDecks();
  }, []);

  if (selectedDeck) {
    return <DeckDetail deck={selectedDeck} decks={decks} onBack={() => setSelectedDeck(null)} />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={decks}
        keyExtractor={(deck) => String(deck.id)}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.deckRow} onPress={() => setSelectedDeck(item)}>
            <Text style={styles.deckName}>{item.name}</Text>
            <Text style={styles.deckMeta}>
              {item.format} · {item.colors} · {item.archetype}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No decks yet</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => setFormVisible(true)}>
        <Text style={styles.addButtonText}>+ New Deck</Text>
      </TouchableOpacity>
      <NewDeckModal
        visible={formVisible}
        onClose={() => setFormVisible(false)}
        onCreated={() => {
          setFormVisible(false);
          loadDecks();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  deckRow: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  deckName: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  deckMeta: {
    color: '#666',
    marginTop: 4,
    fontSize: 14,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
  },
  addButton: {
    backgroundColor: '#3a7',
    paddingVertical: 18,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 20,
    maxHeight: '85%',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    color: '#aaa',
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    fontSize: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  multiline: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  choice: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  choiceSelected: {
    borderColor: '#3a7',
  },
  choiceText: {
    color: '#fff',
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  saveButton: {
    backgroundColor: '#3a7',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
  },
});
