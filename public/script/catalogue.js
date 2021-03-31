$(document).ready(function()
{    
    buyButtonHandler();
    initPriceInput();
    priceInputHandler();
    searchPriceBtn();
});

function buyButtonHandler(){
    var btnIndex;

    $('#gallery').on('mouseover', 'div', function() {
        btnIndex = $(this).index();
    });

    $('#gallery').on('mouseleave', 'div', function() {
        btnIndex = $(this).index();
    });

    $('#gallery').on('click', '.buyBtn', function() {
        $.post('/home/cart', {article_id : articles[btnIndex].article_id}, function(data){
            //callback: affichera une notification
            console.log("receive : " + data);
        });
        console.log("post send: " + articles[btnIndex].article_id + " " + articles[btnIndex].prix);
    });
}

function initPriceInput()
{
    var maxPrice = articles[0].prix;
    var i;
    for(i = 1; i < articles.length; i++){
        if(maxPrice < articles[i].prix){
            maxPrice = articles[i].prix;
        }
    }
    var maxPrice = Math.ceil(articles[0].prix);
    $("#priceMaxInput").attr("value", maxPrice + "€");
    $("#priceMax").html(maxPrice + "€");
}

function priceInputHandler()
{
    $('#priceMaxInput #priceMinInput').change(function()
    {

    });
}

function searchPriceBtn()
{
    $('#priceSearchButton').click(function()
    {
        $.post("/home/search", {min: $("#priceMaxInput").attr("value"), max: $("#priceMinInput").attr("value")}, function(data)
        {
            //callback
        });
    });
}