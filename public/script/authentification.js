$(document).ready(function()
{
    $("#errorMessage").html(errorMessage);

    $("#logForm").submit(function()
    {
        if($("#login").val() === "" || $("#password").val() === "")
        {
            errorMessage = "Veillez remplir tous les champs";
            $("#errorMessage").html(errorMessage);
            $("#login").css("border", "red solid 1px"); 
            $("#password").css("border", "red solid 1px"); 
            if($("#login").val() !== "") $("#login").css("border", "green solid 1px"); 
            if($("#password").val() !== "") $("#password").css("border", "green solid 1px"); 
            return false;
        }
        return true;
    });
});