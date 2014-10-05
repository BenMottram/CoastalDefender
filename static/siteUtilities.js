////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//JQuery Utilities:
//A list of JQuery Functions that are unrealated to the Coastal defender game but none the less provide interaction
//with the website.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){
    $("#naviii").mouseover(function() {
		alert("in");
         $(this).animate({ backgroundColor:'#f00'},1000);
    }).mouseout(function() {
        $(this).animate({ backgroundColor:'#ccc'},1000);
    });       
});

$(document).ready(function(){ 
   $("#navBar li a").hover(function(){ 

        //Fade to an opacity of 1 at a speed of 200ms
        //$(this).find('.hover').stop().animate({"opacity" : 100}, 300); 
        $(this).fadeOut(0).addClass('hover').fadeIn(300);

        //On mouse-off
        }, function(){

        //Fade to an opacity of 0 at a speed of 100ms
        $(this).fadeOut(300)
         .queue(function(){ $(this).removeClass('hover').fadeIn(0).dequeue() });

    });

});