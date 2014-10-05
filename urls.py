from django.conf.urls.defaults import *

import views

urlpatterns = patterns('',
    url(r'^$', 'CDgame.views.startMenu'),
    url(r'^rulesMenu/$', 'CDgame.views.rulesMenu'),
    url(r'^questionMenu/$', 'CDgame.views.questionMenu'),
    url(r'^linksMenu/$', 'CDgame.views.linksMenu'),
    url(r'^buildFrame/$', 'CDgame.views.buildFrame', name ='createFrame'),                   
    url(r'^buildFrame/mapmaker/$', 'CDgame.views.mapmaker'),
    url(r'^buildFrame/newTurn/$', 'CDgame.views.newTurn'),
    url(r'^buildFrame/loadOldTurn/$', 'CDgame.views.loadOldTurn'),
    url(r'^buildFrame/loadSavedGame/$', 'CDgame.views.loadSavedGame'),
)
