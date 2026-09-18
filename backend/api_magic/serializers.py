from rest_framework import serializers

from .models import Deck, EventType, Match, Tag


class DeckSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deck
        fields = '__all__'


class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventType
        fields = '__all__'


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'

    def validate(self, data):
        mulligan = data.get('mulligan', getattr(self.instance, 'mulligan', False))
        mulligan_to = data.get('mulligan_to', getattr(self.instance, 'mulligan_to', None))

        if mulligan and not mulligan_to:
            raise serializers.ValidationError(
                {'mulligan_to': 'Required when mulligan is true.'}
            )
        if not mulligan and mulligan_to:
            raise serializers.ValidationError(
                {'mulligan_to': 'Must be empty when mulligan is false.'}
            )
        return data
