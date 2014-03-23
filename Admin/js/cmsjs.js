var editPanelVisible = false;
var isEditing = false;


var activeToolbar;
//var tmpActiveColor = {"Red": 0, "Green":0, "Blue": 0, "Alpha": 0};

var draggableComponents = {
    "Text Area" : [ "icon-font", "element text" ],
    "Columns" :  [ "icon-twocolumnsright", "element text columns" ],
    "Image" :  [ "icon-picture", "element text image" ]
//    "Video" : ["icon-video", "element text video"]
};


$(document).ready(function(){

    sessionCheck(false);
    
    var previewHeight = $(window).height() - $("#editPanel").height();
    
    $("#pagePreview").css({"height": previewHeight + "px"});
    
    

    $.post("dbManager.php", {method:"getStyleSheet"}, function(data){
        $("#currentTheme").html(data);
//        alert(data);
    
        $("#pagePreview").load("Website/index.html #main",function(){
            $("#contact_us").css({"display":"none"});
            
            revertToHistoryState("last",function(){
                LoadSectionsManager();
                CMSControlerLoad();
                ComputeNavBarCenter(true);
                
            });
            
        });
    
    });
    GenerateComponents();
    
    $("input, select").attr("tabindex","-1");
    
    
    $("#editPanel #header #tabs li").click(function(){
        
        if(!editPanelVisible)
            ShowEditPanel(true);
        
        $("#editPanel #header li").removeClass("selected");
        $(this).addClass("selected");
        
        $("#editPanel #editPanelContent #overflow").animate({"margin-left": -$(this).index() * 100 + "%"});

        
        loadToolbar($(this).index());
        
//        if($(this).index() == 1)
//        {
//            
//        }
        
    });
    
    
    $("#editToggle #switch").click(function(){
        var bullet = $("#switch #bullet");
        
//        isEditing = !isEditing;
        if(isEditing)
        {   
            if(deactivate())
            {
                $(bullet).css({
                    "left":"0%",
                    "border-left":"none", 
                    "border-right":"1px solid  rgba(255, 0, 0, 0.76)"
                });
                $(this).css({"box-shadow": "inset -2px 0px 5px red"});
            }
            
        }
        else
        {
            if(activate()){
                
            }
                $(bullet).css({
                    "left":"50%",
                    "border-left":"1px solid green",
                    "border-right":"none"

                });
                $(this).css({"box-shadow": "inset 3px 0px 8px green"});
            
        }
    });
    
    /////////Themes loader
    $.post("dbManager.php",{method:"getThemes"},function(data){
        $("#editPanel #editPanelContent #overflow #colors #themes").html(data);
    });
    
    
    
    
    
    $("#editPanel #header>#toggle").click(function(){        
        ShowEditPanel(!editPanelVisible);
    });
    
    NavBarClick();
    
    LoadLibraryImage();
    
    
    
});

function loadToolbar(index)
{
    
    if(index == activeToolbar)
        return;
    
    activeToolbar = index;
    $('#upload').unbind();
    
    
    switch(index)
    {
        case 0:
            break;
            
        case 1:
            break;
        
        case 2:
            break;
            
        case 4:
            break;
            
        case 3:
            $('#upload').bind("change", function(){
                var formData = new FormData($("#form-upload")[0]);
                for (var i = 0, len = document.getElementById('upload').files.length; i < len; i++) {
                    formData.append("upload"+(i+1), document.getElementById('upload').files[i]);
                }
                $.ajax({
                    url : "dbManager.php",
                    type : 'post',
                    data : formData,
                    async : true,
                    processData: false, 
                    contentType: false,
                    error : function(request){
//                        alert(request.responseText + "error");
                        LoadLibraryImage();
                    },
                    success : function(data){
//                        alert(data);
//                        $("#imageManager>ul").html(data);
//                        alert();
                        LoadLibraryImage();
                        
                    }
                }); 
            });  
            
            break;
            
    }
}


function LoadLibraryImage(value)
{
    
    $.post("dbManager.php",{method:"getImageLibrary"}, function(data){
        availableImages = JSON.parse(data);



        ///////Image picker////////
        var gridSelector = "#inputDialogue #imagePicker #inner>#grid>#pickerOverflow";
        $(gridSelector).html("<li style='background-image:url()'></li> \n");
        ///////Image Library////////
        $("#imageManager>ul").html("");

        availableImages.forEach(function(e,index){
            $(gridSelector).append("<li style = 'background-image: url("+e+")'></li>");
            $("#imageManager>ul").append("<li style= 'background-image: url("+e+")'></li>");
        });

    });

    
    
    
    
}

function GenerateComponents()
{
    
    var str = "";
    
    $.each(draggableComponents, function(key, value){
         str = str + '<li class="component" alt = "'+ value[1] +'"> <div class="'+ value[0] +'" ></div> <span> ' + key + '</span> </li>\n';
    });
    
    $("#editPanel #editPanelContent #components").html(str);
}

function ShowEditPanel(show){
    var btn = $("#editPanel #header>#toggle");
    if(!show)
    {
        var height = $("#editPanel #header").outerHeight();
        $("#editPanel").css({"height": height + "px"}); //.css({"bottom":"-245px"});
//        $("#editPanel").css({"bottom":"-240px"});
        $("#pagePreview").css({"height":"+=" + (240 - height) + "px"});
        $("#pagePreview").animate({scrollTop: "-=" + (240 - height) + "px"},500, "linear");
        $(btn).removeClass('icon-chevron-down');
        $(btn).addClass('icon-chevron-up');
//        $("#editPanel #header li").removeClass("selected");
    }
    else
    {
        var height = $("#editPanel #header").outerHeight();
        $("#editPanel").css({"height":"240px"});//css({"bottom":"0px"});
//        $("#editPanel").css({"bottom":"0px"});
        $("#pagePreview").css({"height":"-="+ (240 - height) + "px"});
        $("#pagePreview").animate({scrollTop: "+=" + (240 - height) + "px"},500, "linear");
        $(btn).removeClass('icon-chevron-up');
        $(btn).addClass('icon-chevron-down');
    }
    
    editPanelVisible = show;
    
}



function zoomImageLibrary(value)
{
    $("#editPanel #editPanelContent #overflow #imageManager>ul>li").css({"width":value + "px", "height":value + "px"});
}

function isNumber (o) {
  return ! isNaN (o-0) && o !== null && o.replace(/^\s\s*/, '') !== "" && o !== false;
}