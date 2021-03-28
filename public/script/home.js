$(document).ready(function()
{
    $(".buyBtn").hide();

    $(".article img").mouseover(function(){
        $(".buyBtn").show("slow");
    });

    $(".article img").mouseleave(function(){
        $(".buyBtn").hide("fast");
    });
});

