var editPanelVisible = false;
var isEditing = false;
var darkness = 1;

var elementOptions = {
    element : [ "backgroundColor", "border", "borderRadius", "shadow", "margin", "padding", "align" ],
    textArea : ["font", "textUp", "textDown", "textColor", "highLightColor", "bold", "italize", "underline", "strikeThrough","textShadow"],
    column: ["columns", "spacing"]
}

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


    var previewHeight = $(window).height() - $("#editPanel").height();
    
    $("#pagePreview").css({"height": previewHeight + "px"});
    
    
//    ShowEditPanel(editPanelVisible);
    
//    $.post("siteParser.php", {}, function(data){
//
//        $("#pagePreview").html(data);
//    });
    
    
    $("#pagePreview").load("Website/index.html #main",function(){
        $("#contact_us").css({"display":"none"});
    });
    
    
    
    
    $("#editPanel #header #tabs li").click(function(){
        
        if(!editPanelVisible)
            ShowEditPanel(true);
        
        $("#editPanel #header li").removeClass("selected");
        $(this).addClass("selected");
        
        $("#editPanel #editPanelContent #overflow").animate({"margin-left": -$(this).index() * 100 + "%"});

    });
    
    
    $("#editToggle #switch").click(function(){
        var bullet = $("#switch #bullet");
        
        isEditing = !isEditing;
        if(!isEditing)
        {   
            $(bullet).css({
                "left":"0%",
                "border-left":"none", 
                "border-right":"1px solid  rgba(255, 0, 0, 0.76)"
            });
            $(this).css({"box-shadow": "inset -2px 0px 5px red"});
            
            deactivate();
        }
        else
        {
            $(bullet).css({
                "left":"50%",
                "border-left":"1px solid green",
                "border-right":"none"
            
            });
            
            $(this).css({"box-shadow": "inset 3px 0px 8px green"});
            activate();
        }
        
        
        
        
        
    });
    
    
    $("#editPanel #header>#toggle").click(function(){        
        ShowEditPanel(!editPanelVisible);
    });
});


function ShowEditPanel(show){
    var btn = $("#editPanel #header>#toggle");
    if(!show)
    {
        var height = $("#editPanel #header").outerHeight();
        $("#editPanel").css({"height": height + "px"}); //.css({"bottom":"-245px"});
//        $("#editPanel").css({"bottom":"-240px"});
        $("#pagePreview").css({"height":"+=" + (240 - height) + "px"});
        $("#pagePreview").animate({scrollTop: "-=" + (240 - height) + "px"},500, "linear");
        $(btn).html('3');

    }
    else
    {
        var height = $("#editPanel #header").outerHeight();
        $("#editPanel").css({"height":"240px"});//css({"bottom":"0px"});
//        $("#editPanel").css({"bottom":"0px"});
        $("#pagePreview").css({"height":"-="+ (240 - height) + "px"});
        $("#pagePreview").animate({scrollTop: "+=" + (240 - height) + "px"},500, "linear");
        $("#editPanel #header>#toggle").html(4);
    }
    
    editPanelVisible = show;
    
}


//////Color picker
$(function() {
    $("#wheel").on("dragstart", function(event) { event.preventDefault(); });
    
    $("#wheel").mousemove(function(e) {
        
        if(!this.canvas) {
            this.canvas = $('<canvas/>').css({width:this.width + 'px', height: this.height + 'px'})[0];
            this.canvas.height = this.height;
            this.canvas.width = this.width;
            this.canvas.getContext('2d').drawImage(this, 0, 0, this.width, this.height);
        }
         var offX  = (e.offsetX || e.clientX - $(e.target).offset().left);
         var offY  = (e.offsetY || e.clientY - $(e.target).offset().top);
        
        var pixelData = this.canvas.getContext('2d').getImageData(offX, offY, 1, 1).data;
        
        pixelData[0] *= darkness;
        pixelData[1] *= darkness;
        pixelData[2] *= darkness;
        
        $("#color").html( darkness + '<br>R: ' + pixelData[0] + '<br>G: ' + pixelData[1] + '<br>B: ' + pixelData[2] + '<br>A: ' + pixelData[3]);
        
        $("#color").css({"color": "rgba(" + pixelData[0] + "," + pixelData[1] + "," +pixelData[2] + "," +pixelData[3] + ")" });
        
    });
    
    
    
});

function darknessSlide(e)
{
    darkness = (e.value) / 255;
    var opacity = (255 - e.value) / 255;
    $("#dimmer").css({"opacity": opacity });
}

