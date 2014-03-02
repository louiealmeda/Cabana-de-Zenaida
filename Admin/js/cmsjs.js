var editPanelVisible = false;
var isEditing = false;
var darkness = 1;
var opacity = 1;
var activeColor = {"Red": 0, "Green":0, "Blue": 0, "Alpha": 0};


var draggableComponents = {
    "Text Area" : [ "icon-font", "element" ],
    "Columns" :  [ "icon-twocolumnsright", "element , columns" ],
    "Image" :  [ "icon-picture", "element , image" ],
    "Video" : ["icon-video", "element , video"]
};


$(function() {
    sessionCheck(false);
    
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
    
    

    $.post("dbManager.php", {method:"getStyleSheet"}, function(data){
        $("#currentTheme").html(data);
//        alert(data);
    
        $("#pagePreview").load("Website/index.html #main",function(){
            $("#contact_us").css({"display":"none"});
            CMSControlerLoad();
        });
    
    });
    GenerateComponents();
    
    
    
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
    
    
    $("#colorPalette li#add").click(function(){
        $(this).before("<li><div></div></li>\n");
    });
    
    $("#colorPalette li:not(#add)").click(function(){
        $(this).css({"outline":"1px solid red"});
    });
    
    $("#editPanel #header>#toggle").click(function(){        
        ShowEditPanel(!editPanelVisible);
    });
});

function GenerateComponents()
{
    
    var str = "";
    
    $.each(draggableComponents, function(key, value){
        
         str = str + '<li class="component" alt = "'+ value[1] +'"> <div class="'+ value[0] +'" ></div> <span> ' + key + '</span> </li>\n';
        
    });
    
//    alert(str);
    
    $("#editPanel #editPanelContent #components").html(str);
}

function ShowEditPanel(show){
    var btn = $("#editPanel #header>#toggle");
    if(!show)
    {
        var height = $("#editPanel #header").outerHeight();
        $("#editPanel").css({"height": height + "px"}); //.css({"bottom":"-245px"});
//        $("#editPanel").css({"bottom":"-240px"});
        $("#pagePreview").css({"height":"+=" + (240 - height) + "px"});
        $("#pagePreview").animate({scrollTop: "-=" + (240 - height) + "px"},500, "linear");
        $(btn).removeClass('icon-chevron-down');
        $(btn).addClass('icon-chevron-up');

    }
    else
    {
        var height = $("#editPanel #header").outerHeight();
        $("#editPanel").css({"height":"240px"});//css({"bottom":"0px"});
//        $("#editPanel").css({"bottom":"0px"});
        $("#pagePreview").css({"height":"-="+ (240 - height) + "px"});
        $("#pagePreview").animate({scrollTop: "+=" + (240 - height) + "px"},500, "linear");
        $(btn).removeClass('icon-chevron-up');
        $(btn).addClass('icon-chevron-down');
    }
    
    editPanelVisible = show;
    
}


//////Color picker
$(function() {
    $("#wheel").on("dragstart", function(event) { event.preventDefault(); });
    
    var selector = $("#colorPicker #selected");
    var offX;
    var offY;
    var tmpActiveColor = {"Red": 0, "Green":0, "Blue": 0, "Alpha": 0};
    $("#wheel").mousemove(function(e) {
        
        if(!this.canvas) {
            this.canvas = $('<canvas/>').css({width:this.width + 'px', height: this.height + 'px'})[0];
            this.canvas.height = this.height;
            this.canvas.width = this.width;
            this.canvas.getContext('2d').drawImage(this, 0, 0, this.width, this.height);
        }
         offX  = (e.offsetX || e.clientX - $(e.target).offset().left);
         offY  = (e.offsetY || e.clientY - $(e.target).offset().top);
        
        var pixelData = this.canvas.getContext('2d').getImageData(offX, offY, 1, 1).data;
        
        tmpActiveColor.Red = Math.round( pixelData[0] * darkness );
        tmpActiveColor.Green = Math.round( pixelData[1] * darkness );
        tmpActiveColor.Blue = Math.round( pixelData[2] * darkness );
        tmpActiveColor.Alpha = Math.round(  opacity );

        var color;
        var rgbaColor;
        if(pixelData[3] != 0)
        {
            color = "#" +  (tmpActiveColor.Red.toString(16) + tmpActiveColor.Green.toString(16) + tmpActiveColor.Blue.toString(16)).toUpperCase();

            rgbaColor = "rgba(" + tmpActiveColor.Red + "," + tmpActiveColor.Green + "," +tmpActiveColor.Blue + "," +tmpActiveColor.Alpha + ")";      
        }
        else
        {
            color = "#" +  (activeColor.Red.toString(16) + activeColor.Green.toString(16) + activeColor.Blue.toString(16)).toUpperCase();

            rgbaColor = "rgba(" + activeColor.Red + "," + activeColor.Green + "," +activeColor.Blue + "," +activeColor.Alpha + ")";
        }
        
        $("#inputDialogue #colorPicker #currentColor").css({"background-color": rgbaColor });
        $("#inputDialogue #colorPicker #currentValue").val( color );
    });
    
    $("#wheel").mouseleave(function(e) {
        var color = "#" +  (activeColor.Red.toString(16) + activeColor.Green.toString(16) + activeColor.Blue.toString(16)).toUpperCase();

        var rgbaColor = "rgba(" + activeColor.Red + "," + activeColor.Green + "," +activeColor.Blue + "," +activeColor.Alpha + ")";
        $("#inputDialogue #colorPicker #currentColor").css({"background-color": rgbaColor });
        $("#inputDialogue #colorPicker #currentValue").val( color );
    });
    
    $("#wheel").click(function(){
       
        if(tmpActiveColor.Alpha != 0)
        {
            $(selector).css({"left":(offX + 20) + "px", "top":offY - 1+ "px"}); 

            activeColor = tmpActiveColor;

            
            tmpActiveColor = {"Red": 0, "Green":0, "Blue": 0, "Alpha": 0};
            
            
            UpdateCurrentValue("rgba(" +activeColor.Red + ", " +  activeColor.Green + ", " + activeColor.Blue + ", " +activeColor.Alpha + ") " );

            
        }
    });
    
    
});

function darknessSlide(e)
{
    darkness = (e.value) / 255;
    var opacity = (255 - e.value) / 255;
    $("#dimmer").css({"opacity": opacity });
}

function transparencySlide(e)
{
    opacity = (e.value) / 255;
}

function isNumber (o) {
  return ! isNaN (o-0) && o !== null && o.replace(/^\s\s*/, '') !== "" && o !== false;
}