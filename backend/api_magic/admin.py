from django.contrib import admin

from .models import Deck, EventType, Match, Round, Tag


@admin.register(Deck)
class DeckAdmin(admin.ModelAdmin):
    list_display = ("name", "format", "colors", "archetype", "archived")
    list_filter = ("format", "archetype", "archived")
    search_fields = ("name",)


@admin.register(EventType)
class EventTypeAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ("name",)


class RoundInline(admin.TabularInline):
    model = Round
    extra = 0


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = (
        "deck",
        "opponent_deck",
        "mode",
        "event_type",
        "result",
        "play_draw",
        "played_at",
    )
    list_filter = ("mode", "event_type", "result")
    autocomplete_fields = ("deck", "opponent_deck")
    inlines = [RoundInline]
