var sectionsContainer = $("#editPanel #editPanelContent #overflow #sectionsManager #tabsSections> #sections");
var sections = $("section");

function LoadSectionsManager()
{
    
    
    sectionsContainer.html("");

    
    

    $(sections).each(function(index, e){
        
//        alert($(e).html());
        
        var info = $(e).attr("id").split("[::]");
        $(sectionsContainer).append(WrapInTabItemString(info[0],info[1]));
    });
    
    $(sectionsContainer).append('<li id = "addNew">add</li>');
}

function WrapInTabItemString(id, name)
{
    return '<li>\
    <span class = "handle icon-menu"></span>'+name+'\
    <span class = "icon-search" onclick = "scrollToSection('+id+')">\
    <span class = "icon-eye-close" onclick = "previewSection('+id+')"></span>\
    <span class = "icon-remove" onclick = "deleteSection('+id+')"></span></li>';
}

function scrollToSection(id)
{
    $()
}