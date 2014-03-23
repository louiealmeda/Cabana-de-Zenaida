
var reviewsPane = {
    Object: "",
    Items: [],
    currentIndex: 0
};

var rating = {
    changed: false,
    value: 3
}

$(document).ready(function(){

    getAllReviews();
    reviewsPane.Object = $("#reviewsPanel");
    reviewsPane.Items = $("#reviewsPanel>#overflow>li");
    
    $("#faqAccrodion").accordion();
    
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
             alert(data);
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