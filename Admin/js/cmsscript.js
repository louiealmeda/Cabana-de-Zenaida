$(document).ready(function(){
    
    
    $("#editPanel #handle").dblclick(function(){
        var panel = $("#editPanel");
        if(panel.css("width") == "250px")
        {
//            $(this).animate({ width: "30px", height:"30px", left:"+=250px" });
            panel.animate({height:"30px"}).animate({ width: "30px", left:"+=125px" });
            $("#editPanel #handle").delay(200).animate({height:"45px"});
        }
        else
        {
            
//            $(this).animate({ width: "300px", height:"400px", left:"-=250px" });
            panel.animate({ width: "250px", left:"-=125px" }).animate({height:"400px"});
            $("#editPanel #handle").animate({height:"30px"});
        }
    });
    
    
});

$(function() {
//    $( "#editPanel" ).draggable();
    $( "#editPanel" ).draggable({ handle: "p" , containment: "parent" });
    $( "div, p" ).disableSelection();
});


