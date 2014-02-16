$(document).ready(function(){
    
    if(window.location.search == "")
    {
        sessionCheck(false);
    }
    
    
    $("#dashboard li").click(function(){
    
        switch($(this).index())
        {
            case 7:
                window.location.replace("cms.html");
                break;
        }
    });
});
