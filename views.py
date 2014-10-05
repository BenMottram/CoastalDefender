#Django Imports
from django.core.context_processors import csrf
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render_to_response
#from django.template import request context
from django.template import Context, loader
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.shortcuts import RequestContext
#Site Imports
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from CDgame.models import mapFrame
from CDgame.models import gameState
from CDgame.models import gameStateHistory
from CDgame.models import gameIntroduction
from CDgame.models import textEntry
from CDgame.models import questionaire
from CDgame.models import questionData
#other imports
import json
#import map updating
import mapUpdater

######################################################################################
##creates the page containing the home page
#######################################################################################
def startMenu(request):   
    textOrder = textEntry.objects.all().order_by('order')
    t = loader.get_template('homeScreen.html')
    c = Context({
        'textOrder': textOrder,
    })
    return HttpResponse(t.render(c))

###########################################################################
##creates the page containing the game rules
##########################################################################
def rulesMenu(request):
    textOrder = textEntry.objects.all().order_by('order')
    t = loader.get_template('rulesScreen.html')
    c = Context({
        'textOrder': textOrder,
    })
    return HttpResponse(t.render(c))

#############################################################################
##
##
#############################################################################
def linksMenu(request):
    #page =('linkScreen.html')
    return render_to_response('linkScreen.html') 


#############################################################################
##
##
#############################################################################
def questionMenu(request):
    form = questionData(request.POST)
    if form.is_valid():
        saveForm = form.save(commit =False)
        gId = form.cleaned_data['gameId']
        q1 = form.cleaned_data['question1']
        q2 = form.cleaned_data['question2']
        q3 = form.cleaned_data['question3']
        q4 = form.cleaned_data['question4']
        q5 = form.cleaned_data['question5']
        q6 = form.cleaned_data['question6']
        q6 = form.cleaned_data['question7']
        q6 = form.cleaned_data['question8']
        saveForm.save()
        return HttpResponseRedirect("http://benjirama.webfactional.com/map/CDgame/questionMenu/")
    return render_to_response('questionScreen.html', locals(), context_instance=RequestContext(request))

 
#########################################################
##
##
############################################################
   
              
    
####################################################################
##The buildFrame View renders the page for the map to appear on
####################################################################

@csrf_exempt
def buildFrame(request):
    mapView = mapFrame
    t = loader.get_template('mapScreen.html')
    c = Context({
        'mapView': mapView,
    })
    return HttpResponse(t.render(c))


####################################################################
##Called by the POST function and calls the createMap function
##1.converts all members of the POST object into JSON for processing.
##2.Calls the buildMap function that creates the JSON array.
##3.returns the JSON array
##this returns the JSON required to model the hex Grid
####################################################################
@csrf_exempt
def mapmaker(request):
    startMap = json.loads(request.POST["startMap"])
    x = json.loads(request.POST["xLength"])
    y = json.loads(request.POST["yLength"])
    rawMap = mapUpdater.buildMap(x,y,startMap)
    return HttpResponse(rawMap)


########################################################################
##Called by the POST function newTurn to update the hexGrid
##The JSON data created via the mapmaker view is returned back here, as follows...
##1. The recived JSON data is converted back in to its python analogs for processing via json.loads
##2. it calls seaPower
##3. it calls changeGrid
##4. it calls changeGrid
##5. converts the data to a JSON like object to be saved within the SQL database via the saveState function
##6. this process is repeated with the historyData via the saveGame function.
##7. A unique gameId is generated via the getGameId function.
##8. an Empty dictionary is created and the resulting POSTMap (hexgrid), convertedHistory (historyData), and uniqueID are stored as entries
##9. This dictionary is converted into JSON via dumps and returned to the client side.
##please note this view is csrf exempt
##########################################################################
@csrf_exempt  
def newTurn(request):
    POSTMap = json.loads(request.POST["jsonData"])
    historyData = json.loads(request.POST["historyData"])
    xLen = json.loads(request.POST["mapX"])
    yLen = json.loads(request.POST["mapY"])
    bias = json.loads(request.POST["biasMap"])
    modifiers = json.loads(request.POST["modifyList"])
    
    POSTMap = mapUpdater.seaPower(POSTMap,xLen,yLen,modifiers,bias)
    POSTMap = mapUpdater.changeGrid(POSTMap,xLen,yLen)
    
    convertedData = json.dumps(POSTMap)
    turnId = mapUpdater.saveState(convertedData)

    historyId = mapUpdater.mergeHistory(historyData, turnId)
    convertedHistory = json.dumps(historyId)
    gameId = mapUpdater.saveGame(convertedHistory)
    uniqueId = mapUpdater.getGameId(historyId)    

    returnData = {}
    returnData["gameData"] = POSTMap
    returnData["historyData"] = convertedHistory
    returnData["uniqueId"] = uniqueId
    returnJSON = json.dumps(returnData)
    
    return HttpResponse(returnJSON)

###################################################################################################
##Called by the POST function loadOldTurn  
##1. The recived JSON data is converted back in to its python analogs for processing via json.loads
##2.  Calls the revertOldTurn function and converts the historyString attribute of the returned object
## to its python equliviant.
##3. A unique gameId is generated via the getGameId function.
##4. an Empty dictionary is created and the resulting POSTMap (hexgrid), convertedHistory (historyData), and uniqueID are stored as entries
##5. This dictionary is converted into JSON via dumps and returned to the client side.
###################################################################################################
@csrf_exempt
def loadOldTurn(request):
    POSTHistory = json.loads(request.POST["historyData"])
    POSTTurn = json.loads(request.POST["turnData"])
    
    retrivedTurn = mapUpdater.revertOldTurn(POSTTurn)
    retrivedTurn = retrivedTurn.terrainString
    retrivedTurn = json.loads(retrivedTurn)

    uniqueId = mapUpdater.getGameId(POSTHistory)
    
    returnData = {}
    returnData["gameData"] = retrivedTurn
    returnData["uniqueId"] = uniqueId
    returnJSON = json.dumps(returnData)
    return HttpResponse(returnJSON)

##############################################################################################
##This function is called by the LoadById function client side
##1. The recived JSON data is converted back in to its python analogs for processing via json.loads
##2.  Calls the loadHistory function and converts the historyString attribute of the returned object
## to its python equliviant.
##3. retrives the current turn ID by calling the convertHistoryData function
##4. uses the currentTurn variable to retrive the terrainString via the revertOldTurn function and
##converts it to its python equlivant.
##5. A unique gameId is generated via the getGameId function.
##6. an Empty dictionary is created and the resulting POSTMap (hexgrid), convertedHistory (historyData), and uniqueID are stored as entries
##7. This dictionary is converted into JSON via dumps and returned to the client side.
#############################################################################################
@csrf_exempt
def loadSavedGame(request):
    POSTId = json.loads(request.POST["gameIdData"])
    retrivedHistory = mapUpdater.loadHistory(POSTId)
    historyData = retrivedHistory.historyString
    currentTurn = mapUpdater.convertHistoryData(historyData)
    retrivedGame = mapUpdater.revertOldTurn(currentTurn)
    retrivedGame = retrivedGame.terrainString
    retrivedGame = json.loads(retrivedGame)

    uniqueId = mapUpdater.getGameId(historyData)
    
    returnData = {}
    returnData["gameData"] = retrivedGame
    returnData["historyData"] = historyData
    returnData["uniqueId"] = uniqueId
    returnJSON = json.dumps(returnData)
    return HttpResponse(returnJSON)
