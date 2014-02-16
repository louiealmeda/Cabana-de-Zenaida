var editPanelVisible = false;
var isEditing = false;


$(function() {
    sessionCheck(false);
    
    $(document).tooltip();
    $( ".component" ).draggable({
      connectToSortable: "#sortable",
      helper: "clone",
      revert: "invalid"
    });
    
    
//    $( "ul, li" ).disableSelection();
});


$(document).ready(function(){
    
    ShowEditPanel(editPanelVisible);
    
    $.post("siteParser.php", {}, function(data){

        $("#pagePreview").html(data);
    });
    
    
    $("#editPanel #header #tabs li").click(function(){
        
        ShowEditPanel(true);
        
        $("#editPanel #header li").removeClass("selected");
        $(this).addClass("selected");
        
        $("#editPanel #content #overflow").animate({"margin-left": -$(this).index() * 100 + "%"});
    });
    
    
    $("#editToggle #switch").click(function(){
        var bullet = $("#switch #bullet");
        if(isEditing)
        {   
            $(bullet).css({"left":"0%","border-left":"none", "border-right":"1px solid  rgba(255, 0, 0, 0.76)"});
        }
        else
        {
            $(bullet).css({"left":"50%", "border-left":"1px solid green", "border-right":"none"});
        }

        isEditing = !isEditing;
    });
    
    
    $("#editPanel #header>#toggle").click(function(){        
        ShowEditPanel(!editPanelVisible);
    });
});


function ShowEditPanel(show){
    var btn = $("#editPanel #header>#toggle");
    if(!show)
    {
        $("#editPanel #content").css({"height":"0px"}); //.css({"bottom":"-245px"});
        $("#editPanel").css({"bottom":"-245px"});
        $(btn).html('3');

    }
    else
    {
        $("#editPanel #content").css({"height":"245px"});//css({"bottom":"0px"});
        $("#editPanel").css({"bottom":"0px"});
        $("#editPanel #header>#toggle").html(4);
    }
    
    editPanelVisible = show;
    
}