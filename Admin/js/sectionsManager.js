var sectionsContainer;
var tabsContainer;
var sections;
var navigationalTabs;

var tabsTarget = [];
function LoadSectionsManager()
{
    sectionsContainer = $("#editPanel #editPanelContent #overflow #sectionsManager #tabsSections> #sections");
    tabsContainer = $("#editPanel #editPanelContent #overflow #sectionsManager #tabsSections> #tabs");
    
    
    
    
    ReloadTabsList(true);
    ReloadSectionList(true);
    
    ComputeNavBarCenter(true);
   
}

function WrapInTabItemString(id, name)
{
    return '<li id = "'+id+'">\
    <span class = "handle icon-menu"></span>'+name+'\
    <span class = "icon-remove" onclick = "deleteSection(\''+id+'\')"></span>\
    <span class = "icon-eye-close" onclick = "hideSection(\''+id+'\')"></span>\
    <span class = "icon-search" onclick = "scrollToSection(\''+id+'\')"></span>\
    </li>';
}

function ReloadTabsList(justStarted)
{
     justStarted = justStarted || false;
    
    if(justStarted)
    {
        $(sections).unbind();
    }
    
    navigationalTabs = $(".menu_item");
    
    tabsContainer.html("");
    tabsTarget = [];
    
    $(navigationalTabs).each(function(index, e){
        var target = $(e).attr("alt");
        tabsTarget.push(target);
        
        
    });
    
//    alert(tabsTarget.join(","));
    
}

function InitializeTabsInteractions()
{
    $(tabsContainer).sortable({
        handle: ".handle",
        containment: sectionsContainer,
        axis:"y",
        start:function(event, ui){
            startingIndex = ui.placeholder.index();
        },
        change: function( event, ui ) {
//            $("title").html($(ui).placeholder.index() + "yeah");
            finalIndex = ui.placeholder.index();
//            ReorderSections(ui.placeholder.index());
//            alert(ui.draggable.index());
        },
        stop: function(event, ui){
            ReorderTabs(startingIndex, finalIndex);
        }
    });
}

function ReorderTabs(start,end)
{
//    alert(start + ", " + end);
    
    $(tabsContainer).children().each(function(index,e){
        if($(e).attr("id"))
        {
            var target = $(e).attr("alt");
            
            target = $(sections[index]).attr("id");
//            alert();
//            alert(target+"|"+ $( ".menu_item#" + $(e).attr("id")).html());
            $( ".menu_item#" + $(e).attr("id")).attr("alt", target ).attr("onclick", "scrollToSection('" + target + "')") ;
            
        }
    });
    
    ReloadTabsList()
    ReloadSectionList();
    
}

function ReloadSectionList(justStarted)
{
    
    justStarted = justStarted || false;
    
    if(justStarted)
    {
        $(sections).unbind();
    }
    
    sectionsContainer.html("");
    sections = $("section");
    
    $(sections).each(function(index, e){
        
        $(sectionsContainer).append(WrapInTabItemString($(e).attr("id"),$(e).attr("alt")));
        
        var target;
        
        if( (target = tabsTarget.indexOf($(e).attr("id"))) != -1)
        {
            
//            alert(target);
            var tmp = navigationalTabs[target];
            var label = $(tmp).children(".label").html()
            var target = $(tmp).attr("alt");
//            var id = $(tmp).attr("id");
            var id = $(tmp).attr("id");
            
            $(tabsContainer).append('<li id = "'+id+'" alt = '+target+' ><span class = "handle icon-remove" onclick = "removeNavBarItem($(this))"></span>'+label+'<span class = "handle icon-menu"></span></li>');
        }
        else
            $(tabsContainer).append('<li>&nbsp; <span onclick="addNavTab($(this).parent(),\''+$(e).attr("id")+'\')" class = "icon-plus"></span></li>');
        
    });
    
    InitializeTabsInteractions();
    
    var startingIndex, finalIndex;
    $(sectionsContainer).append('<li id = "addNew" onclick="addSection()">add</li>');
    $(sectionsContainer).sortable({
        items: "li:not(#addNew)",
        handle: ".handle",
        containment: sectionsContainer,
        axis:"y",
        start:function(event, ui){
            startingIndex = ui.placeholder.index();
        },
        change: function( event, ui ) {
//            $("title").html($(ui).placeholder.index() + "yeah");
            finalIndex = ui.placeholder.index();
//            ReorderSections(ui.placeholder.index());
//            alert(ui.draggable.index());
        },
        stop: function(event, ui){
            ReorderSections(startingIndex, finalIndex);
        }
    });
}

function addNavTab(self, target)
{   
    var newNavTab = GenerateSectionID();
    
    $(self).replaceWith('<li alt = '+newNavTab+' ><span class = "handle icon-remove" onclick = "removeNavBarItem('+target+')"></span>New Tab<span class = "handle icon-menu"></span></li>');
    
    $("#menu_item_container #searchBarContainer").before('<li class="menu_item"  id = \''+newNavTab+'\' alt = \''+target+'\' onclick = "scrollToSection(\''+target+'\')">\
        <div class = "label hovered">New Tab</div>\
        <div class = "label normal">New Tab</div>\
    </li>');
    
    ComputeNavBarCenter(true);
}

function ReorderSections(start, end)
{   
    start--;
    end--;
    if(start > end)
        end++;
    var toBeMoved = sections[start];
    var contents = $(toBeMoved).clone().wrap('<p>').parent().html();
    

    var str = "";
    $(sections).each(function(index,e){
        str += "," + $(e).attr("alt");
    });

    

    
    sections.splice(start, 1);
    
    
    
    
//    alert(contents);
    
    $(sections[end]).before(contents);
    $(toBeMoved).remove();
//        $(sections[end]).before(toBeMoved);
    
//    alert();
//    alert(current);
    ReloadTabsList();
    ReloadSectionList();
}

function removeNavBarItem(id)
{
    alert(id);
}

function hideSection(id)
{
    
//    alert(id);
}

function addSection()
{
    
    var sectionHTML = '<section id = "'+GenerateSectionID()+'" alt = "New Section" class = "separated">\
        <div class="tablizer">\
            <div class = "element inner text">\
                <div class = "element">Add Element Here</div>\
            </div>\
        </div>\
    </section>';
    
    $($("section")[sections.length-1]).after(sectionHTML);
    ReloadTabsList();
    ReloadSectionList();
    
}

function GenerateSectionID()
{
    var source = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    var length = 10;
    var id = "";
    for(var i =0 ; i < length; i++)
    {
        id += source[Math.floor((Math.random()*1000)%source.length)];
    }
    
    return id;
}


function scrollToSection(id)
{
    
    $(sections).each(function(index, e){
        
        if($(e).attr("id") == id)
        {
//            alert($(e).offset().top);
            $(container).animate({ scrollTop: $(container).scrollTop() + $(e).offset().top +  "px" });
//            alert();
        }

    });
    
}