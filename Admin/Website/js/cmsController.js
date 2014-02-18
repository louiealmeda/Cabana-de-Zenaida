var activeElement = null;
var isEditing = true;


$(document).ready(function(){

    //////////Hover selection
    if(isEditing)
    {
        $(".element").each(function(index){
            $(this).mousemove(function(){

                    activeElement = this;
                    focusTo(activeElement);

                return false;
            });
        });
    }
    
    
    if(isEditing)
        activate();
    else
        deactivate();
    
    
//    $("#selector").draggable({handle:"#handle"});
    
//    $(".element").sortable({
////        cursorAt: { top:  $(window).scrollTop(), left: 0 }
//    }).disableSelection();
    
    
    

    
//    alterInlineCSS( "#handle", {"display":"block", "color":"red","float":"right", "clear":"left"} );

});

function activate()
{
    $("#selector").css({"display":"block"});
    $(".element").css({"outline":"1px dashed gray"});
}

function deactivate()
{
    $("#selector").css({"display":"none"});
    $(".element").css({"outline":"none"});
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


//function stringToAssoc(str)
//{
//    var assoc = Array();
//    
//    var individuals = str.split(";")
//
//    for(var i = 0; i < individuals.length - 1; i++)
//    {
//        
//        var parts = individuals[i].split(":");
////        alert("'"+ parts[0].trim() +"'");
//        assoc[parts[0].trim()] = parts[1];
//    }
//    
//    
////    $.each(test, function(key, value){
////        
////        alert(key + " : " + value);
////    
////        
////    });
//    
//    return assoc;
//    
//}

function focusTo(element)
{
    $("#selector").css({
        left:$(element).offset().left + "px", 
        top:$(element).offset().top + "px",
        width: $(element).outerWidth() + "px",
        height: $(element).outerHeight() + "px",
        "z-index": parseInt($(element).css("z-index")) + 1
    }); 
}

