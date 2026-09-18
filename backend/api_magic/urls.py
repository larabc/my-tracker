from rest_framework.routers import DefaultRouter

from .views import DeckViewSet, EventTypeViewSet, MatchViewSet, RoundViewSet, TagViewSet

router = DefaultRouter()
router.register('decks', DeckViewSet)
router.register('event-types', EventTypeViewSet)
router.register('tags', TagViewSet)
router.register('matches', MatchViewSet)
router.register('rounds', RoundViewSet)

urlpatterns = router.urls
