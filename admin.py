from django.contrib import admin
from CDgame.models import mapFrame
from CDgame.models import gameState
from CDgame.models import textEntry
from CDgame.models import gameStateHistory
from CDgame.models import questionaire


admin.site.register(mapFrame)
admin.site.register(gameState)
admin.site.register(textEntry)
admin.site.register(gameStateHistory)
admin.site.register(questionaire)

