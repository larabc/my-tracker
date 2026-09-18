from django.contrib import admin

from .models import Deck, EventType, Match, Tag


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


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = (
        "deck",
        "opponent_deck",
        "mode",
        "event_type",
        "result",
        "play_draw",
        "mulligan",
        "played_at",
    )
    list_filter = ("mode", "event_type", "result", "mulligan")
    autocomplete_fields = ("deck", "opponent_deck")
