var activeElement = null;
var activeAttribute = { key:"", value: "", attribute: {"":""} };
var activeElementStyleBackup = "";
var isLocked = false;
var toolbar;
var inputDialogue = {"shown":false, "target":null};
//var isEditing = true;

var elementOptions = {
    element : {
        "Background Color" : ["icon-bucket", {"background-color": "colorPicker"} ],
        "Border" : ["icon-pigpene", {"border-width": "slider"} ],
        "Border Color" : ["icon-palette-painting", {"border-color": "colorPicker"} ],
        "Border Radius" : ["icon-roundrectangle", {"border-radius": "slider"} ],
        "Shadow" : ["icon-subtractshape", {"box-shadow": "slider"} ],
        "Margin" : ["icon-snaptogrid", {"margin": "slider"} ],
        "Padding" : ["icon-canvasrulers", {"padding": "slider"} ],
        "Align Left" : ["icon-alignleftedge", {"text-align": "left"} ],
        "Align Center" : ["icon-alignhorizontalcenter", {"text-align": "center"} ],
        "Align Right" : ["icon-alignrightedge", {"text-align": "right"} ]

        }
//    ,
    
//    "alignJustify" : ["icon-align-justify", "text-align", "justify"],
//        "alignLeft" : ["icon-align-left", "text-align", "left"],
//        "alignCenter" : ["icon-align-center", "text-align", "center"],
//        "alignRight" : ["icon-align-right", "text-align", "right"]

    
//    textArea : ["font", "textUp", "textDown", "textColor", "highLightColor", "bold", "italize", "underline", "strikeThrough","textShadow"],
//    column: ["columns", "spacing"]
    
    
    
};


$(document).ready(function(){
    
//    var str =  JSON.stringify({"test":"boom"});
//    var asc = JSON.parse(str);
    
//    JSON.stringify()
    toolbar = $("#editPanel #header ul#options");
    
//    alert();  
//    GenerateToolbar();
    
    //////////Hover selection
    
//    alert(elementOptions.element.alignLeft);
    
    
//    
//    if(!isEditing)
//        activate();
//    else
//        deactivate();
//    
    
//    $("#selector").draggable({handle:"#handle"});
    
//    $(".element").sortable({
////        cursorAt: { top:  $(window).scrollTop(), left: 0 }
//    }).disableSelection();
    
    
    

    
//    alterInlineCSS( "#handle", {"display":"block", "color":"red","float":"right", "clear":"left"} );
    
});


function CMSControlerLoad(){
    
    
    $(document).tooltip();
    $( ".component" ).draggable({
      connectToSortable: ".element",
      helper: "clone",
      revert: "invalid"
    });
    
    
    
    $("#selector>#handle>#edit").click(function(){
        
        $(".element").unbind();
        
        if(isLocked)
        {
            Release(false);
            
        }
        else
        {
            $(this).removeClass("icon-pencil");
            $(this).addClass("icon-undo");
            $(this).tooltip({content:"Release element without saving"}).tooltip('close').tooltip('open');
            $(this).attr("title","Release element without saving");
            /////////Element Selection
            selectElement();
            isLocked = true;
        }
//        alert($(this).attr("title"));
        
        
    });
    
    
    $("#selector>#handle>#remove").click(function(){
        var parentE = $(activeElement).parent();
        focusTo(parentE);
        $(activeElement).remove();
        
        activeElement = parentE;
        
        activate();
    });
    
//    activate();
    
//    ShowInputDialog("colorPicker",$("#editPanel"));
}

function selectElement()
{
    
    
    
//    $("#selector").css({"border":"2px solid cyan"});
    activeElement.contentEditable = true;
    activeElementStyleBackup = $(activeElement).attr("style");
    GenerateToolbar();
    
}

function activate()
{
    deactivate();
    $("#selector").css({"opacity":"1","visibility":"visible"});//.delay(500).css({"display":"block"});
    $(".element").css({"outline":"1px dashed gray"});
//    $(".element").addClass(".editing");
    
    $(".element").each(function(index){
        $(this).bind("mousemove", function(){
//            alert();

            activeElement = this;
            focusTo(activeElement);
            return false;
        });
    });
    
    
    EnableDropping(true);
    
    
}

function deactivate()
{
    
    Release(false);
    $("#selector").css({"opacity":"0", "visibility":"hidden"});//.delay(500).css({"display":"none"});
    $(".element").css({"outline":"1px dashed transparent"});
//    $(".element").removeClass(".editing");
    $(".element").unbind();
    EnableDropping(false);
    
    
    
//    $(".element").droppable('destroy');
}

function EnableDropping(state)
{
    if(state)
    {
        $(".element").droppable({
            greedy:true,
    //        activeClass: "hoveredAddingElement",
            hoverClass: "hoveredAddingElement",
            drop: function( event, ui ) {
                $( this ).find( ".component" ).remove();
                SpawnElement(this,ui.draggable);

                activate();
            }
        });
//        $(".element").draggable( "enable" );
    }
    else
    {
//        $(".element").droppable( "disable" );
    }
}

function SpawnElement(containingE, draggedE)
{
    
    var elementClasses = draggedE.attr("alt");
    
//    alert(elementClasses);
    
    var content = "Insert text or element here";
    var elementType = "div";
    var initialAttributes = "";
    var elementString = "";
    
    
    if(elementClasses.indexOf("columns") != -1)
        content = "<div class = 'element'> Insert text or element here </div>\n<div class = 'element'> Insert text or element here </div>";
    
    elementString = "<" + elementType + " " +  initialAttributes +" class = '" + elementClasses  + "'>"+content+"</" + elementType +">" ;
    
    
    
    if(elementClasses.indexOf("image") != -1)
    {
        initialAttributes = " height='200px' width='300px' style='background-image:url(images/slide0.jpg)'" ;
        content = "test";
        
        elementString = "<" + elementType + " " +  initialAttributes + " class = '" + elementClasses + " '>"+content+" </" + elementType +">" ;
        
    }
    
    alert(elementString);
    
    $( containingE ).append( elementString );
    
}

function GenerateToolbar()
{
//    
    var editingIcons = "<li title ='Save and release element' class = 'icon-ok-circle' onclick='Release(true)'></li> <li >&nbsp;</li>";
    
    var classes = ["element"];//$(activeElement).attr("class").split(" , ");
    
    //eo = element option
    var eo;
    var index = 0;
    for(var i = 0; i < classes.length; i++)
    {
        eo = classes[i];

        $.each(elementOptions[eo], function(key, value){
        
//            alert(key + ": " + value); 
            
            
            editingIcons += "<li id = '" + index + "' class = '" + value[0] + "' title ='" + key + "' onclick = \'ToolbarItemClick(" + JSON.stringify(value[1]) + "," + index + ")\'></li>\n"; 
            
            index++;
        });
        
    }
    
//    alert(editingIcons);
               
    $(toolbar).html(editingIcons);
}

function ToolbarItemClick(value,index)
{   
    var target = $("#editPanel #header ul#options li#" + index);
    

    if(inputDialogue.shown && $(inputDialogue.target).attr("id") == $(target).attr("id"))
    {
        HideInputDialog();
        return;
    }
    
    
    inputDialogue.target = target;
        
//    alert(JSON.stringify(value));

    $.each(value, function(key, value){
        activeAttribute.key = key;
        activeAttribute.value = value;
        return false;
    });
    
    
    

//    alert(JSON.stringify(value));
    
    switch(activeAttribute.value)
    {
        case "colorPicker":
            activeAttribute.value = $(activeElement).css(activeAttribute.key);
//            $(activeElement).css( { activeAttribute.key : "red" } );
            var key = activeAttribute.key;
            if(key.indexOf("border") != -1)
                $(activeElement).css({"border-style": "solid"});
//            $(activeElement).css({key:"red"});

            
            ShowInputDialog("colorPicker",target);
            break;
            
        case "slider":
            activeAttribute.value = $(activeElement).css(activeAttribute.key);
            ShowInputDialog("slider",target);
            break;
            
        default:
            
            
            
            $(activeElement).css(value);
            break;
    }
//    alert(JSON.stringify(value));


    
//    alert("done!");
//    alterInlineCSS( activeElement, value );
    
}

function Release(save)
{
    if(isLocked)
    {
        if(!save)
            $(activeElement).attr("style", activeElementStyleBackup);

    //    activeElementStyleBackup = "";
        isLocked = false;

        activeElement.contentEditable = false;

        var edit = $("#selector>#handle>#edit");
        $(edit).addClass("icon-pencil");
        $(edit).removeClass("icon-undo");
        $(edit).attr("title","Edit element");
        $(edit).tooltip({content:"Edit element"}).tooltip('close').tooltip('open').tooltip('close');

        activate();
        $(toolbar).html("");
        HideInputDialog();
    }
}

function alterInlineCSS(selector, attr)
{
    $(selector).css({"text-align": "center"});
    var style = "{" + $(selector).attr("style") + "}";

//    alert(style);
    
//    style = "background-color : pink ; color : blue ; display : table ; width : 100px ;";
    
//    style = style.replace(/;/g, ",");
    alert(style);
    var current = JSON.parse(style);
    
    
    $.each(attr, function(key, value){
        
        current[key] = value;
        
        
//        alert(key + " : " + value);
//        key = " " + key.trim() + " ";
//        value = " " + value.trim() + " ";
//        
//        var range = getAttributeRange(style, key);
//        if(range == -1)
//            style += key + ":" + value + ";";
//        else        
//            style = replaceRange(style, value,range[0], range[1]);
    });
    
    style = JSON.stringify(current);
    alert(style);
    $(selector).attr("style", style);
}

function getAttributeRange(original, key)
{
    var range = [];
    
    if(original.indexOf(key) == -1)
        return -1;
    
    
    
    range[0] = original.indexOf(":", original.indexOf(key)) + 1;
    range[1] = original.indexOf(";", range[0]);
    
    return range;
}

function replaceRange(original, str, start, end)
{
 
    return original.substring(0,start) + str + original.substring(end, original.length);
}

function HideInputDialog()
{
    var dialogue = $("#inputDialogue");
    
    $(dialogue).css({"visibility":"hidden", "height": "0px", "width":"0px", "top": "+=" + $(dialogue).outerHeight() + "px", "left": "+=" + $(dialogue).outerWidth() / 2 + "px", "opacity": 0});
    
    inputDialogue.shown = false;
}

function ShowInputDialog(inputType, target, attr, minValue, maxValue)
{
    inputDialogue.shown = true;
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

function UpdateCurrentValue(value)
{
    
    
    focusTo(activeElement);

    if( isNumber( value) )
    {
        var textbox = $("#inputDialogue #currentValue")[0];
        $(textbox).val(value);
        value = value + "px";
    }
//    alert(value);
    activeAttribute.value = value;
//    activeAttribute.attribute[key] = activeAttribute.value;
    

    $(activeElement).css(activeAttribute.key, activeAttribute.value );
    
    
//    alert($(activeElement).css(activeAttribute.key));
//    alert( activeAttribute.key + ", " + activeAttribute.value + "px \n" + $(activeElement).css(activeAttribute.value) );
}

setInterval(function(){
    if(activeElement)
        focusTo(activeElement);
},100)

function focusTo(element)
{
//    alert($("#pagePreview").scrollTop());
    $("#selector").css({
        left:$(element).offset().left + "px", 
        top:$(element).offset().top + $("#pagePreview").scrollTop() + $(window).scrollTop() + "px",
        width: $(element).outerWidth() + "px",
        height: $(element).outerHeight() + "px",
        "z-index": parseInt($(element).css("z-index")) + 1
    }); 
}


function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}

function getSelectionCharacterOffsetsWithin(element) {
    var startOffset = 0, endOffset = 0;
    if (typeof window.getSelection != "undefined") {
        var range = window.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.startContainer, range.startOffset);
        startOffset = preCaretRange.toString().length;
        endOffset = startOffset + range.toString().length;
    } else if (typeof document.selection != "undefined" &&
               document.selection.type != "Control") {
        var textRange = document.selection.createRange();
        var preCaretTextRange = document.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToStart", textRange);
        startOffset = preCaretTextRange.text.length;
        endOffset = startOffset + textRange.text.length;
    }
    return { start: startOffset, end: endOffset };
}
