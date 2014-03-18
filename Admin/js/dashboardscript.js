var weeksStats;
var daysStats = [];
var weekLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

$(document).ready(function(){
    
    if(window.location.search == "")
    {
        sessionCheck(false);
    }
    

    $("#dashboard li").click(function(){
    
        switch($(this).index())
        {
            case 4:
                
                break;
            case 3:     
                alert();
                window.open("chatpane.html",'popUpWindow','height=400,width=200,left=100, top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
                break;
            case 7:
                window.location.replace("cms.html");
                break;
        }
    });
    
    
    $.post("dashboard.php",{method:"GetWeekRange"}, function(data){
//        alert(data);
        data = data.split("|");
        
//        weeksStats = data[1].split(",");
        
        data[0] = data[0].split("<m>");
        
        
        for(var i = 0; i < data[0].length; i++)
        {
            daysStats[i] = data[0][i].split(",");
//            alert(daysStats[i]);
        }
        
//        daysStats = data[0].split(",");
//        var minMax = data[0].split(",");
        
        $("#statRange").attr("min", 1);
        $("#statRange").attr("max", daysStats[0].length - 7);
        
        
//        alert(weeksStats);
    });
    
    
    SwitchToWeekly();
    
});

function SwitchToWeekly()
{
    $("#graph>ul>li>span#label").each(function(index,e){
        $(e).html(weekLabels[index]);
    });
}

function UpdateBarGraph(sender)
{
    
    var value = sender.value - parseInt($(sender).attr('min'));
    var top = 0;
    var str= "";
    for(var i = value; i < value + 7; i++)
    {
        if(top < parseInt(daysStats[0][i]))
            top = daysStats[0][i];
    }
    if(top == 0)
        top = 1;

    $("#values").html("<li>"+top+"</li>");
    
    $("#graph>ul>li>div").each(function(index, e){
        var current = daysStats[0][value + index];
        $(e).css({"height": (current / top * 100) + "%"});
        $(e).children("#value").html(current);
    });
    
}

function Logout()
{
    $.post("dashboard.php", {method:"logout"}, function(data){
        location.replace(data);
    });
}

function loadStatistics()
{
    
}
