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

function HideInputDialog()
{
    var dialogue = $("#inputDialogue");
    
    $(dialogue).css({"visibility":"hidden", "height": "0px", "width":"0px", "top": "+=" + $(dialogue).outerHeight() + "px", "left": "+=" + $(dialogue).outerWidth() / 2 + "px", "opacity": 0});
    
    InputDialogue.Shown = false;
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

function ShowInputDialog(inputType, target, callback ,attr, minValue, maxValue)
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
    
//    alert($(target).offset().top);
    
    var dialogue = $("#inputDialogue");
    var width = 30;
    var height = 100;
    
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
            break;
    }
    
    
    $("#inputDialogue #inner #overflow").css({"margin-left":offset + "%"});
//    alert($("#inputDialogue #inner #overflow").html());
    var padding = parseInt( $(dialogue).css("padding").replace("px","") ) * 2;
    //position popup
    $(dialogue).css({ "visibility":"visible", "opacity":1, "height": height + "px", "width":width +"px", "top": $(target).offset().top - height - padding - 15 + "px", "left": $(target).offset().left - ( (width + padding) /2 - $(target).outerWidth()/2) + "px"});   
    
    
   
    
}