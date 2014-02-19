var activeElement = null;
//var isEditing = true;


$(document).ready(function(){

    //////////Hover selection

    
    
    
    
    
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

function activate()
{
    $("#selector").css({"opacity":"1","visibility":"visible"});//.delay(500).css({"display":"block"});
    $(".element").css({"outline":"1px dashed gray"});
    
    
    $(".element").each(function(index){
        $(this).bind("mousemove", function(){
//            alert();
            activeElement = this;
            focusTo(activeElement);
            return false;
        });
    });
    
    
    $("#selector>#handle>#edit").click(function(){
//        $(".element").each(function(index){ $(this).unbind(); });
        $(".element").unbind();
    });
}

function deactivate()
{
    $("#selector").css({"opacity":"0", "visibility":"hidden"});//.delay(500).css({"display":"none"});
    $(".element").css({"outline":"1px dashed transparent"});
    $(".element").unbind();
}


function alterInlineCSS(selector, attr)
{
    var style = $(selector).attr("style");

    style = "background-color : pink ; color : blue ; display : table ; width : 100px ;";
    
//    var assoc = $.parseJSON(style);
    
    $.each(attr, function(key, value){
        
//        alert(key + " : " + value);
        key = " " + key.trim() + " ";
        value = " " + value.trim() + " ";
        
        var range = getAttributeRange(style, key);
        if(range == -1)
            style += key + ":" + value + ";";
        else        
            style = replaceRange(style, value,range[0], range[1]);
    });
    
    $(selector).attr("style", style);
}

function getAttributeRange(original, key)
{
    var range = new Array();
    
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


function focusTo(element)
{
//    alert($("#pagePreview").scrollTop());
    $("#selector").css({
        left:$(element).offset().left + "px", 
        top:$(element).offset().top + $("#pagePreview").scrollTop() + "px",
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
