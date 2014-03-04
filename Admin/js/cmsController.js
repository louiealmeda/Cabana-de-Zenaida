//var activeElement = null;
//var activeElement.ActiveAttribute = { key:"", value: "", attribute: {"":""} };
//var activeElementStyleBackup = "";
var isLocked = false;
var toolbar;
var InputDialogue = {"Shown":false, "Target":null};
//var isEditing = true;

var elementOptions = {
    element : {
        "Transform" : ["icon-transform", {"transform": "triSlider"} ],
        "Move Vertical" : ["icon-resize-vertical", {"top": "slider|0|300"} ],
        "Move Horizontal" : ["icon-resize-horizontal", {"left": "slider|0|300"} ],
        "Margin" : ["icon-snaptogrid", {"margin": "slider|0|100"} ],
        "Padding" : ["icon-canvasrulers", {"padding": "slider|0|100"} ],
        "Background Color" : ["icon-bucket", {"background-color": "colorPicker"} ],
        "Border" : ["icon-pigpene", {"border-width": "slider|0|100"} ],
        "Border Color" : ["icon-palette-painting", {"border-color": "colorPicker"} ],
        "Border Radius" : ["icon-roundrectangle", {"border-radius": "slider|0|100"} ],
        "Shadow" : ["icon-subtractshape", {"box-shadow": "triSlider"} ],
        "Align Left" : ["icon-alignleftedge", {"float": "left"} ],
        "Align Center" : ["icon-alignhorizontalcenter", {"float": "none"} ],
        "Align Right" : ["icon-alignrightedge", {"float": "right"} ]
        },
    text : {
        "Text Color" : ["icon-crayon", {"color": "colorPicker"} ],
        "Font Size" : ["icon-text-height", {"font-size": "slider|5|100"} ],
        "Text Shadow" : ["icon-fontcase", {"text-shadow": "triSlider"} ],
        "Align Left" : ["icon-align-left", {"text-align": "left"} ],
        "Align Center" : ["icon-align-center", {"text-align": "center"} ],
        "Align Right" : ["icon-align-right", {"text-align": "right"} ],
        "Justify" : ["icon-align-justify", {"text-align": "justify"} ]
        },
    image: {
        
    }
//    ,
    
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
    
    
    $("#selector, #editPanel").tooltip();
    
    
    $("#pagePreview").click(function(){
        HideInputDialog();
    });
    
    
   
    
    
    
    
    
    
//    activate();
    
//    ShowInputDialog("shadow",$("#editPanel"));
}

function LockElement()
{
    var e = $("#selector>#handle>#edit");
    $(".element").unbind();
        
    if(isLocked)
    {
        Release(false);
        
        
    }
    else
    {
        $(e).removeClass("icon-pencil");
        $(e).addClass("icon-undo");
        $(e).tooltip({content:"Release element without saving"}).tooltip('close').tooltip('open');
        $(e).attr("title","Release element without saving");
        /////////Element Selection
        selectElement();
        isLocked = true;
        
        
    }
}

function selectElement()
{
    
    
    activeElement.Object.contentEditable = true;
    activeElement.BackupStyle = $(activeElement.Object).attr("style");
    GenerateToolbar();
    
}

function activate()
{
    deactivate();
    
    $("#pagePreview").click(function(){
        HideInputDialog();
    });
    
    $("#selector").css({"opacity":"1","visibility":"visible"});//.delay(500).css({"display":"block"});
    $(".element").css({"outline":"1px dashed gray"});
//    $(".element").addClass(".editing");
    
    $(".element").each(function(index){
        $(this).bind("mousemove", function(){
//            alert();

            activeElement.Object = this;
            focusTo(activeElement.Object);
            return false;
        });
    });
    
    
    $("#menu_item_container").sortable({
        cancel: "#searchBarContainer",
        axis: "x",
        containment: "parent",
        placeholder: "menu_itemPlaceholder",
        forcePlaceholderSize: true
    });
    $("#menu_item_container").attr("alt",'1');
    
    
    $(".element").dblclick(function(){
        LockElement();
    });
    
    $(".component").css({"pointer-events":"all"});
    EnableDropping(true);
    
    
    $("#selector>#handle>#remove").click(function(){
        $(this).tooltip('close');
        var parentE = $(activeElement.Object).parent();
        focusTo(parentE);
        $(activeElement.Object).remove();

        activeElement.Object = parentE;

        activate();
    });
    
    
    $("#selector>#handle>#edit").click(LockElement);
    
    
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
    
    $( ".component" ).draggable({
      connectToSortable: ".element",
      helper: "clone",
      revert: "invalid"
    });
    
    isEditing = true;
}

function deactivate()
{
    
    Release(false);
    $("#selector").css({"opacity":"0", "visibility":"hidden"});//.delay(500).css({"display":"none"});
    $(".element").css({"outline":"1px dashed transparent"});
//    $(".element").removeClass(".editing");
    $(".element").unbind();
    EnableDropping(false);
    $(".component").css({"pointer-events":"none"});
    
    $("#selector>#handle>#edit").unbind();
    
    if($("#menu_item_container").attr("alt") == '1')
    {
        $("#menu_item_container").sortable('destroy');
        $("#menu_item_container").attr("alt",'0');
        
    }
    
    if(isEditing)
    {
        
        $(".element").droppable('destroy');
        $( ".component" ).draggable('destroy');
    }
    
    $("#selector>#handle>#remove").unbind();
    
//    $("#menu_item_container").sortable('destroy');  
//    $( ".component" ).draggable('destroy');
//    $(".element").droppable('destroy');
    
    isEditing = false;
}

function EnableDropping(state)
{
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
    
//    alert(elementString);
    
    $( containingE ).append( elementString );
    
    if($(containingE).hasClass("columns"))
    {
        $(containingE).removeClass(); 
        $(containingE).addClass("element columns " + "c" + $(containingE).children().length);
        
    }
    
}

function GenerateToolbar()
{
//  
    var editingIcons = "<li title ='Save and release element' class = 'icon-ok-circle' onclick='Release(true)'>";
    
    var classes = $(activeElement.Object).attr("class").split(" ");
    
//    var classes = ["element", "text"];//
    //eo = element option
    var eo;
    var index = 0;
    for(var i = 0; i < classes.length; i++)
    {
        eo = classes[i];
        
        
        if(eo in elementOptions)
        {
            editingIcons += "<li class = 'divider'></div>";
            $.each(elementOptions[eo], function(key, value){
    //            alert(key + ": " + value); 
                editingIcons += "<li id = '" + index + "' class = '" + value[0] + "' title ='" + key + "' onclick = \'ToolbarItemClick(" + JSON.stringify(value[1]) + "," + index + ")\'></li>\n"; 

                index++;
            });
        }
        
    }
    
//    alert(editingIcons);
               
    $(toolbar).html(editingIcons);
}

function ToolbarItemClick(value,index)
{   
    
    var target = $("#editPanel #header ul#options li#" + index);
    
    if(inputDialogue.Shown && $(inputDialogue.Target).attr("id") == $(target).attr("id"))
    {
        HideInputDialog();
        return;
    }

    InputDialogue.Target = target;
        
//    alert(JSON.stringify(value));

    $.each(value, function(key, value){
        activeElement.ActiveAttribute.key = key;
        activeElement.ActiveAttribute.value = value;
        return false;
    });
    

//    alert(JSON.stringify(value));
    
    var inputType = activeElement.ActiveAttribute.value.split("|");
    
    activeElement.ActiveAttribute.value = inputType[0];
    
    switch(activeElement.ActiveAttribute.value)
    {
        case "colorPicker":
            activeElement.ActiveAttribute.value = $(activeElement.Object).css(activeElement.ActiveAttribute.key);
            var key = activeElement.ActiveAttribute.key;
            if(key.indexOf("border") != -1)
                $(activeElement.Object).css({"border-style": "solid"});
            
            
            ShowInputDialog("colorPicker",target);
            break;
            
        case "slider":
            activeElement.ActiveAttribute.value = $(activeElement.Object).css(activeElement.ActiveAttribute.key);
            
            ShowInputDialog("slider",target,null, inputType[1], inputType[2]);
            
            break;
            
        case "triSlider":
            activeElement.ActiveAttribute.value = $(activeElement.Object).css(activeElement.ActiveAttribute.key);
            ShowInputDialog("triSlider",target);
            break;
            
        default:
            
            $(activeElement.Object).css(value);
            break;
    }
    
    
    
}

function changeTheme(sender)
{
    var colors = new Array();
    colors = sender.value.split('|');
    
    var palettes = $(".colorPalette");
//    alert(palettes[1]);
    
//    alert($(palettes[0]).css("background-color"));
//    alert($(palettes[1]).css("background-color"));
//    alert($(palettes[2]).css("background-color"));
    
    for(var i = 1; i < colors.length; i++)
    {
        
//        alert($(palettes[i-1]).css("background-color") + "|" + colors[i]);
        ModifyTheme($(palettes[i-1]).css("background-color"), colors[i]);
        
    }
    
//    sender.value 
}

function changeThemeColor(sender, index)
{
    
    ShowInputDialog("colorPicker",sender, function(value){
        var prev = $(sender).css("background-color");
        value = value.substr(0, value.lastIndexOf(',')) + ")";
        value = value.replace('a',"");
        
//        $(sender).css({"background-color":value});
        
        
        ModifyTheme(prev, value);
    } );
} 

function ModifyTheme(prev, value)
{
//    alert(prev + "|" + value);
//    $("#currentTheme").html(function(index, html){
//        return html.replace(prev, value); 
//    });
//    alert(prev + ", " + value);
    var html = $("#currentTheme").html();
    $("#currentTheme").html(html.split(prev).join(value));//.replace(prev, value));
//    alert(prev + "|" + value + "\n" + $("#currentTheme").html());
}

function Release(save)
{
    if(isLocked)
    {
        if(!save)
            $(activeElement.Object).attr("style", activeElement.BackupStyle);

    //    activeElementStyleBackup = "";
        isLocked = false;

        activeElement.Object.contentEditable = false;

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


setInterval(function(){
    if(activeElement.Object)
        focusTo(activeElement.Object);
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
