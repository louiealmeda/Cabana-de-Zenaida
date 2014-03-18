var activeElement = {
    Object: null,
    ActiveAttribute: {key:"", value: "", attribute: {"":""}},
    BackupStyle: null,
    BackupContent: null
};

var InputDialog = {
    Shown: false,
    Target: null,
    Show: ShowInputDialog,
    Hide: HideInputDialog,
    Update: UpdateCurrentValue,
    Callback: null
};

var previousActiveElement;
var pixelData;
var offX;
var offY;
var darkness = 1;
var opacity = 1;
var activeColor = {"Red": 0, "Green":0, "Blue": 0, "Alpha": 0};

var availableImages = ["images/library/IMG_5285.JPG"];

function HideInputDialog()
{
    var dialogue = $("#inputDialogue");
    
    $(dialogue).css({"visibility":"hidden", "height": "0px", "width":"0px", "top": "+=" + $(dialogue).outerHeight() + "px", "left": "+=" + $(dialogue).outerWidth() / 2 + "px", "opacity": 0});
    
    InputDialogue.Shown = false;
    EnableImagePicker(false);
//    disableColorPicker();
}

function UpdateComponentValue(v, index)
{
    
    if(activeElement.ActiveAttribute.key.indexOf("shadow") != -1)
    {
    
        var str = activeElement.ActiveAttribute.value;

        if(str == "none")
            str = "rgba(0,0,0,100) 0px 0px 0px";

    //    $(activeElement.Object).html(str);


        var opacity = str.substr(0, str.indexOf(")") + 1 );
        str = str.substring(str.indexOf(")") + 1, str.length);


        opacity = opacity.substring(opacity.lastIndexOf(',') + 1, opacity.indexOf(')'));
    //    $(activeElement.Object).html(opacity);
        var current = str.split("px");

    //    current.splice(0,2);




        var distance = current[0];
        var blur = current[2];
    //    alert(current[0].substring(current[0].lastIndexOf(',') + 1, current[0].indexOf(')')));

    //    $(activeElement.Object).html(str + "<br>");
        if(index == 2)
            opacity = v / 100;
        else if(index == 0)
             distance = v;
        else
            blur = v;


        var newAttrib =  "rgba(0,0,0," + opacity + ") " + distance + "px " + distance + "px " + blur + "px";
        UpdateCurrentValue(newAttrib);
    }
    else
    {
        
        switch(index)
        {
            case 0:
                $(activeElement.Object).css({"min-width":v * 2 + "%"});
                break;
            case 1:
                $(activeElement.Object).css({"min-height":v * 10 + "px"});
                break;
            case 2:
                $(activeElement.Object).css({"transform": "rotate(" + v + "deg)"});
                break;
        }
    }
}

function UpdateCurrentValue(value)
{

    if(InputDialog.Callback == null)
    {
    
        focusTo(activeElement.Object);

        if( isNumber( value) )
        {
            var textbox = $("#inputDialogue #currentValue")[0];
            $(textbox).val(value);
            value = value + "px";
        }
    //    alert(value);
        activeElement.ActiveAttribute.value = value;
    //    activeElement.ActiveAttribute.attribute[key] = activeElement.ActiveAttribute.value;

    //    $(activeElement.Object).html(activeElement.ActiveAttribute.key + " : " + activeElement.ActiveAttribute.value);
        $(activeElement.Object).css(activeElement.ActiveAttribute.key, activeElement.ActiveAttribute.value );
    }
    else
    {
        InputDialog.Callback(value);
    }
    
//    alert($(activeElement.Object).css(activeElement.ActiveAttribute.key));
//    alert( activeElement.ActiveAttribute.key + ", " + activeElement.ActiveAttribute.value + "px \n" + $(activeElement.Object).css(activeElement.ActiveAttribute.value) );
}

function ShowInputDialog(inputType, target, callback, minValue, maxValue)
{
    
//    callback = callback || null;
//    
    if(callback!= null)
        InputDialog.Callback = callback;
//    else
//        InputDialog.Callback = null;

    InputDialogue.Shown = true;
//    alert(inputType + ", " + target);
    minValue = minValue || 0;
    maxValue = maxValue || 100;
    
    minValue = parseInt(minValue);
    maxValue = parseInt(maxValue);
    
//    alert($(target).offset().top);
    
    var dialogue = $("#inputDialogue");
    var width = 30;
    var height = 100;
    var range = $("#inputDialogue #overflow>div#range #range1");
    
    $(range).attr("max",maxValue);
    $(range).attr("min",minValue);
    
    var offset = 0;
    switch( inputType )
    {
        case "slider":
            width = 30;
            height = 100;
            offset = 0;
            
            var current = activeElement.ActiveAttribute.value.replace("px","");
            UpdateCurrentValue(current);
            $("#inputDialogue #range1").val(current);
            break;
            
        case "triSlider":
            width = 95;
            height = 100;
            offset = -200;
            break;
            
        case "colorPicker":
            width = 280;
            height = 180;
            offset = -100;
//            enableColorPicker();
            break;
            
        case "imagePicker":
            offset = -300;
            width = 350;
            height: 200;
            EnableImagePicker(true);
            break;
            
        
    }
    
    
    $("#inputDialogue #inner #overflow").css({"margin-left":offset + "%"});
//    alert($("#inputDialogue #inner #overflow").html());
    var padding = parseInt( $(dialogue).css("padding").replace("px","") ) * 2;
    //position popup
    $(dialogue).css({ "visibility":"visible", "opacity":1, "height": height + "px", "width":width +"px", "top": $(target).offset().top - height - padding - 15 + "px", "left": $(target).offset().left - ( (width + padding) /2 - $(target).outerWidth()/2) + "px"});   
}



//////Color picker
function enableColorPicker() {
    
    $("#colorPalette li#add").click(function(){
        $(this).before("<li><div></div></li>\n");
    });
    
    $("#colorPalette li:not(#add)").click(function(){
        $(this).css({"outline":"1px solid red"});
    });
    
    $("#wheel").on("dragstart", function(event) { event.preventDefault(); });
    
    
     tmpActiveColor = {"Red": 0, "Green":0, "Blue": 0, "Alpha": 0};
    
    $("#wheel").mousemove(function(e) {
        
        if(!this.canvas) {
            this.canvas = $('<canvas/>').css({width:this.width + 'px', height: this.height + 'px'})[0];
            this.canvas.height = this.height;
            this.canvas.width = this.width;
            this.canvas.getContext('2d').drawImage(this, 0, 0, this.width, this.height);
        }
         offX  = (e.offsetX || e.clientX - $(e.target).offset().left);
         offY  = (e.offsetY || e.clientY - $(e.target).offset().top);
        
        pixelData = this.canvas.getContext('2d').getImageData(offX, offY, 1, 1).data;
        
        hoverColor();
        
    });
    
    $("#wheel").mouseleave(function(e) {
        var color = "#" +  (activeColor.Red.toString(16) + activeColor.Green.toString(16) + activeColor.Blue.toString(16)).toUpperCase();

        var rgbaColor = "rgba(" + activeColor.Red + "," + activeColor.Green + "," +activeColor.Blue + "," +activeColor.Alpha + ")";
        $("#inputDialogue #colorPicker #currentColor").css({"background-color": rgbaColor });
        $("#inputDialogue #colorPicker #currentValue").val( color );
    });
    
    $("#wheel").click(selectColor);
};

function disableColorPicker()
{
    $("#wheel").unbind();
    $("#colorPalette li").unbind();
}


////////////Color picker///////

function hoverColor()
{
//    alert(pixelData);
//    alert(tmpActiveColor.Red);
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
}

function selectColor()
{
    
    var selector = $("#colorPicker #selected");
    if(pixelData[3] != 0)
    {
        $(selector).css({"left":(offX + 20) + "px", "top":offY - 1+ "px"}); 

        activeColor = tmpActiveColor;


        tmpActiveColor = {"Red": 0, "Green":0, "Blue": 0, "Alpha": 0};

        UpdateCurrentValue("rgba(" +activeColor.Red + ", " +  activeColor.Green + ", " + activeColor.Blue + ", " +activeColor.Alpha + ") " );
    } 
}


function darknessSlide(e)
{
    darkness = (e.value) / 255;
    var opacity = (255 - e.value) / 255;
    $("#dimmer").css({"opacity": opacity });
    hoverColor();
    selectColor();
//    activeColor.Red = Math.round( pixelData[0] * darkness );
//    activeColor.Green = Math.round( pixelData[1] * darkness );
//    activeColor.Blue = Math.round( pixelData[2] * darkness );
//    
//    UpdateCurrentValue("rgba(" +activeColor.Red + ", " +  activeColor.Green + ", " + activeColor.Blue + ", " +activeColor.Alpha + ") " );
    //    selectColor();
}

function transparencySlide(e)
{
    opacity = (e.value) / 255;
    hoverColor();
    selectColor();
//    activeColor.Alpha = opacity;
//    UpdateCurrentValue("rgba(" +activeColor.Red + ", " +  activeColor.Green + ", " + activeColor.Blue + ", " +activeColor.Alpha + ") " );
    //    selectColor();
}


function EnableImagePicker(state)
{
    
    var gridSelector = "#inputDialogue #imagePicker #inner>#grid>#pickerOverflow";
    if(state)
    {
        
        
        $(gridSelector + ">li").bind("click", SelectImage);       
        $(gridSelector + ">li").bind("mouseenter",PreviewImage);
        $(gridSelector).bind("mouseleave", revertToSelectedImage);
        
        
    }
    else
    {
        $(tileSelector).unbind();
    }
    
}

function SelectImage()
{
    var tileSelector = "#inputDialogue #imagePicker #inner>#grid>#pickerOverflow>li";
    $(tileSelector+".selected").removeClass("selected");
    $(this).addClass("selected");
//    $(activeElement.Object.css({"background-image":$(this).css("background-image")}));
    UpdateCurrentValue( $(this).css("background-image").replace("thumbs", "library") );
}

function revertToSelectedImage()
{
    var previewSelector = "#inputDialogue #imagePicker #inner>#preview";
    var tileSelector = "#inputDialogue #imagePicker #inner>#grid>#pickerOverflow>li";
    $(previewSelector).css({"background-image":$(tileSelector+".selected").css("background-image")});
    
}

function PreviewImage()
{
    var tileSelector = "#inputDialogue #imagePicker #inner>#grid>#pickerOverflow>li";
    var previewSelector = "#inputDialogue #imagePicker #inner>#preview";
    
    $(previewSelector).css({"background-image":$(this).css("background-image")});
}
