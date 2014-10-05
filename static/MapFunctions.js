////////////////////////////////////////////////////////////////////////
//The COASTALDEFENDER global object is a holding object for what would otherwise be global objects.
//It it used to minimise the number of global objects, and thus reduce clashes.
//g = the hex grid's x axis length.
//i = the hex grid's y axis length.
//hexR = the radius of a given hex just a quick note, this should be the same value as the int times by two in 
//the d attribute....  e.g. if hexR = 150 the value of d would equal 2*150*Math.cos(Math.PI/6).
//d = is a distance measure to be used with the e-shapes.js. In terms of the hex grid d is the distance between
//the centre of one hex adjacent to the next.
//point = is the original point from which all the centre points of individual hexes are based.
//myOptions = The basic options required for all maps.
//JSON = currently null, but this is replaced by the JSON array when the GET and POST calls are made
//currentResources = the current resources available for a player to use when designating hexes a line type.
//maxResources = the base amount of resources (this is reset each turn).
//This is a string and is initially null, the mapViewCreator builds this further.
//critLocCount = this is populated later to show the current number of critical locations left on the map
//showCritTrue = a boolean to show if the critical locations are currently visible.
//gameStateHistory =  Contains the gamestate IDs for each turn and the Id associated for each one.
//currentTurn = counts the current game turn.
//maxTurn = the maximum number of turns in the game
//currentGameId = the unique ID for the game (being the ID for the historyString of the gameStateHistory
//held in the SQL django database.
//startMap = the 2d array which contains the initial map layout 
//biasMap = the 2d array which mirrors the game map which augments the chances of a terrain being converted.
//critLocMap = the 2d array which mirrors the game map showing which hexs are considered critical
//SMPMap = a map to auto populate the map with the official SMP designations
//modifyList = the dictionary of terrain types, and other modifiers which will effect the outcome of game logic.
//colourList = the list of colours for each terrain type or hex designation.
//lineCost = the cost in resources for designating each hex a certain line type.
////////////////////////////////////////////////////////////////////////
var COASTALDEFENDER = {
	g : 20,
	i : 60,
	hexR : 100,
	d : 2*100*Math.cos(Math.PI/6),
	point : new google.maps.LatLng(52.992367 , 0.604162),
	myOptions : {
		zoom: 13,
		center: new google.maps.LatLng(52.976245 , 0.67729),
		mapTypeControl: false,
		navigationControl: false,
		zoomControl: true,
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_CENTER
		},
		panControl: false,
		streetViewControl: false,
		mapTypeId: google.maps.MapTypeId.HYBRID
	},
	JSON : null,
	currentResources : 50,
	maxResources : 50,
	critLocCount : 0,
	showCritTrue : false,
	gameStateHistory :[0],
	currentTurn : 1,
	maxTurn : 9,
	currentGameId: "",
	startMap : [
["n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n"],
["n","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","n"],
["n","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","n"],
["n","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","b","b","b","b","b","b","b","b","b","b","b","b","b","b","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","n"],
["n","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","b","d","d","d","d","d","d","d","d","b","d","d","d","d","d","b","b","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","n"],
["n","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","b","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","d","b","b","b","b","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","n"],
["n","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","b","d","d","sm","sm","d","sm","sm","sm","d","d","d","sm","sm","sm","sm","sm","d","d","d","d","b","b","b","b","m","m","m","m","m","m","m","m","m","m","m","m","m","n"],
["n","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","b","d","d","sm","sm","sm","sm","sm","sm","d","sm","sm","d","d","d","sm","sm","d","d","d","d","d","d","d","d","b","b","b","b","b","m","m","m","m","m","m","m","m","n"],
["n","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","b","d","b","sm","sm","sm","sm","sm","d","d","sm","sm","sm","sm","d","sm","sm","d","d","d","sm","d","sm","sm","sm","d","d","d","d","b","b","b","b","m","m","m","m","m","n"],
["n","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","b","b","m","m","m","m","m","sm","d","d","sm","sm","sm","m","m","sm","sm","d","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","d","d","d","d","b","b","m","m","m","n"],
["n","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","d","d","sm","sm","m","m","m","m","m","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","b","m","m","n"],
["n","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","m","b","d","b","b","d","d","m","m","m","m","d","d","d","m","m","m","sm","m","m","m","m","m","m","m","sm","sm","sm","m","m","m","sm","sm","sm","sm","sm","sm","sm","b","b","m","n"],
["n","m","m","m","m","m","m","m","m","m","m","m","m","m","b","b","b","b","d","d","d","d","d","d","d","d","d","m","m","d","d","m","m","m","sm","sm","sm","sm","sm","sm","sm","sm","m","m","m","m","m","m","m","m","sm","sm","sm","m","m","m","m","m","m","n"],
["n","b","b","m","m","m","b","b","b","b","b","b","b","b","d","d","d","d","d","d","d","d","d","d","d","d","d","d","m","m","m","m","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","m","m","m","m","m","m","m","m","m","m","n"],
["n","d","b","b","b","b","b","d","d","d","d","hu","hu","hu","d","sm","sm","sm","sm","sm","sm","d","d","d","d","d","d","d","m","m","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","m","m","n"],
["n","hf","hf","d","d","d","b","d","sm","sm","sm","sm","sm","hf","sm","sm","sm","sm","sm","sm","sm","sm","d","d","sm","sm","sm","m","m","sm","sm","sm","sm","sm","hf","hf","hf","hf","hf","hf","hf","hf","hf","sm","sm","sm","sm","sm","hf","hf","hf","sm","sm","sm","sm","sm","sm","sm","m","n"],
["n","hf","hf","hf","d","d","b","d","sm","hf","hf","hf","hf","sm","sm","sm","sm","sm","sm","sm","m","m","m","m","sm","sm","m","m","m","m","sm","sm","sm","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","sm","sm","sm","sm","sm","sm","m","m","n"],
["n","hf","hf","hf","sm","sm","sm","sm","sm","hf","hf","hf","hf","hf","sm","sm","m","m","m","m","m","m","sm","m","m","m","m","sm","m","m","m","sm","sm","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","sm","sm","sm","sm","sm","m","hu","n"],
["n","hf","hf","hf","sm","sm","sm","sm","sm","hf","hf","hf","hf","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","sm","hu","hu","sm","sm","sm","m","sm","sm","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","hf","sm","sm","sm","sm","m","hu","hf","n"],
["n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n","n"],
],
	biasMap : [
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,-1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,2,2,2,2,2,-2,2,2,2,2,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,3,3,3,3,3,2,0,2,3,3,3,3,2,2,2,2,2,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,2,2,3,3,3,3,3,3,2,0,3,2,2,2,3,2,2,2,2,2,2,2,2,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,3,3,3,3,3,2,2,0,3,3,3,2,3,2,2,2,3,3,3,3,3,2,2,2,2,2,1,1,1,1,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,2,3,3,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,2,2,2,1,1,1,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,0,0,0,0,0,0,2,2,2,3,2,2,0,0,2,2,3,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,1,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,2,2,2,2,2,1,2,2,2,2,2,3,3,3,3,3,3,3,3,1,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,-1,-1,-1,-1,-1,-1,0,0,0,0,2,2,2,0,0,0,2,0,0,0,0,0,0,0,2,2,2,0,0,0,2,2,3,3,3,3,3,1,1,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,3,2,2,2,2,2,3,3,3,0,0,2,2,0,0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0],
[0,-1,-1,0,0,0,0,0,0,0,0,1,-2,-2,-2,1,1,1,2,2,2,2,2,2,2,2,-1,-1,0,0,0,0,2,2,2,2,2,-1,2,2,-1,2,2,2,2,2,2,2,-2,0,0,0,0,0,0,0,0,0,0,0],
[0,-1,-1,-1,1,1,1,1,1,1,-2,-2,-2,-2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,0,0,2,2,2,2,2,2,-1,2,-1,-1,2,2,2,2,2,2,-2,-2,2,2,2,2,2,2,2,2,2,0,0,0],
[0,2,2,-1,-1,2,2,0,2,2,2,2,4,2,2,2,2,2,2,2,2,2,2,2,2,2,-1,0,0,2,2,2,2,2,1,-2,1,1,-2,1,1,1,1,2,2,2,-2,2,1,1,1,2,2,2,2,2,2,2,0,0],
[0,2,2,2,2,2,-2,-2,2,1,1,1,1,2,2,2,2,2,2,2,0,0,0,0,3,3,0,0,0,0,2,2,2,1,1,1,-2,1,-2,-2,-2,-2,-2,-2,-2,-2,-2,1,1,1,1,2,2,2,2,2,2,0,0,0],
[0,3,3,3,2,2,-2,-2,2,1,1,1,1,1,2,2,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,2,2,1,1,1,-2,-2,1,-2,1,1,-2,-2,-2,-2,1,1,1,1,1,1,2,2,2,2,2,0,3,0],
[0,3,3,3,3,3,3,3,3,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,5,5,1,1,1,0,2,2,1,1,1,1,1,1,-2,-2,-2,1,1,1,-2,-2,1,1,1,1,1,1,2,2,2,2,0,3,1,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
],

critLocMap : [
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
[0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
],

SMPMap : [
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,"htl","htl",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,"htl","htl",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"htl","htl","htl","htl","htl","htl","htl","htl","htl",0,0,0,0,0,"htl","htl","htl",0,0,0,0,0,0,0,0,0],
[0,0,0,0,0,0,0,0,0,"htl","htl","htl","htl","htl",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"htl",0,0,0,0,0,0,0,0,"htl","htl","htl","htl","htl","htl",0,0,"htl",0,0,0,0,0,0,0,0,0],
[0,"htl","htl","htl",0,0,0,0,0,"htl",0,0,0,"htl",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"htl",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"htl",0,0,0,0,0,0,"htl",0],
[0,0,0,"htl",0,0,0,0,0,"htl",0,0,0,"htl","htl","htl","htl","htl","htl","htl","htl","htl","htl","htl","htl","htl","htl","htl","htl","htl","htl","htl","htl",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,"htl",0,0,0,0,0,"htl",0,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
],
	modifyList : {
	//The first half of this list are modifiers according to the terrain type of the hex.
	'n' : 0, //null
    'm' : 0, //marine
    'b' : 10, //beach
    'd' : 12, //dune
    'sm' : 15, //saltmarsh
    'hf' : 17, //human farmland
    'hu' : 19, //human urban
	//The second half of this list are modifiers according to the assigned line type to the hex.
	'HTL' : 2, //hold the line
	'ATL' : 4, //advance the line
	'MR' : -2, //managed realignment
	'NAI' : 0, //no active intervention
    },
	
	colourList : {
	"nullHex" : "#000000",
	"marineHex" : "#0000ff",
	"beachHex" : "#ffff00",
	"duneHex" : "#ff6600",
	"saltmarshHex" : "#00ffcc",
	"humanfarmHex" : "#006600",
	"humanUrbanHex" : "#666666",
	"HTLLine" : "#33FF00",
	"ATLLine" : "#FF0000",
	"MRLine" : "#660088",
	"CritLoc" : "white",
	
	},
	lineCost : {
	'HTL' : 2, //hold the line
	'ATL' : 4, //advance the line
	'MR' : 1, //managed realignment
	},
}

///////////////////////////////////////////////////////////////////////
//The HexGrid constructor calls the buildGrid function to create a persistent 
//grid object.
///////////////////////////////////////////////////////////////////
function HexGrid () {
	this.grid = buildGrid();
}

/////////////////////////////////////////////////////////////////////
//The buildGrid function is the main function that creates the Javascript object,
//this object contains a 2d array of NewHex objects that create the polygons on the map.
//I creates a 2d array using the COASTALDEFENDER g and i attributes as width and height.
//when the function reaches the second loop it calls the NewHex constructor, which creates a NewHex object at that point.
//furthermore it also calls the NewHex method of createMenu on each hex allowing for a context menu to be created on each hex.
///////////////////////////////////////////////////////////////////////
function buildGrid(){
	var grid = new Array(COASTALDEFENDER.g);
	gridPoint = COASTALDEFENDER.point;
	for(var x = 0; x<COASTALDEFENDER.g;x++){
		grid[x] = new Array(COASTALDEFENDER.i);
		gridPoint = displacement(x,gridPoint);
		for(var y = 0; y<COASTALDEFENDER.i;y++){
			var gridHex = new NewHex(x,y,gridPoint);
			grid[x][y] = gridHex;
			grid[x][y].createMenu(grid[x][y].hex, grid[x][y].hasLine,x,y);
			if(COASTALDEFENDER.critLocMap[x][y] == 1){
				COASTALDEFENDER.critLocCount = COASTALDEFENDER.critLocCount + 1;
			}
		}
	}
	return grid;
}

////////////////////////////////////////////////////////////
//The NexHex constructor contains the attributes to build a polygon on the map/
//position = the coordinates for the centre of the hex
//row = xCordinate position
//column = ycordinate position
//terrain = this is the terrain type of that hex.  This will be set according to the COASTALDEFENDER.startMap
//and will change through game logic with each turn.
//hex and hex.setMap = the e-shapes.js polygon function to draw shapes on the map
//marker = used for debugging as set to false on visibility but creates a marker on that hex
//hasLine = the buildLine listener creates lines on given hexes,
//if hasLine is not "NAI" it means that this hex has been designated under a new line policy.
//line = a listener that calls the buildLine function if this hex is right clicked on 
//contextMenu = this creates an instance of a context menu on each hex.
////////////////////////////////////////////////////////////
function NewHex(xCord,yCord,gridPoint){
	this.position = EOffsetBearing(gridPoint,COASTALDEFENDER.d*yCord,90);
	this.row = xCord;
	this.column = yCord;
	this.terrain = null;
	this.isCritical = null;
	this.hex = new google.maps.Polygon.RegularPoly(EOffsetBearing(gridPoint,COASTALDEFENDER.d*yCord,90),COASTALDEFENDER.hexR,6,0,"#000000",1,1,"#00ffff",0.5,true);
	this.hex.setMap(map);
	/*
	this.marker = new google.maps.Marker({
		position: EOffsetBearing(gridPoint,COASTALDEFENDER.d*yCord,90),
		map: map,
		visible: false,
		clickable: true,
		title: this.hasLine
	});
	*/
	this.hasLine = "NAI";
	this.line = google.maps.event.addListener(this.hex, 'rightclick', function(mouseEvent){
		buildLine(xCord,yCord);	
	});
	this.contextMenu = new ContextMenu(map, contextMenuOptions);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//created at the buildGrid phase of the grid construction. It emplaces a context menu for each hex within the grid.
//this context menu is brought about by right clicking on the hex.  The context menu comes from an external libary by
//MArtine Pearman and can be found at the following link http://googlemapsmania.blogspot.de/2012/04/create-google-maps-context-menu.html
//1.The function creates a listener on each hex.
//2.it determines if the current hex is hasLine == "NAI".  if it is "NAI" the hex can be designated as a new line type.
//if it has an existing designation it will raise an alert to the player informing them that hex is already assigned and they must
//must delete the current assignment.
//3.when a new designation is added or cancelled the COASTALDEFEDER.currentResources are updated and the value is sent to current DIV.
//4.when the event type is chosen through the context menu, a check is made if the player has existing resources to complete the action, if 
//not they are informed via an alert.
//5.otherwise the function will update the hasLine attribute for the current hex, will update COASTALDEFEDER.currentResources,
//and will change the hex's colours according to the eventType (i.e. HTL would change it to vivid green).
//6.if the player chooses to cancel the assignment, it checks against the value of the current assignment and refunds it to the 
//COASTALDEFEDER.currentResources attribute.  Before reverting the hex colour to its default setting.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
NewHex.prototype.createMenu = function (hexShape,lineDetails,x,y){
	this.menuList = google.maps.event.addListener(this.contextMenu, 'menu_item_selected', function(latLng, eventName){
		if(lineDetails == "NAI"){
			if (eventName == "hold_the_line"){
				if(COASTALDEFENDER.currentResources - COASTALDEFENDER.lineCost.HTL <= 0){
					alert("You do not have enough resources to assign this policy to the hex.");
				}
				else{
					lineDetails = "HTL";
					newGrid.grid[x][y].hasLine = lineDetails;
					COASTALDEFENDER.currentResources = COASTALDEFENDER.currentResources - COASTALDEFENDER.lineCost.HTL;
					hexShape.setOptions({strokeColor : COASTALDEFENDER.colourList.HTLLine, strokeWeight : 6});
					document.getElementById("over_map_right").innerHTML = "Resources available:" + COASTALDEFENDER.currentResources;
				}
				
			
			}
			
			if (eventName == "advance_the_line"){
				if(COASTALDEFENDER.currentResources - COASTALDEFENDER.lineCost.HTL <= 0){
					alert("You do not have enough resources to assign this policy to the hex.");
				}
				else{
				lineDetails = "ATL";
				newGrid.grid[x][y].hasLine = lineDetails;
				COASTALDEFENDER.currentResources = COASTALDEFENDER.currentResources - COASTALDEFENDER.lineCost.ATL;
				hexShape.setOptions({strokeColor : COASTALDEFENDER.colourList.ATLLine, strokeWeight : 6});
				document.getElementById("over_map_right").innerHTML = "Resources available:" + COASTALDEFENDER.currentResources;
				}
			}
			
			if (eventName == "managed_realignment"){
				if(COASTALDEFENDER.currentResources - COASTALDEFENDER.lineCost.HTL <= 0){
					alert("You do not have enough resources to assign this policy to the hex.");
				}
				else{
				lineDetails = "MR";
				newGrid.grid[x][y].hasLine = lineDetails;
				COASTALDEFENDER.currentResources = COASTALDEFENDER.currentResources - COASTALDEFENDER.lineCost.MR;
				hexShape.setOptions({strokeColor : COASTALDEFENDER.colourList.MRLine, strokeWeight : 6});
				document.getElementById("over_map_right").innerHTML = "Resources available:" + COASTALDEFENDER.currentResources;
				}
			}
		}	
		else{			
			if (eventName == "managed_realignment" || eventName == "advance_the_line" || eventName == "hold_the_line"){
				alert("This hex has already been assigned.");
			}
			if(eventName == "cancel_assignment"){
				lineType = newGrid.grid[x][y].hasLine;
				if (lineType = "HTL"){
					lineValue = COASTALDEFENDER.lineCost.HTL;
				}
				if (lineType = "ATL"){
					lineValue = COASTALDEFENDER.lineCost.ATL;
				}
				if (lineType = "MR"){
					lineValue = COASTALDEFENDER.lineCost.MR;
				}
				COASTALDEFENDER.currentResources = COASTALDEFENDER.currentResources + lineValue;
				lineDetails = "NAI";
				newGrid.grid[x][y].hasLine = lineDetails;
				hexShape.setOptions({strokeColor : COASTALDEFENDER.colourList.nullHex, strokeWeight : 0.5});
				document.getElementById("over_map_right").innerHTML = "Resources available:" + COASTALDEFENDER.currentResources;
			}	
		}	
	});
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//updateOptions uses the prototype method to apply a listener to each instance of NewHex.
//It is called at callback function from the POST newTurn function.
//1.it checks the current terrain attribute of the hex being checked and will then apply the colour type
//to the hex according to the colour matched to the terrain type via the COASTALDEFENDER.colourList attribute 
//2.additional Infowindow listeners are used to create an infowindow on mouse over
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
NewHex.prototype.updateOptions = function(){
var x = this.row;
var y = this.column;
var fillColour;  
	if (this.terrain == "m")
		fillColour = COASTALDEFENDER.colourList.marineHex;
	if (this.terrain == "b")
		fillColour = COASTALDEFENDER.colourList.beachHex;
	if (this.terrain == "d")
		fillColour = COASTALDEFENDER.colourList.duneHex;
	if (this.terrain == "sm")
		fillColour = COASTALDEFENDER.colourList.saltmarshHex;
	if (this.terrain == "hf")
		fillColour = COASTALDEFENDER.colourList.humanfarmHex;
	if (this.terrain == "hu")
		fillColour = COASTALDEFENDER.colourList.humanUrbanHex;
	if (this.terrain == "n")
		fillColour = COASTALDEFENDER.colourList.nullHex;
	this.hex.setOptions({fillColor:fillColour, strokeWeight: 0.5, strokeColor:"#000000"});
	/*
	var infoWindow = new google.maps.InfoWindow({
		content: this.row + "," + this.column,
    });
   	google.maps.event.addListener(this.hex, 'mouseover', function(ev){
		infoWindow.setPosition(ev.latLng);
		infoWindow.open(map);
	});	
	google.maps.event.addListener(this.hex, 'mouseout', function(ev){
		infoWindow.setPosition(ev.latLng);
		infoWindow.close(map);
	});
	*/
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//The displacement function is called in buidGrid and is used to determine if the row is odd or even.
//due to the nature of the hexagonal tessellation each new row must be displaced from the position of COASTALDEFENDER.point
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function displacement(xCord,gridPoint){
	gridPoint = gridPoint;
	if (xCord == 0){
		return gridPoint;
	}
	else if (xCord%2){
		gridPoint = (EOffsetBearing(gridPoint,COASTALDEFENDER.d,210));
		return gridPoint;
	}
	else {
		gridPoint = (EOffsetBearing(gridPoint,COASTALDEFENDER.d,150));
		return gridPoint;
	}	
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//The mapViewCreator is called by the returning success function from the mapMaker GET function
//1.It converts the returned data to a string so it can be sent correctly again via POST (leaving the data in a JSON
//format causes issues when passed to the server).
//2. Updates the COASTALDEFENDER.JSON attribute so it is equal to this new string
//3. uses a 2d for loop to access and change each hex on the map by comparing it to the values of the JSON returned
//4. appends the string of the terrain to COASTALDEFENDER.gameStateString
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mapViewCreator(data){
	COASTALDEFENDER.JSON = data;
	jsonGrid = 	JSON.stringify(COASTALDEFENDER.JSON);
	COASTALDEFENDER.JSON = jsonGrid;
	for(var x = 0; x<COASTALDEFENDER.g;x++){
		for(var y = 0; y<COASTALDEFENDER.i;y++){
			newGrid.grid[x][y].terrain = data.hexGrid[x][y].terrain;
			newGrid.grid[x][y].isCritical = COASTALDEFENDER.critLocMap[x][y];
			newGrid.grid[x][y].updateOptions();
			//below if a quick possibly temporary option that will build a gamestate string.
			//it will be stored in the coastal defender object
			if(newGrid.grid[x][y].terrain != "n"){
				COASTALDEFENDER.gameStateString =	COASTALDEFENDER.gameStateString +	newGrid.grid[x][y].terrain;	
			}
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////
//The LoadNexTurn function is main game function that will load the next turn.  It does this by sending 
//off a large JSON object where the seapower  function server side will return a new JSON object.
// the returned JSON object contains data for... a)the hexGrid with attributes for each individual hex.
//b) a unique ID which is used to populate the COASTALDEFENDER.currentGameId. C) the complete history data
//which is an array of the uniqueIds of the game turns so far, this is used to populate COASTALDEFENDER.gameStateHistory
//To do this it:
//1. augments the GameData and uniqueId to be used for future functions.
//2. It runs the historyUpdater function.
//3. It runs the turnUpdater function.
//4. It runs the mapViewUpdater function
//5. it creates the ajustedTurnId variable which is equal to the length of the gameStateHistory array -1
//6. it then creates a new instance of ExpandTurnList object (named listItem) which will allow the player to revert
//to previous turns.  It also applies the applyListener method creating the interactivity with the object.
//7. it then creates the inputData variable that is used in Update of the twitter button.
//8. it invokes a new instance of the twitter button (this has to be done at the start of each turn.)
////////////////////////////////////////////////////////////////////////////////////////
function loadNextTurn(JSONData, JSONHistory, xLen, yLen, mapBias, modifyDict){
	$.post("newTurn/",{"jsonData" :JSONData, "historyData":JSONHistory, "mapX" : xLen, "mapY": yLen, "biasMap" : mapBias, "modifyList" : modifyDict},function(data){
		gridData = data.gameData;
		uniqueId = data.uniqueId;
		historyUpdater(data);
		alert(COASTALDEFENDER.currentGameId);
		turnUpdater(COASTALDEFENDER.maxResources, uniqueId);
		mapViewUpdater(gridData);
		var ajustedTurnId = COASTALDEFENDER.gameStateHistory.length;
		ajustedTurnId = ajustedTurnId -1;
		var turnId = '#turn' + ajustedTurnId;
		var listItem = new ExpandTurnList(turnId, ajustedTurnId, COASTALDEFENDER.gameStateHistory);
		listItem.applyListener(turnId, ajustedTurnId, COASTALDEFENDER.gameStateHistory);
		
		inputData = "Check out my plans for Coastal Defence #CoastalDefender #GameID" + COASTALDEFENDER.currentGameId;
		//Solution provided by Chirs Francis via jsFiddle http://jsfiddle.net/45ddY/
		$('#tweetButton iframe').remove();
			var tweetButton = $('<a></a>')
			.addClass('twitter-share-button')
			.attr('href', 'http://twitter.com/share')
			.attr('data-text', inputData);
		$('#tweetButton').append(tweetButton);
		twttr.widgets.load();
		
	}, "json");

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//to create a clean JSON object when the newTurn POST function is called updateJSON
//it will create a 2D array within a JSON object with matching attributes to the current 2D newGrid array.
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateJSON(){
	JsonObject = {"hexGrid" : [] };
	for(var x = 0; x<COASTALDEFENDER.g;x++){
		JsonObject["hexGrid"].push([]);
		for(var y = 0; y<COASTALDEFENDER.i;y++){
			JsonObject["hexGrid"][x].push({
				"xCord" : x,
				"yCord" : y,
				"terrain" : newGrid.grid[x][y].terrain,
				"modified" : '',
				"hasLine" : newGrid.grid[x][y].hasLine,
			});
		
		}
	}
	return JsonObject;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//the mapViewUpdater function is called via the newTurn POST function.
//1. uses a 2d for loop to access each hex in the grid and uses the values of the returned JSON to change the attributes of the NewHex objects
//2. It then updates the COASTALDEFENDER.JSON attribute and converts it to a string (for same reason as above)
//3.It resets the values associated with line creation to their original states
//4. it then removes the instance of the context menu associated with the hex before applying a new instance.
//(this has to be done to reset the ability to reselect hexes).
//5. the updateOptions function is run to change the appearance of each hex so it matches with the hex's attributes.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function mapViewUpdater(data){
	for(var x=0; x<COASTALDEFENDER.g; x++){
		for(var y=0; y<COASTALDEFENDER.i; y++){
			newGrid.grid[x][y].xCord = data.hexGrid[x][y].xCord;
			newGrid.grid[x][y].yCord = data.hexGrid[x][y].yCord;
			newGrid.grid[x][y].terrain = data.hexGrid[x][y].terrain;
			google.maps.event.clearInstanceListeners(newGrid.grid[x][y].createMenu);
			google.maps.event.clearInstanceListeners(newGrid.grid[x][y].contextMenu);
			
			newGrid.grid[x][y].hasLine = "NAI";
			newGrid.grid[x][y].updateOptions();
			newGrid.grid[x][y].createMenu(newGrid.grid[x][y].hex, newGrid.grid[x][y].hasLine,x,y);
			if(newGrid.grid[x][y].isCritical == 1){
				if(newGrid.grid[x][y].terrain == "m"){
					COASTALDEFENDER.critLocCount = COASTALDEFENDER.critLocCount -1;
				}
			}
		}
	}
	var response = JSON.stringify(data);
	COASTALDEFENDER.JSON = response;	
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//The historyUpdater function works as a JSON response function.  It uses the returned
//history that has just been saved and emplace this updated array within the COASTALDEFENDER
//global object.
//Please note that due to it being returned as a JSON object the JQery parseJSON method is used to 
//convert the returned data into an array
///////////////////////////////////////////////////////////////////////////////////////////////////////
function historyUpdater(data){
	var history = data.historyData;
	var historyData = $.parseJSON(history);
	COASTALDEFENDER.gameStateHistory = historyData;
}

////////////////////////////////////////////////////////////////////////////////////////////////
//The turnUpdater function updates the resources and turn data for the new turn.
//It iterates the COASTALDEFENDER.currentTurn attribute by one and reverts any expended
//resources to its base amount.
//JQuery is then used to update the text Divs to show this data to the player on the screen
////////////////////////////////////////////////////////////////////////////////////////////////
function turnUpdater(resourceMax, uniqueId){
	COASTALDEFENDER.currentGameId = uniqueId;
	COASTALDEFENDER.currentTurn = COASTALDEFENDER.currentTurn + 1;
	
	CDtext = typeof COASTALDEFENDER.currentGameId;
	alert(CDtext);
	COASTALDEFENDER.currentResources = resourceMax;
	$("#over_map").text("Current Turn:" + COASTALDEFENDER.currentTurn);
	$("#over_map_right").text("Current Resources:" + COASTALDEFENDER.currentResources);
	$("#over_map_rightB").text("Current Game ID:" + COASTALDEFENDER.currentGameId);
}

/////////////////////////////////////////////////////////////////////////////////////////////////
//The revertToHistory function is used to amend the existing COASTALDEFENDER.gameStateHistory
//to reflect a previous game turn.  It uses the slice method to return a new gameStateHistory
//that returns the gameStateIds of all turns up to and including the turn the player reverts to
/////////////////////////////////////////////////////////////////////////////////////////////////
function revertToHistory(sliceStart, sliceStop){
	newHistory = COASTALDEFENDER.gameStateHistory.slice(sliceStart, sliceStop);
	COASTALDEFENDER.gameStateHistory = newHistory;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//The revertToTurn function updates the COASTALDEFENDER currentTurn and currentResources attributes to 
//reflect the new turn reverted to.  It also updates the matching Divs to show the updated data.
////////////////////////////////////////////////////////////////////////////////////////////////////////
function revertToTurn(resourceMax, newTurn, uniqueId){
	COASTALDEFENDER.currentGameId = uniqueId;
	COASTALDEFENDER.currentTurn = newTurn;
	COASTALDEFENDER.currentResources = resourceMax;
	$("#over_map").text("Current Turn:" + COASTALDEFENDER.currentTurn);
	$("#over_map_right").text("Current Resources:" + COASTALDEFENDER.currentResources);
	$("#over_map_rightB").text("Current Game ID:" + COASTALDEFENDER.currentGameId);
}

////////////////////////////////////////////////////////////////////////////////////////
//The ExpandTurnList constructor is used to create a new li (list it) within a given DIV
//this list item will have an id equal to the current turn eg id="turn1".//
////////////////////////////////////////////////////////////////////////////////////////
function ExpandTurnList(turnId, displayTurn, currentHistory){
	$("#revertMeunu").append('<li><a href="#" class="revertTurnItem" id=' + '"turn' + displayTurn + '">Turn ' + displayTurn + '</a>');
}

/////////////////////////////////////////////////////////////////////////////////////////
//The applyListener prototype function creates the function that will allow the player to return to the specified
//turn.
//1.  It sets up the entire function as an on click event.
//2. It runs the revertToHistory function to make sure the correct currentHistory argument will be forwarded to function.
//3. It creates JSONHistory variable which is a JSON ready version of teh COASTALDEFENDER.gameStateHistory attirbute
//4. sends off a JSON object to the server to be processed by the loadOldTurn function
//5. in a similar way to loadNextTurn function it converts returned data to the appropriate manner before running
// the mapViewUpdater, revertToHistory, revertToTurn functions.
//6. it then runs the removeTurnList function to remove all li elements that are above this one.
//7. in the exact same way as the loadNextTurn function it re-invokes the twitter button
///////////////////////////////////////////////////////////////////////////////////////	
ExpandTurnList.prototype.applyListener = function(turnId, displayTurn, currentHistory){
	$(turnId).on("click", function(){
		if(displayTurn == 1){
			alert("This would be reverting back to the first turn, click Restart Game instead.");
		}
		else{
			revertToHistory(0, displayTurn);
			JSONHistory = JSON.stringify(COASTALDEFENDER.gameStateHistory);
			$.post("loadOldTurn/",{"turnData" : currentHistory[displayTurn] , "historyData" : JSONHistory },function(data){
				uniqueId = data.uniqueId;
				gridData = data.gameData;
				mapViewUpdater(gridData);
				revertToHistory(0,displayTurn);
				revertToTurn(COASTALDEFENDER.maxResources,displayTurn, uniqueId);
				removeTurnList(displayTurn);
				
				inputData = "Check out my plans for Coastal Defence #CoastalDefender #GameID" + COASTALDEFENDER.currentGameId;	
				//Solution provided by Chirs Francis via jsFiddle http://jsfiddle.net/45ddY/
				$('#tweetButton iframe').remove();
					var tweetButton = $('<a></a>')
					.addClass('twitter-share-button')
					.attr('href', 'http://twitter.com/share')
					.attr('data-text', inputData);
				$('#tweetButton').append(tweetButton);
				twttr.widgets.load();
				
			}, "json");
		}	
	});
}

//////////////////////////////////////////////////////////////////////////////////////////////
//Both the removeTurnList and removeAllTurnList functions remove li elements.
// the first function uses the each function to loop through the li elements and removes any that are of 
// a higher turn to the current chosen turn.
//The second function does not iterate in such a way and simply removes all the elements.
////////////////////////////////////////////////////////////////////////////////////////////////
function removeTurnList(currentTurnId){
	x = 0
	$("#revertMeunu li").each(function(){
		x = x + 1	
		if (x >= currentTurnId){
			$(this).remove();
		}
	
	});
}
function removeAllTurnList(){
	$("#revertMeunu li").each(function(){
		$(this).remove();
	});
}

////////////////////////////////////////////////////////////////////////////////////////////////////
//The LoadById function is used when a player submits a new gameId.
//1.firstly it generates the gameIdData variable by getting the value of the loadIdInput element (form).
//2. sends a JSON object to be processed by the loadSaveGame function server side.
//3. like loadNextTurn retuned JSON is used in the historyUPdater, turnUpdater and eventually mapviewUpdater
//4. it uses a for loop to generate a list of li elements, each being an instance of the ExpandTurnList object.
////////////////////////////////////////////////////////////////////////////////////////////////////
function loadById(){
	gameIdData = $("#loadIdInput").val();
	$.post("loadSavedGame/",{ "gameIdData" : gameIdData },function(data){
		gridData = data.gameData;
		uniqueId = data.uniqueId;
		historyUpdater(data);
		currentTurn = COASTALDEFENDER.gameStateHistory.length;
		COASTALDEFENDER.currentTurn = currentTurn;
		turnUpdater(COASTALDEFENDER.maxResources, uniqueId);
		removeAllTurnList();
		var ajustedTurn = currentTurn -1;
		for(var x=0; x < currentTurn; x++){
			var turn = x + 1;
			var turnId = '#turn' + turn;
			var listItem = new ExpandTurnList(turnId, turn, COASTALDEFENDER.gameStateHistory);
			listItem.applyListener(turnId, turn, COASTALDEFENDER.gameStateHistory);
		}
		mapViewUpdater(gridData);
		
		inputData = "Check out my plans for Coastal Defence #CoastalDefender #GameID" + COASTALDEFENDER.currentGameId;	
		//Solution provided by Chirs Francis via jsFiddle http://jsfiddle.net/45ddY/
		$('#tweetButton iframe').remove();
			var tweetButton = $('<a></a>')
			.addClass('twitter-share-button')
			.attr('href', 'http://twitter.com/share')
			.attr('data-text', inputData);
		$('#tweetButton').append(tweetButton);
		twttr.widgets.load();
		
	}, "json");
}

///////////////////////////////////////////////////////////////////////////////////
//The buildline function is linked to the line listener in each NewHex object on the map.
//The buildLine function is called when a player right clicks on a hex.
//1. it checks to see if the hex is marine. if so it informs the player to choose a terrestrial one.
//2. it calls the show method for the context menu attached to this hex. This opens a context menu.
//3. it creates a temporary listener on the hex which will be activated if the player moves the mouse cursor out of the hex
//this will then close the context menu.
///////////////////////////////////////////////////////////////////////////////////////
function buildLine(r,c) {
	if(newGrid.grid[r][c].terrain == "m"){
		alert("you must select a terrestial hex.");
	}
	else{
		newGrid.grid[r][c].contextMenu.show(newGrid.grid[r][c].position);	
		$('html').click(function(e){
			newGrid.grid[r][c].contextMenu.hide();
		});
	}
}

function menuHide(){
	 
}

//////////////////////////////////////////////////////////////////////////////////////
//The showCrit function runs a 2d for loop where each member of the hex grid checks against
//the critLocMap.  If the element of the 2d array =1, then it changes the colour of the 
//matching hex to show that is critical.
//////////////////////////////////////////////////////////////////////////////////////
function showCrit(){
	if(COASTALDEFENDER.showCritTrue == false){
		for(var x=0; x<COASTALDEFENDER.g; x++){
			for(var y=0; y<COASTALDEFENDER.i; y++){
				if(COASTALDEFENDER.critLocMap[x][y] == 1){
				hexShape = newGrid.grid[x][y].hex;
				hexShape.setOptions({fillColor : COASTALDEFENDER.colourList.CritLoc});
				}
			}
		}
		returnValue = true;
	}
	if(COASTALDEFENDER.showCritTrue == true){
		for(var x=0; x<COASTALDEFENDER.g; x++){
			for(var y=0; y<COASTALDEFENDER.i; y++){
				if(COASTALDEFENDER.critLocMap[x][y] == 1){
					newGrid.grid[x][y].updateOptions();
				}
			}
		}
		returnValue = false
	}
	COASTALDEFENDER.showCritTrue = returnValue;
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////
//The LoadSMP function runs a 2d for loop and if the element of the SMPMap = a line designation
//that designation is applied to the the matching element hex.
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function loadSMP(){
	for(var x=0; x<COASTALDEFENDER.g; x++){
		for(var y=0; y<COASTALDEFENDER.i; y++){
			if(COASTALDEFENDER.SMPMap[x][y] == 0){
				newGrid.grid[x][y].hasLine = "NAI";
				newGrid.grid[x][y].hex.setOptions({strokeColor : COASTALDEFENDER.colourList.nullHex, strokeWeight : 0.5});
			}
			if(COASTALDEFENDER.SMPMap[x][y] == "htl"){

				newGrid.grid[x][y].hasLine = "HTL";
				newGrid.grid[x][y].hex.setOptions({strokeColor : COASTALDEFENDER.colourList.HTLLine, strokeWeight : 6});
			}
			if(COASTALDEFENDER.SMPMap[x][y] == "atl"){
				newGrid.grid[x][y].hasLine = "ATL";
				newGrid.grid[x][y].hex.setOptions({strokeColor : COASTALDEFENDER.colourList.ATLLine, strokeWeight : 6});
			}
			if(COASTALDEFENDER.SMPMap[x][y] == "mr"){
				newGrid.grid[x][y].hasLine = "MR";
				newGrid.grid[x][y].hex.setOptions({strokeColor : COASTALDEFENDER.colourList.MRLine, strokeWeight : 6});
			}
		}
	}
}	
//////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////
