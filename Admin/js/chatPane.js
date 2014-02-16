var pageLoaded = false;
var visitorsCount = 0;
var currentVisitorInChat = 0;
var currentLoadedMsgs = 0;

$(document).ready(function(){
    
    
    Update(false);
    
    
    $("#textChat").keypress(function(){
        
        if ( event.which == 13 ) {
            $.post("../Website/clientBackend.php", {method:"AdminChatSend", msg:this.value, visitorID: currentVisitorInChat}, function(data){
//                $("#content #chatbox").append(data);
                Update(false);
                $("#textChat").val("");
                
            });
        }
        
    });
    
    
    pageLoaded = true;
});


function Update(isNew)
{
    
    $.post("../Website/clientBackend.php",{method:"CheckForNewVisitor", loaded:visitorsCount}, function(data){

        if(data != "")
        {   
            visitorsCount += data.match(/<\/option>/g).length;   
            $("#selectVisitor").append(data);
        }
    });
    
    $.post("../Website/clientBackend.php",{method:"CheckForNewMessages", visitorID: currentVisitorInChat, skipCount:currentLoadedMsgs}, function(data){
            
        currentLoadedMsgs += data.match(/<span>/g).length;
        
        if(isNew)
            $("#chatbox").html(data);
        else
            $("#chatbox").append(data);
        
        
        if(data.length > 0)
            $("#chatbox").animate( {scrollTop: $("#chatbox")[0].scrollHeight +"px"});
        
    });
    
    
    
    
    
}


setInterval(function(){ if(pageLoaded)Update(false);}, 1000);

function setCurrentVisitorInChat(sel)
{
    currentLoadedMsgs = 0;
    currentVisitorInChat = sel.options[sel.selectedIndex].value;
    Update(true);
}

function Visitor(name){
    this.name = name;
    this.loadedMsgs = 0;
    this.msgs = new Array();
}

