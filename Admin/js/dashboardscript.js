var weeksStats;
var daysStats = [];
var weekLabels = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

$(document).ready(function(){
    
    if(window.location.search == "")
    {
        sessionCheck(false);
    }
    ////Tester
    GetAllReviews();
    ScrollPane(1);

    $("#dashboard li").click(function(){
    
        switch($(this).index())
        {
            case 2:
                ScrollPane(0);
                break;
            case 3:
                GetAllReviews();
                ScrollPane(1);
                break;
            case 4:
                ScrollPane(2);
                break;
            case 5:     
//                alert();
                
                window.open("chatpane.html",'popUpWindow','height=400,width=220,left=100, top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
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


function ScrollPane(i)
{
    $("#contentPane>#overflow").css({"top": -i * 100 + "%"});
//    alert($("#contentPane>#overflow").css("margin-top"));

}

function GetAllReviews()
{

    $.post("../shared/reviewManager.php", {method:"getAllReviews"}, function(data){
        var items = JSON.parse(data);
        $("#contentPane div> #container #reviewsList").html("");
        items.forEach(function(e,index){
//            alert(WrapInReviewItem(e));
              $("#contentPane div> #container #reviewsList").append(WrapInReviewItem(e));
        });
    });
}

function WrapInReviewItem(item)
{
    var str = "";
    str += '<li id = "review'+item.reviewID+'" class="style-emboss"> \
        <div id = "name">'+ item.name +'</div><input id = "isVisible" type="checkbox"'+ (!item.isHidden ? "" : "checked") +'>\
            <div id = "content"><span id = "rating">';
            
            //&#9733;&#9733;&#9733;&#9734;&#9734; 
    for(var i = 0; i < 5; i++)
        str += i < item.rating ? '&#9733;' : '&#9734;';
            
            
    str += '</span>'+item.content+'</div>\
            <div id = "date">'+item.date+'</div>\
        <textarea placeholder="Reply to this review">'+item.reply+'</textarea>\
    </li>'
    
    return str;
}


function saveReviewChanges()
{
    var data = [];
    var items = $("#contentPane div> #container #reviewsList>li");

    
    $(items).each(function(i, item){

        data.push({"reviewID": $(item).attr("id").split("review").join("")});
        
        data[data.length - 1].isHidden = !$(item).children("#isVisible")[0].checked;
        data[data.length - 1].reply = $(item).children("textarea").val();
        
    });
    
    data = JSON.stringify(data);

    $.post("../shared/reviewManager.php", {method:"saveAdminReviewChanges", data: data}, function(data){
//        alert(data);
    });
}

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
