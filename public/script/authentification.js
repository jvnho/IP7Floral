$(document).ready(function()
{
    submitFormHandler();
});

function submitFormHandler(){
    $("#logForm").submit(function()
    {
        if($("#login").val() === "" || $("#password").val() === "")
        {
            $("#notification").children("p").html("Veillez remplir tous les champs");
            $("#notification").css('background-color', 'red');
            $("#notification").show().delay(5000).fadeOut();
            $("#login").css("border", "red solid 1px"); 
            $("#password").css("border", "red solid 1px"); 
            if($("#login").val() !== "") $("#login").css("border", "green solid 1px"); 
            if($("#password").val() !== "") $("#password").css("border", "green solid 1px"); 
            return false;
        }
        return true;
    });
}