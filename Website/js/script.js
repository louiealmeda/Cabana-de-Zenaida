var sliderRatio = 500/ 1280;
var pageLoaded = false;
var sliderIndex = 0;
var sliderSlideCount = 4;
var sliderWaitForUser = false;
var navbarPosition = 0;
var navbarTop = 0;
var navbarWidth = 0;
var unreadMsgs = 0;
var loadedMsgs = 0;
var contactUsShown = false;
var title = "Cabana de Zenaida";
var chatStarted = false;


$(document).ready(function(){
         
 
    var container = $("#pagePreview");
    if ( $(container).height() == null)
        container = window;

    $(container).scroll(function(){ scroll(container);  });

    
    $.post("clientBackend.php", {method:"VisitorSessionCheck"},function(data){
//        $("title").html(data);
        //chat started
        if(data == "ok")
        {
            
            enableChat();
            Update();
            
        }
        else
        {
            $("#register #textChat").keypress(function(){
                if ( event.which == 13 ) {
                    $.post("clientBackend.php", {method:"Register", name:this.value}, function(data){
                        if(data == "ok")
                        {
                            enableChat();
                            
                        }
                    });
                }
            });
        }
        
    });
    
    $("html , body").scrollTop();
    
    setTimeout(function(){
        $("html , body").scrollTop();
        $("body").css({ "overflow":"auto"});

        onResize();
        scroll(container);
        NavBarClick();

    //    ComputeNavBarCenter();

        //Slider controls click
        $( ".slider #container ul#sliderControls li" ).click(function() {
            var index = $( this ).index();

            ScrollSlider(index, sliderIndex);
        });

        ////Slider controls hover, leave
        $( ".slider #container ul#sliderControls").mouseenter(function(){
           sliderWaitForUser = true; 
        });

        $( ".slider #container ul#sliderControls").mouseleave(function(){
           sliderWaitForUser = false; 
        });
        /////////////////


        $("#contact_us").css({ "bottom":"-282px" }); 




        //Mini nav toggle

        $("#nav_menu_small").click(function(){

            var height = $("#sub_menu_bar").height();

            $subMenuBar = $("#sub_menu_bar");



            if($subMenuBar.css("bottom") == "-13px")
            {
                $subMenuBar.css({
                    "bottom": -height +"px"
                });
            }
            else
            {
                $subMenuBar.css({
                    "bottom":"-13px"
                });
            }

        });


        //Contact us Up and Down Toggle

        $("#contact_us #title").click(function(){
            contactUsShown = !contactUsShown;
            if( !contactUsShown )
            {
                $("#contact_us").css({ "bottom":"-282px" }); 
            }
            else
            {
                $("#contact_us").css({ "bottom":"10px" }); 
                $("#contact_us #notification").css({display:"none"});
                $("title").html(title);
                unreadMsgs = 0;
            }
        });


        $("body #loadingPage").css({ "opacity":"0", "visibility": "hidden"});


        

        

        scroll();
        pageLoaded = true;
    
    
        
    },1000)
});


function enableChat()
{
    $("#contact_us #content #overflow").css({"margin-left":"-100%"});
    $("#content #chat input.textbox").delay(3000).focus();
    $("#register #textChat").unbind();
    chatStarted = true;
    
    //////////Chat sending
    $("#chat #textChat").keypress(function(){
        if ( event.which == 13 ) {
            $.post("clientBackend.php", {method:"ChatSend", msg:this.value}, function(data){
//                $("#content #chatbox").append(data);
                if(data != "")
                {
                    Update();

                    $("#chat #textChat").val("");
                }
            });
        }
    });
}

function Update()
{
    $.post("clientBackend.php",{method:"Update", skipCount:loadedMsgs}, function(data){
        var msgCount = data.match(/<span>/g).length;
        loadedMsgs += msgCount;
        
        if(!contactUsShown)
        {

            unreadMsgs += msgCount;
            unreadMsgs = unreadMsgs > 9 ? 9 : unreadMsgs;
            $("#contact_us #notification").css({display:"block"})
            .animate({top:"+=7.5px",left:"+=7.5px",width:"0px", height:"0px",padding:"0px"},50,"linear")
            .delay(70)
            .animate({top:"+=10px",left:"+=10px",width:"20px", height:"20px"},50,"linear")
            .delay(70)
            .animate({top:"-15px",left:"-15px",width:"15px", height:"15px",padding:"5px"},50,"linear");    

            $("title").html( "(" + unreadMsgs + ") " + title);
        }
        else
        {
            $("#contact_us #notification").css({display:"none"});
            
            unreadMsgs = 0;
        }
//        alert(contactUsShown);
        
        $("#contact_us #notification").html(unreadMsgs);
        $("#chatbox").append(data);
        
        if(data.length > 0)
            $("#content #chatbox").animate( {scrollTop: $("#content #chatbox")[0].scrollHeight +"px"});
        
    });
    
    
}



setInterval(function(){ if(pageLoaded)Update();}, 1000);

setInterval(function(){

    if(!sliderWaitForUser)
        ScrollSlider((sliderIndex + 1) % sliderSlideCount, sliderIndex);
    
}, 10000);

function ComputeNavBarCenter()
{
    $navBar = $("#menu_item_container");
    
    if(!pageLoaded)
        navbarWidth = $navBar.outerWidth();
    
    navbarPosition = ($("#main").outerWidth() - navbarWidth) / 2;
    navbarPosition = navbarPosition / $("#main").outerWidth() * 100;
    navbarTop = $("#logo_container").height();//offset().top;
    
    $navBar.css({
        "margin": "0px " + ( navbarPosition ) + "%",
        "-webkit-transition": "0s"
    });
    
    
}

function NavBarClick()
{
    
    $("#menu_item_container>li").bind("click", function(){
        
        var target = "html, body, #pagePreview";
//        alert()
//        if($("#pagePreview").html != "")
//            target = "#pagePreview";
        $(target).animate({ scrollTop: $(this).index() * 500 +  "px" });
        
    });
    
//    $("#mi1").click(function(){
//        $("html, body").animate({ scrollTop:  "0px" });
//    })
//    
//    $("#mi2").click(function(){
//        $("html, body").animate({ scrollTop:  "300px" });
//    });
//        
//    $("#mi3").click(function(){
//        $("html, body").animate({ scrollTop:  "600px" });
//    });
//        
//    $("#mi4").click(function(){
//        $("html, body").animate({ scrollTop:  "900px" });
//    });
}

function ScrollSlider( index, prevIndex )
{
    
    if(index == prevIndex)
        return;
//    $(".slides .slide:nth-child("+ (prevIndex + 1) +") #caption")
////    .animate({width:"40%"}, "fast")
//    .animate({left:"0%", width: "0%"}, "fast")
//    .animate({opacity: "0"}, "fast")
//    ;
//    alert();
//    setTimeout(function(){
    
        $(".slider .slides .inner").css({
                "margin-left": -index * 100 + "%"
            });
        $( ".slider #container ul#sliderControls li" ).removeClass("selected");
        $( ".slider #container ul#sliderControls li:nth-child("+ (index + 1) +")").addClass("selected");
        sliderIndex = index;
        
//        $(".slides .slide:nth-child("+ (index + 1) +") #caption")
////        .delay(60)
//        .animate({opacity: "1"}, "fast")
//        .animate({width:"40%"}, "fast").delay(300)
//        .animate({left:"10%", width: "30%"}, "fast")
//        ;
        
//    },500);
}


/////////Resizing functions///////////
$(window).resize(onResize);

function onResize(){
    ComputeNavBarCenter();
    
    /////window is smaller than navbar
    if( $(window).width() > navbarWidth )
    {
        $("#sub_menu_bar").css({ bottom:"-13px" });
//        $("#sub_menu_bar").css({ height:"30px" });
//        $("#sub_menu_bar ul").css({display:"none"});
    }
    
    
    if( $(window).width() < navbarWidth + 20 )
    {
        $("#nav_bar #smallScreen").css({display:"block"});
        $("#menu_item_container").css({display:"none"});

        $("#header #nav_bar>ul#smallScreen>li #search_bar").css({"width":"100%"});
    }
    else
    {
        $("#header #nav_bar>ul#smallScreen>li #search_bar").css({"width":"40px"});
        $("#nav_bar #smallScreen").css({display:"none"});
        $("#menu_item_container").css({display:"block"});
        
    }
    
    var sliderRatioApplied = sliderRatio;
    if($(window).width() < 700)
        sliderRatioApplied *= 1.5;
    if($(window).width() < 500)
        sliderRatioApplied *= 2;
    
//    $(".slide").css({"height": $(window).width() * sliderRatioApplied + "px"});
    $(".slide").css({"height": $(window).height() * 0.8 + "px"});
    
    
//////////////reflowing elements/////////////////
    var elements = $(".element.columns *");

    for(var i = 0; i < elements.length; i++)
    {
//        alert($(elements[i]).width());
        var e = elements[i];
//        $(e).css({"display":"block", "width":"100%", "margin":"0px", "padding-left":"0px", "padding-right":"0px"});
        if($(e).outerWidth() < 300)
        {
            
//            $(e).css({"display":"block", "width":"100%", "margin":"0px", "padding-left":"0px", "padding-right":"0px"});
//            $(e).children().css({"display":"block", "width":"100%"});
//            $(e).parent().css({"display":"block", "width":"100%", "padding-left":"0px", "padding-right":"0px"});
//            $(e).html($(e).outerWidth());
        }
    }

//    alert( $(elements[0]).width() );

};

////////Scrolling functions//////////////
function scroll(container) {
    var delta = $(container).scrollTop();
    var sliderHeight = $(".slide").css("height");
    sliderHeight = sliderHeight.substr(0,sliderHeight.length - 2);
    
    var offset = delta / $(container).height();
    
    //slider scrolling
    $(".slide").css({
        "background-position-y":  80 - (offset * 70) + "%" 
    });
    
    if (delta > navbarTop)
    {
        if($(".nav_bar_container").css("position") != "fixed")
        {
            //fixed top, scrolled down
            $("#nav_bar_container").css({
                "position":"fixed",
                "top":"0px",
                "width":"100%"
            });
            
            $("#menu_item_container").css({
    //            "margin-left":"0%",
                "-webkit-transition": "0.5s"
            });
            
            $("#nav_bar_filler").css({
                "display":"block"
            });
        }
    }
    else
    {
        if($(".nav_bar_container").css("position") != "relative")
        {
            //shown title
            $("#nav_bar_container").css({
                "position":"relative"
            });
            
            $("#menu_item_container").css({
                "margin": "0px " + navbarPosition + "%",
                "-webkit-transition": "0.5s"
            });
            
            $("#nav_bar_filler").css({
                "display":"none"
            });
        }
    }
}

//var tmp = 0;

//var timer2 = setInterval(function(){scrollUpdate()},150);
//function scrollUpdate(){
//    tmp++;
////        scroll();
//    $("#contact_us #title").html(tmp);
//}

//(function() {        
//    var timer;
//    var timer2;
//    $(window).bind('scroll',function () {
//        timer2 = setInterval(function(){scrollUpdate()},150);
//        clearTimeout(timer);
//        timer = setTimeout( refresh , 150 );
//    });
//    var refresh = function () { 
//        // do stuff
//        clearInterval(timer2);
////        alert('Stopped Scrolling'); 
//    };
//    
//    
//})();

