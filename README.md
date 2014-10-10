CoastalDefender
===============

Coastal Defender was a game made as the product for a masters by research entitled **Gamification of Coastal Management**.  The idea was to provide communities and the online population with access to a game like tool that would allow them to experiment with ways to protect a given stretch of the coast.  The end result was to allow people then to voice opinions via social media and thus interact with the consultancy process.

##Technical Overview
====================
CoastalDefender was created within the Django web framework.  Django uses the  MVT (Model View Template) paradigm to serve webpages.  That is to say Django creates a series of models that are served to the view via HTML templates.  For more information please see [Django Framework](https://www.djangoproject.com/).

The entire research project was based around geo-web applications, and part of the research brief was to see if a geo-browser was an appropriate medium for a tool like CoastalDefender.  During the early design process a number of geo-browsers were considered for use within the technology including Bing Maps and Open Street Map, but the decision eventually went with Google Maps due to its ubiquitious nature.  The frount end code was largely using [Google Maps JavaScript api 3.0](https://developers.google.com/maps/documentation/javascript/).

The third aspect to the application was the injection of Tweet button via the [Twitter api](https://dev.twitter.com/).  The results of the map at any one time could be Tweeted out and linked back the the game in progress at that state.

This readme wont go into huge detail but will cover the main aspects of the application.  The rest you will find are commented upon at length within the code.


##Front End
===========
The front end code is mostly standard JavaScript, though JQurey is used on occasion for AJAX calls to the server.  The front end code makes an effort to do a little as possible to the game data, all augmentations are done server-side.  The front end is mainly concerned with the display and interaction of the game board and the listeners associated with it.

#####The Holder Object
----------------------
The initial game state and progressive changes in the game state on the front end are stored with the COASTALDEFENDER holder object.  This was an idea that i saw put forth by Douglas Crockford and struck me as an excellent way to store variables without cluttering the global name space.  For simplicity sake the holder object is a large JSON object that holds a number of different attributes that are used by the game.  Such as the current game state, the length and width of the game board and Google Map coordinates.

#####eShapes.js
---------------
To build the game board on the map a more complex library to draw shapes on the map was needed.  As standard you can only state coordinates for polygons not complex shapes.  This was solved for Google Maps api 2.0 via Mile Williams and the Community Church JavaScript team and was updated by Lawrence Ross to api 3.0.

This library allows for the drawing of polygons using a specific coordinate as the central point of the shape.  It also came with a very useful algorithm to offset the placement of the next shape by a pre-set amount.

Without this library this project was not possible.

#####The Game Board
--------------------
The game board used the eShapes.js file and its methods to draw a the hex grid.  It does this drawing a row of hexes all off set enough to ensure their sides touch.  The next row is off set diagonally to ensure the hexes tessellate.

The Game board is a single object, with each hex as also an individual object.  With the advancement of the turn each hex is checked against the returned data to change its environment if necessary.

#####Policy Designation and Turn advancement
---------------------------------------------
The Game board also uses a context menu on each hex that is opened via a right click.  This gives the player the option to designate the hex one of the policy types.  These policy designations are value modifiers which are collected at the end of each turn and sent to the server side along with the current game state in a large JSON string.  Upon return the augmented string is then applied to each individual hex on the board to represent the new game state.

#####The Tweet Button
---------------------
The Tweet button collects the id for the current unique game state and then presents it at a tweet.  Please note due to the way the Tweet button works the iframes it lays within have to be redrawn each turn the refresh the values injected into it.

####Server Side
================
The server side conducts three essential tasks.  Translating JSON strings into readable code and back again to be sent the to the front end.  Creating the id for the current game state and game logic.  This largely uses Django's framework, though the game logic is found in the 'mapUpdater.py' file.

#####The Views
--------------
Within the Django views the JSON that comes from the front end is converted into python objects and sent to the game logic for augmentation.  Once augmented the object is converted back into JSON and sent back to the front end.  The View also handles the process of creating new unique game Ids, which are determined by.

1. A unique layout of the game board.
2. A unique history of game layouts for each previous turn.

This allows for the generation of two ids, one for the current layout and one for the unique game id.  This unique game id is the value passed the the Tweet button.

#####The Game Logic
-------------------
The game logic recreates the game board by a series of 2d for loops and checks the incoming policy data that has been applied to each hex.  It then runs a series of functions to update the data according to some pseudo random number generators influenced by the policy and hex environment types.

####Technical Challenges
========================
This was the first large project i undertook and i think it shows in much of the code there are a number of decisions that could have been made during the design of the game to make it run smoother.  If starting over it is likely I would have used something like Unity as the game engine, since it would have been better optimised and a more comprehensive user interface could have been made.

However it does show that google maps can really be pushed in terms of what is done with it.  I might in future create a library that will allow for interactive game boards to be created using the 'eShapes.js' library as a dependency.

####The Thesis
==============
The thesis itself can also be found in the repository.

If you have any more questions about the application of the thesis itself please do not hesitate to ask.
