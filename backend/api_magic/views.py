from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Deck, EventType, Match, Tag
from .serializers import (
    DeckSerializer,
    DeckStatsSerializer,
    EventTypeSerializer,
    MatchSerializer,
    TagSerializer,
)


class DeckViewSet(viewsets.ModelViewSet):
    queryset = Deck.objects.all()
    serializer_class = DeckSerializer

    @action(detail=False, methods=['get'])
    def stats(self, request):
        data = []
        for deck in Deck.objects.prefetch_related('matches'):
            played = won = lost = drawn = 0
            for match in deck.matches.all():
                outcome = match.outcome()
                if outcome is None:
                    continue
                played += 1
                if outcome == 'WIN':
                    won += 1
                elif outcome == 'LOSS':
                    lost += 1
                else:
                    drawn += 1

            data.append({
                'deck_id': deck.id,
                'deck_name': deck.name,
                'played': played,
                'won': won,
                'lost': lost,
                'drawn': drawn,
                'win_rate': round(won / played * 100, 1) if played else 0.0,
            })

        serializer = DeckStatsSerializer(data, many=True)
        return Response(serializer.data)


class EventTypeViewSet(viewsets.ModelViewSet):
    queryset = EventType.objects.all()
    serializer_class = EventTypeSerializer


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class MatchViewSet(viewsets.ModelViewSet):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
