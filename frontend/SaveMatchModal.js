import { useEffect, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createMatch, getDecks, getEventTypes } from './api';

const MODE_OPTIONS = [
  { value: 'ONLINE', label: 'Online' },
  { value: 'IN_PERSON', label: 'In person' },
];

const PLAY_DRAW_OPTIONS = [
  { value: 'PLAY', label: 'On the play' },
  { value: 'DRAW', label: 'On the draw' },
];

const MULLIGAN_TO_OPTIONS = [
  { value: '6', label: '6' },
  { value: '5', label: '5' },
  { value: '4', label: '4' },
  { value: '3-', label: '3 or fewer' },
];

function Choice({ label, selected, onPress }) {
  return (
    <TouchableOpacity style={[styles.choice, selected && styles.choiceSelected]} onPress={onPress}>
      <Text style={styles.choiceText}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function SaveMatchModal({ visible, result, onClose, onSaved }) {
  const [decks, setDecks] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [deckId, setDeckId] = useState(null);
  const [opponentDeckId, setOpponentDeckId] = useState(null);
  const [eventTypeId, setEventTypeId] = useState(null);
  const [mode, setMode] = useState('IN_PERSON');
  const [playDraw, setPlayDraw] = useState('PLAY');
  const [mulligan, setMulligan] = useState(false);
  const [mulliganTo, setMulliganTo] = useState(null);
  const [playedAt, setPlayedAt] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      getDecks().then(setDecks);
      getEventTypes().then(setEventTypes);
    }
  }, [visible]);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setPlayedAt(selectedDate);
    }
  };

  const save = async () => {
    if (!deckId || !eventTypeId) {
      Alert.alert('Missing info', 'Pick a deck and an event type first.');
      return;
    }
    if (mulligan && !mulliganTo) {
      Alert.alert('Missing info', 'Pick how low the mulligan went.');
      return;
    }

    setSaving(true);
    try {
      await createMatch({
        deck: deckId,
        opponent_deck: opponentDeckId,
        event_type: eventTypeId,
        mode,
        play_draw: playDraw,
        result,
        mulligan,
        mulligan_to: mulligan ? mulliganTo : null,
        played_at: playedAt.toISOString(),
      });
      setPlayedAt(new Date());
      onSaved();
    } catch (error) {
      Alert.alert('Could not save', String(error.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <ScrollView>
            <Text style={styles.title}>Save match ({result})</Text>

            <Text style={styles.label}>Deck</Text>
            <View style={styles.row}>
              {decks.map((deck) => (
                <Choice
                  key={deck.id}
                  label={deck.name}
                  selected={deckId === deck.id}
                  onPress={() => setDeckId(deck.id)}
                />
              ))}
            </View>

            <Text style={styles.label}>Opponent's deck (optional)</Text>
            <View style={styles.row}>
              <Choice label="Unknown" selected={opponentDeckId === null} onPress={() => setOpponentDeckId(null)} />
              {decks.map((deck) => (
                <Choice
                  key={deck.id}
                  label={deck.name}
                  selected={opponentDeckId === deck.id}
                  onPress={() => setOpponentDeckId(deck.id)}
                />
              ))}
            </View>

            <Text style={styles.label}>Event type</Text>
            <View style={styles.row}>
              {eventTypes.map((eventType) => (
                <Choice
                  key={eventType.id}
                  label={eventType.name}
                  selected={eventTypeId === eventType.id}
                  onPress={() => setEventTypeId(eventType.id)}
                />
              ))}
            </View>

            <Text style={styles.label}>Mode</Text>
            <View style={styles.row}>
              {MODE_OPTIONS.map((option) => (
                <Choice
                  key={option.value}
                  label={option.label}
                  selected={mode === option.value}
                  onPress={() => setMode(option.value)}
                />
              ))}
            </View>

            <Text style={styles.label}>Play or draw</Text>
            <View style={styles.row}>
              {PLAY_DRAW_OPTIONS.map((option) => (
                <Choice
                  key={option.value}
                  label={option.label}
                  selected={playDraw === option.value}
                  onPress={() => setPlayDraw(option.value)}
                />
              ))}
            </View>

            <Text style={styles.label}>Date</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.choiceText}>{playedAt.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker value={playedAt} mode="date" display="default" onChange={onChangeDate} />
            )}

            <Text style={styles.label}>Mulligan?</Text>
            <View style={styles.row}>
              <Choice label="No" selected={!mulligan} onPress={() => { setMulligan(false); setMulliganTo(null); }} />
              <Choice label="Yes" selected={mulligan} onPress={() => setMulligan(true)} />
            </View>

            {mulligan && (
              <>
                <Text style={styles.label}>Mulligan to</Text>
                <View style={styles.row}>
                  {MULLIGAN_TO_OPTIONS.map((option) => (
                    <Choice
                      key={option.value}
                      label={option.label}
                      selected={mulliganTo === option.value}
                      onPress={() => setMulliganTo(option.value)}
                    />
                  ))}
                </View>
              </>
            )}

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={save} disabled={saving}>
                <Text style={styles.actionText}>{saving ? 'Saving...' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  dateButton: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
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
