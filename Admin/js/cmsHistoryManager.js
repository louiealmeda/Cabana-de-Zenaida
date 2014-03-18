
$(document).ready(function(){
    LoadAllHistoryStates();
});

function SaveHistory(type, description)
{
    var description = description || "";
    var state;
    
    if(type == "element")
    {
        
        $(".element").css({"outline":"1px dashed transparent"});
        $("#selector").css({"opacity":"0", "visibility":"hidden"});
        state = $("#pagePreview").html();
        state = state.split("ui-droppable").join("").split('contenteditable="true"').join("");
        description =  description || activeElement.ActiveAttribute.key + " = " + activeElement.ActiveAttribute.value;
    }
    else if(type = "color")
    {

        var palettes = $(".colorPalette");
        state = [];
        
        for(var i = 0; i < palettes.length; i++)
        {

    //        alert($(palettes[i-1]).css("background-color") + "|" + colors[i]);
            state.push($(palettes[i]).css("background-color"));

        }
        
        state = "0|" + state.join("|") + "|custom";

        description =  description || "Changed theme color";
    }
    
    description = description || "Changed content";
    
    
    $.post("HistoryManager.php", { method:"SaveHistory", desc:description, content: state, type: type}, function(data){
//        alert(data);
//        $("#editPanel #editPanelContent #overflow #historyPane>ul").append("<li>" + data + "</li>");
        $("#savedStatus").html(data);
//        revertedHistory = true;
        LoadAllHistoryStates();
    });
    
}

function LoadAllHistoryStates()
{
    
    
    $.post("HistoryManager.php", { method:"LoadHistoryState" }, function(data){
        var historyStates = "#editPanel #editPanelContent #overflow #historyPane>ul";
        $(historyStates).html(data);
        $(historyStates).animate( {scrollTop: $(historyStates)[0].scrollHeight +"px"});
        
//        alert(data);
//        data = JSON.stringify(data);
//        data.forEach(function(e,index){
//            $("#editPanel #editPanelContent #overflow #historyPane>ul").append(e);
//        });
        
    });
}

function publish()
{
    if(isEditing)
        deactivate();
    
    
    var selector = $("#selector").html();
    $("#contact_us").css({"display":"inline-block"});
    
    $("#selector").remove();
    var html = $("#pagePreview").clone();
    var css = $("#currentTheme").html();
    
    $("#pagePreview").append(selector);
    $("#contact_us").css({"display":"none"});
    
    html = $(html).html();
    html = html.split("ui-droppable").join("").split('contenteditable="true"').join("");
    
    
//    alert(html);
//    alert(css);
    MessageBox.Show("Publish", "Please input your password to publish this version", [{"title":"cancel", "callBack": function(){}},{"title":"next","callBack":function(){}}]);
    
    $.post("dbManager.php", {method: "publish", html:html, css: css}, function(data){
        alert(data);
    });
    
}

function removeElements(text, selector) {
    var wrapped = $("<div>" + text + "</div>");
    $(wrapped).find(selector).remove();
    return $(wrapped).html();
}

function revertToHistoryState(id, callback)
{   
//    if(isEditing)
//        deactivate();
//    alert(id);
    $.post("HistoryManager.php", { method:"RevertToHistoryState", id:id }, function(data){
//        alert(data);
        var rows = data.split("[<:diffHistory:>]");
        
        rows.forEach(function(data,index)
        {
            data = data.split("[<:historyDivider:>]");
            revertedHistory = true;
            var type = data[0];
            if(type == 'element')
                $("#pagePreview").html(data[1]);
            else if(type == 'color')
                changeTheme(data[1], true);
        });
        if(callback!= null)
            callback();
        
        
        ResetDragDrop();
//        activate();
    });
    
}