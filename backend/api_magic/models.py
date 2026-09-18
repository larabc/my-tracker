from django.db import models
from django.utils import timezone


class EventType(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name


class Deck(models.Model):
    class Format(models.TextChoices):
        STANDARD = 'STD', 'Standard'
        PIONEER = 'PIO', 'Pioneer'
        MODERN = 'MOD', 'Modern'
        LEGACY = 'LEG', 'Legacy'
        VINTAGE = 'VIN', 'Vintage'
        PAUPER = 'PAU', 'Pauper'
        COMMANDER = 'CMD', 'Commander'

    class Archetype(models.TextChoices):
        AGGRO = 'AGGRO', 'Aggro'
        MIDRANGE = 'MIDRANGE', 'Midrange'
        CONTROL = 'CONTROL', 'Control'
        COMBO = 'COMBO', 'Combo'
        TEMPO = 'TEMPO', 'Tempo'
        RAMP = 'RAMP', 'Ramp'

    name = models.CharField(max_length=100)
    format = models.CharField(max_length=3, choices=Format.choices)
    colors = models.CharField(max_length=5, help_text='E.g. "RB", "WU", "WUBRG"')
    archetype = models.CharField(max_length=10, choices=Archetype.choices)
    comments = models.TextField(blank=True)
    archived = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class Match(models.Model):
    class Mode(models.TextChoices):
        ONLINE = 'ONLINE', 'Online (MTGO)'
        IN_PERSON = 'IN_PERSON', 'En persona'

    class PlayDraw(models.TextChoices):
        PLAY = 'PLAY', 'On the play'
        DRAW = 'DRAW', 'On the draw'

    class Result(models.TextChoices):
        R_0_0 = '0-0', '0-0'
        R_1_0 = '1-0', '1-0'
        R_2_0 = '2-0', '2-0'
        R_2_1 = '2-1', '2-1'
        R_0_1 = '0-1', '0-1'
        R_0_2 = '0-2', '0-2'
        R_1_2 = '1-2', '1-2'
        R_1_1 = '1-1', '1-1'

    class MulliganTo(models.TextChoices):
        SIX = '6', '6'
        FIVE = '5', '5'
        FOUR = '4', '4'
        THREE_OR_FEWER = '3-', '3 o menos'

    deck = models.ForeignKey(Deck, on_delete=models.PROTECT, related_name='matches')
    opponent_deck = models.ForeignKey(
        Deck, on_delete=models.SET_NULL, null=True, blank=True, related_name='opponent_matches'
    )
    mode = models.CharField(max_length=9, choices=Mode.choices)
    event_type = models.ForeignKey(EventType, on_delete=models.PROTECT, related_name='matches')
    play_draw = models.CharField(max_length=4, choices=PlayDraw.choices)
    result = models.CharField(max_length=3, choices=Result.choices)
    mulligan = models.BooleanField(default=False)
    mulligan_to = models.CharField(max_length=2, choices=MulliganTo.choices, blank=True, null=True)
    played_at = models.DateTimeField(default=timezone.now)
    tags = models.ManyToManyField(Tag, blank=True, related_name='matches')

    def __str__(self):
        return f'{self.deck.name} - {self.result} ({self.played_at:%Y-%m-%d})'

    def outcome(self):
        """Returns 'WIN', 'LOSS', 'DRAW', or None if the match has no result yet (0-0)."""
        if self.result == self.Result.R_0_0:
            return None
        wins, losses = (int(n) for n in self.result.split('-'))
        if wins > losses:
            return 'WIN'
        if wins < losses:
            return 'LOSS'
        return 'DRAW'
