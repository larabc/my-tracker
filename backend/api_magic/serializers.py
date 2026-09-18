from rest_framework import serializers

from .models import Deck, EventType, Match, Round, Tag


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


class RoundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Round
        fields = ['id', 'round_number', 'winner', 'mulligan', 'mulligan_to']

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


class MatchSerializer(serializers.ModelSerializer):
    rounds = RoundSerializer(many=True)

    class Meta:
        model = Match
        fields = '__all__'

    def create(self, validated_data):
        rounds_data = validated_data.pop('rounds')
        match = Match.objects.create(**validated_data)
        for round_data in rounds_data:
            Round.objects.create(match=match, **round_data)
        return match


class DeckStatsSerializer(serializers.Serializer):
    deck_id = serializers.IntegerField()
    deck_name = serializers.CharField()
    played = serializers.IntegerField()
    won = serializers.IntegerField()
    lost = serializers.IntegerField()
    drawn = serializers.IntegerField()
    win_rate = serializers.FloatField()
