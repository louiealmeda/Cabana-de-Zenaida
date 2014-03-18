var MessageBox = {
    "Show":Show,
    "Hide":Hide
}


//options: array of options
//option: [title][callback]
function Show(title, message, options)
{
    
    Hide();
    setTimeout(function(){
        
    
        var nWindow = $("#notificationBG>div#window");
        $(nWindow).children("#content").children("#spacer").html("<div id = 'message'></div>");    
        $("#notificationBG").css({"opacity":"1","visibility":"visible"});
        var inside = false;
        $(nWindow).mouseenter(function(){inside = true;});
        $(nWindow).mouseleave(function(){inside = false;});

        $("#notificationBG").click(function(){if(!inside)Hide();});

        var sound = new Audio("sounds/Submarine.wav");
        sound.play();

        $(nWindow).children("#title").html(title);
        $(nWindow).children("#content").children("#spacer").children("#message").html(message);

        options.forEach(function(o){

            var spacer = $(nWindow).children("#content").children("#spacer").append("<div class = 'button'>"+ o.title +"</div>");

            $(spacer).children("div:last-child").click(o.callBack);
        });

        var width = $(nWindow).outerWidth();
        var height = $(nWindow).outerHeight();


        $(nWindow).css({"margin-left":-width/2+"px", "margin-top":-height/2+"px"});

    },10);
    
}

function Hide()
{
    var nWindow = $("#notificationBG>div#window");
    
    $(nWindow).css({"margin-top":"+=50px"});
    $("notificationBG *").unbind();
    
    
    $("#notificationBG").css({"opacity":"0","visibility":"hidden"});
    
}