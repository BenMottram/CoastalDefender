import json
import random
from CDgame.models import gameState
from CDgame.models import gameStateHistory
################################################################################################
##mapUpdater contains the functions required to changed the JSON data sent by the newTurn button
##These functions are called by the mapMaker and newTurn view.
################################################################################################


##################################################
##The raw JSON into which the inital JSON array is placed
##################################################
theGrid = {"hexGrid":[]}

#####################################################
##The buildMap function which contains a 2d for loop
##It takes the JSON passed from the view as arguments, in this case.
##The lenght and width of the hexgrid(xAxis and yAxis) and the inital StartMap array
##at each point in the 2d array a new JSON object is created
##x=current x cordinate
##y=current y cordinate
##terrain = the terrain at the x,y cordinate of the startmap 2d array
##modified = set to 0 (for false)
##hasLine = 0 (as a default) will change on the client side during the game.
##it is returned as a string for transfer to the client
####################################################

def buildMap(xAxis,yAxis,startMap):
    for x in range(0,xAxis):
        theGrid["hexGrid"].append([])
        for y in range(0,yAxis):
            theGrid["hexGrid"][x].append({
                "xCord":x,
                "yCord":y,
                "terrain":startMap[x][y],
                "modified":'',
                "hasLine":'NAI'
                })
    jsonGrid = json.dumps(theGrid)
    return jsonGrid

########################################################################################################
##Called by the seaPower function this determines the nature of the ajacent hexes to this one
##it uses a 2d for loop to check each surrounding hex and then tests to see if the attribute of the hex
##mactches the target (both of these are arguments for the function allowing for a more dyanmic function)
##This then updates the ajacentCount varibale which is returned as an interger.
#########################################################################################################
def checkAjacent(gridData,x,y,attribute,target):
    x = x
    y = y
    ajacentCount = 0
    for i in range(-1,1):
        for j in range(-1,1):
            if gridData['hexGrid'][i+x][j+y][attribute] == target:
                ajacentCount = ajacentCount + 1
    return ajacentCount

##########################################################################################################
##Applys the changes to the terrain key pair in the JSON data this is determined by the seaPower function
##uses a 2d array to search through the JSON data and where the modified attribute has been changed.
##modified = lost (changes the hex's terrain attribute to marine)
##modified = gain (runs the reclaim land function)
##the function then returns the modified attribute to its default setting as a blank string
##########################################################################################################
def changeGrid(gridData,x,y):
    x = x
    y = y
    for i in range(0,x):
        for j in range(0,y):
            if gridData['hexGrid'][i][j]['modified'] == 'lost':
                gridData['hexGrid'][i][j]['terrain'] = 'm'
                gridData['hexGrid'][i][j]['modified'] = ''
            if gridData['hexGrid'][i][j]['modified'] == 'gain':
                reclaimLand(gridData,i,j)
                gridData['hexGrid'][i][j]['modified'] = ''
            if gridData['hexGrid'][i][j]['hasLine'] != 'NAI':
                gridData['hexGrid'][i][j]['hasLine'] = 'NAI'
    return gridData

####################################################################################################
##The seaPower function governs the game logic as well as updating the game state.
##It uses a 2d loop to search through the hex grid. and then creates varibles which will be used in the seaAttack function.
##resistMod = the modifier according to the hex terrain type
##biasMod = the modifer according to the bias map
##It then runs the seaattack funciton which runs the game logic, and ultimatly changes the terrain attribute in the JSON.
##it then returns the resultant changes of the seaAttack function.
#####################################################################################################
def seaPower(gridData,x,y,modifierList,mapBias):
    x = x
    y = y
    for i in range(1,x-1):
        for j in range(1,y-1):
            if (gridData['hexGrid'][i][j]['terrain'] != 'm'):
                ajacentCount = checkAjacent(gridData,i,j,'terrain','m')
                if ajacentCount >= 1:
                    resistKey = gridData['hexGrid'][i][j]['terrain']
                    resistMod = modifierList[resistKey]
                    lineKey = gridData['hexGrid'][i][j]['hasLine']
                    lineMod = modifierList[lineKey]
                    biasMod = mapBias[i][j]
                    modifiedTo = seaAttack(ajacentCount,resistMod,biasMod,lineMod)
                    gridData['hexGrid'][i][j]['modified'] = modifiedTo         
    return gridData
            
#######################################################################################################################################
##SeaAttack is the main game logic.
##it creates a number of vairiables which will be used as modifiers in determining the chance of hexs changing thier terrain attribute
##diffulcty = the modifier that comes from the terrain type
##bias = the modifier that comes from the bias map
##seaattack = a randomly generated modifer that represents the power of costal erosion strength
##ajacentMod = takes the number of ajacent sea hexes and augments this so not to distort the modifer too much
##the game logic is very simple the VsSea varible that determins the outcome is based of simple additoin and attraction of the above varibles.
##It returns a lost, remain, or gain string depending on the value of vsSea.
######################################################################################################################################
def seaAttack(ajacentCount,resistMod,biasMod,lineMod):
    diffculty = resistMod
    seaAttack = random.randrange(0,20,1)
    bias = biasMod
    line = lineMod

    ajacentMod = ajacentCount - 2
    if ajacentMod < 0:
        ajacentMod = 0

    vsSea = (diffculty + bias + line) - (seaAttack + ajacentMod)

    if vsSea <= 0:
        return 'lost'
    elif vsSea in range(1,10):
        return 'remain'
    elif vsSea >= 11:
        return 'gain'
    
####################################################################################################################
##The reclaimLand function is dependent on the result of the seaAttack function where a result of gain is returned.
##once called by the changeGrid function reclaimLand uses a 2d loop to search through each adjacent hex.
##If the ajacent hex's terrain attribute is marine (m) it is then changed to a beach terrain (b).
#####################################################################################################################
def reclaimLand(gridData,x,y):
    x = x
    y = y
    for i in range(-1,1):
        for j in range(-1,1):
            if gridData['hexGrid'][i+x][j+y]['terrain'] == 'm':
                gridData['hexGrid'][i+x][j+y]['terrain'] = 'b'

###################################################################################
##SaveState saves the current game state into teh database as a uniquie object.
##it attempts to match the current current terrainstring with thouse already stored in the DB.
##if an execption is raise (i.e. the current game state is not in the DB) it saves it as a new object.
##It then returns the object id number as the game state.
###################################################################################
def saveState(gameData):
    try:
        turnState = gameState.objects.get(terrainString = gameData)
    except:
        turnState = gameState(terrainString = gameData)
        turnState.save()
    finally:
        turnId = turnState.id
        return turnId

#################################################################
##mergeHistory appends the current turnId to the historyData
################################################################
def mergeHistory(historyData, turnId):
    historySave = historyData
    historySave.append(turnId)
    return historySave
    
###########################################################################
##SaveGame works in an almost identical fasion to saveState.
##the sole difference here is that it also saves the history of the game
###########################################################################
def saveGame(historyId):
    try:
        gameSave = gameStateHistory.objects.get(historyString = historyId)
    except:
        gameSave = gameStateHistory(historyString = historyId)
        gameSave.save()
    finally:
        gameId = gameSave.id
        return gameId

#############################################################################
##revertOldTurn uses the get method to rerive the gamestate that matches the
##id key provided by the historyData argument and returns it.
#############################################################################
def revertOldTurn(turnData):
    currentTurn = gameState.objects.get(id = turnData)
    return currentTurn

#########################################################################
##Loadhistory attempts to retrive a an Id primary key that matches the
##entered gameStateHistory.
##if no entry is found it returns the except response Id otherwise it returns
##the id as the response id.
#########################################################################
def loadHistory(gameId):
    try:
        responseId = gameStateHistory.objects.get(id = gameId)
    except:
        responseId = "Unfortuantly this game does not exist"
    finally:
        return responseId

################################################################
##convertHistoryData first convets the history data into a python array
## then slects the final entry of that array and returns the value
###############################################################
def convertHistoryData(historyData):
    convertedHistoryData = json.loads(historyData)
    currentTurn = convertedHistoryData[-1]
    return currentTurn

###########################################################################
##GetGameId  retrives the Id of the gameStateHistory SQL database entry and 
##retuns it.
###########################################################################
def getGameId(historyData):
    responseId = gameStateHistory.objects.get(historyString = historyData)
    responseId = responseId.id
    return responseId
        
