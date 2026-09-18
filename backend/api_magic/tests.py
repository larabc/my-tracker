from django.test import TestCase
from rest_framework.test import APIClient

from .models import Deck, EventType, Match


class MatchOutcomeTests(TestCase):
    def setUp(self):
        self.deck = Deck.objects.create(
            name='Mono Red',
            format=Deck.Format.MODERN,
            colors='R',
            archetype=Deck.Archetype.AGGRO,
        )
        self.event_type = EventType.objects.create(name='League')

    def make_match(self, result):
        return Match.objects.create(
            deck=self.deck,
            mode=Match.Mode.ONLINE,
            event_type=self.event_type,
            play_draw=Match.PlayDraw.PLAY,
            result=result,
        )

    def test_win_outcome(self):
        match = self.make_match(Match.Result.R_2_0)
        self.assertEqual(match.outcome(), 'WIN')

    def test_loss_outcome(self):
        match = self.make_match(Match.Result.R_0_2)
        self.assertEqual(match.outcome(), 'LOSS')

    def test_draw_outcome(self):
        match = self.make_match(Match.Result.R_1_1)
        self.assertEqual(match.outcome(), 'DRAW')

    def test_unplayed_outcome_is_none(self):
        match = self.make_match(Match.Result.R_0_0)
        self.assertIsNone(match.outcome())


class DeckStatsEndpointTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.deck = Deck.objects.create(
            name='Mono Red',
            format=Deck.Format.MODERN,
            colors='R',
            archetype=Deck.Archetype.AGGRO,
        )
        self.event_type = EventType.objects.create(name='League')

    def make_match(self, result):
        return Match.objects.create(
            deck=self.deck,
            mode=Match.Mode.ONLINE,
            event_type=self.event_type,
            play_draw=Match.PlayDraw.PLAY,
            result=result,
        )

    def test_stats_excludes_unplayed_matches(self):
        self.make_match(Match.Result.R_2_0)
        self.make_match(Match.Result.R_0_2)
        self.make_match(Match.Result.R_0_0)

        response = self.client.get('/api/decks/stats/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [{
            'deck_id': self.deck.id,
            'deck_name': 'Mono Red',
            'played': 2,
            'won': 1,
            'lost': 1,
            'drawn': 0,
            'win_rate': 50.0,
        }])

    def test_deck_with_no_matches_has_zero_win_rate(self):
        response = self.client.get('/api/decks/stats/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, [{
            'deck_id': self.deck.id,
            'deck_name': 'Mono Red',
            'played': 0,
            'won': 0,
            'lost': 0,
            'drawn': 0,
            'win_rate': 0.0,
        }])
