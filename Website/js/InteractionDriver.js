
var reviewsPane = {
    Object: "",
    Items: [],
    currentIndex: 0
};

var rating = {
    changed: false,
    value: 3
}

var calendarDates;

var startDay = "";
var endDay = "";

$(document).ready(function(){

    
    
    $.post("../shared/reservationManager.php",{method:"fetchReservedDays"}, function(data){
        calendarDates = JSON.parse(data);
    });
    
    getAllReviews();
    reviewsPane.Object = $("#reviewsPanel");
    reviewsPane.Items = $("#reviewsPanel>#overflow>li");
    
    $("#faqAccrodion").accordion();
    $("#availabilityCalendar").datepicker({
//        showOtherMonths: true,
        selectOtherMonths: true,
        minDate: 0,
        onChangeMonthYear: function(year,month,inst){
            
//            alert();
            setTimeout(function(){
                tagCalendar(year,month);
            },100);
        },
        onSelect: function(date,inst){
//            alert();
            inst.inline = false;
            
        }
//        changeMonth: true,
//        changeYear: true
//        maxDate: "+1M +10D"
        
    });
    
    setTimeout(function(){
        tagCalendar(new Date().getYear(),  new Date().getMonth() + 1); 
    },100);
    
    $("#makeAReview").bind("click", function(){
        
        if($(this).html() == "Make a review")
        {
            $(this).html("Enter Key: <input type = 'text'>");
            $("#makeAReview input").bind("keyup", function(e){
                if(event.which == 13)
                {
                    var passKey = $("#makeAReview input").val();
                    $.post("../shared/reviewManager.php", {method: "fetchMakeAReview", passKey: passKey }, function(data){
                        if(data != "Invalid key")
                        {
    //                        alert($("#reviewsPanel>#overflow").html());   
                            $("#reviewsPanel>#overflow").append(data);
    //                        $("#reviewsPanel>#overflow").animate({scrollTop: $("#reviewsPanel>#overflow")[0].scrollHeight + "px"});
                            $("#reviewsPanel").animate( {scrollTop: $("#reviewsPanel")[0].scrollHeight +"px"});
                            $("#makeAReview").html("<input type = 'button' value = 'submit' onclick = 'submitReview()'>");
                            
                            $("#selectRating").bind("change", function(){
                                rating.value = 5- ($(this)[0].selectedIndex);
                                rating.changed = true;
                            });
                            
                        }
                        else
                            alert("Invalid key");
                        
                        
                    });
                }
            }); 
        }
    });
});




////////////Calendar functions/////////////////


function tagCalendar(year, month)
{
    var selector = "#availabilityCalendar table td a";
    var days = $(selector);
//    alert(year + ", " + month);

    
    days.each(function(i,e){
        var id = $(e).parent().attr("data-year") + "-" + (parseInt($(e).parent().attr("data-month")) + 1) + "-" + $(e).html();
        $(e).parent().attr("id", $(e).html()).append("<span class = 'calendar-period c1' id = '"+id+"-m' ></span><span class = 'calendar-period c2' id = '"+id+"-e' ></span>");
    });
    var periods = $("#availabilityCalendar table td .calendar-period");
    var startDay = "";
    var endDay = "";
    
    $("#availabilityCalendar table td .calendar-period").unbind();
    $("#availabilityCalendar table td .calendar-period").bind("click", function(){
        
        if(startDay == "")
        {
            startDay = $(this).attr("id");
//            endDay = startDay;
        }
        else
            endDay = $(this).attr("id");
        
        $(this).addClass("selected");
        periods = $("#availabilityCalendar table td .calendar-period");
        
        $("#selectedDates").html(startDay + " to " + endDay);
    });
    
    $("#availabilityCalendar table td .calendar-period").bind("mouseenter", function(){
//        $(this).attr("id");
        
        if(startDay != "")
        {
            var selectStart = false;
            var current = this;
            $(periods).each(function(i,e){
//                alert($(e).attr("id"));
                if(startDay == $(e).attr("id"))
                {
                    
                    selectStart = true;
                }
                
                if(selectStart)
                {
                    $(e).addClass("selected");
                }
                else
                    $(e).removeClass("selected");
                
                

                
                if( $(e).attr("id") == endDay || $(e).attr("id") == $(current).attr("id") || $(e).hasClass("occupied"))
                {
//                    alert($(e).attr("id"));
//                    alert($(e).attr("id") +" ][ "+ $(current).attr("id"));
//                    $(e).addClass("selected");
//                    endDay = $(e).attr("id");
                    selectStart = false;
                    return;
                }
                    
            });
        }
        
    });
    

    for(var tmp in calendarDates)
    {
        var e = calendarDates[tmp];
        var current = calendarDates[tmp]["count"];
        date = tmp.split("-");

        if(date[1] == month)
        {
            
//                alert(current);
            date[2] = parseInt(date[2]);
            current = parseInt(current);


            for(var i = 0; i <= Math.abs(current); i++)
            {
                var periods = $("#availabilityCalendar table td#" + ( date[2] + i) +" span");
                if( i != 0 && i != current)
                    $(periods).addClass("occupied");
                else
                {
//                    alert(e.start);
                    if(i == 0)
                        if(e.start == "e")
                        {
                            $(periods).addClass("occupied");
                        }
                        else
                            $(periods[1]).addClass("occupied");
                    else
                        if(e.end == "e")
                            $(periods).addClass("occupied");
                        else
                            $(periods[0]).addClass("occupied");
                    
                }
                    
                        
            }
//                $("#availabilityCalendar table td a" + date[2]).append("yeah");
        }

    }




    
}



function DayAhead(date1, date2)
{
    var tmp1 = date1.split("-").splice(3,1).join("-");
    var tmp2 = date2.split("-").splice(3,1).join("-");
    return tmp1 - tmp2;
}



function getAllReviews()
{
    $.post("../shared/reviewManager.php", {method:"getAllReviews", fromClient: "true"},function(data){
        
        var items = JSON.parse(data);
        $("#reviewsPanel>#overflow").html("");
        items.forEach(function(e,index){
//            alert(WrapInReviewItem(e));
              $("#reviewsPanel>#overflow").append(WrapInReviewItemClient(e));
        });
    });
}


function WrapInReviewItemClient(item)
{
    var str = "";
    
    
    if(item.reply != "")
        str = '<li class = "hasReply" ><div id = "reply"><div id = "content">'+item.reply+'</div></div>';
    else
        str = '<li>';
            
     
    str += '<div id = "name">'+item.name+'</div> \
    <div id = "content"><span id = "rating"> ';
    
    for(var i = 0; i < 5; i++)
        str += i < item.rating ? '&#9733;' : '&#9734;';
    
    str += '</span>'+item.content
    
    if(item.reply != "")
        str += '<span id = "reply">hover to view admin\'s reply</span>';
    
    str += '</div> \
    <div id = "date">'+ item.date +'</div> </li>';
    
    
    
    return str;
    
}


function submitReview()
{
    var text = $(".editing textarea#field").val();;
    var reviewID = $("#reviewsPanel .editing").attr("id");
    if(rating.changed && text.split(' ').join('').length > 15)
    {

        $.post("../shared/reviewManager.php", {method: "submitReview", reviewID:reviewID, rating: rating.value, content: text  }, function(data){
//             alert(data);
        });
    }
    else
        alert("Please complete the form");
    
}

function WrapInReviewItem(item)
{
    var str = "";
    str += '<li class="style-emboss"> \
        <div id = "name">'+ item.name +'</div><input id = "isVisible" type="checkbox"'+ (!item.isHidden ? "" : "checked") +'>\
            <div id = "content"><span id = "rating">';
            
            //&#9733;&#9733;&#9733;&#9734;&#9734; 
    for(var i = 0; i < 5; i++)
        str += i < item.rating ? '&#9733;' : '&#9734;';
            
            
    str += '</span>'+item.content+'</div>\
            <div id = "date">'+item.date+'</div>\
        <textarea placeholder="Admin reply">'+item.reply+'</textarea>\
    </li>'
    
    return str;
}

function scrollReviewsPane()
{
    reviewsPane.currentIndex++;
    
}