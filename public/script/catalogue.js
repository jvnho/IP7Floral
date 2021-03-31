var maxPrice = articles[0].price; //prix de l'article le plus élevé présent sur la page

$(document).ready(function()
{    
    createGallery(articles);        
    buyButtonHandler();
    initPriceInput();
    priceInputHandler();
    searchPriceBtn();
});

function createGallery(array){
    var i;
    for(i = 0; i < array.length; i++){
        createImageGallery(array, i);
    }
}   

function createImageGallery(array, i){
    $("#gallery").append
    (
        '<div class="article"><img id="bouquet' + i + '" src="../' + array[i].location + '"alt="bouquet' + i
        + '"><p class="item_name">' + array[i].name + '</p><p class="item_price">' + (array[i].price).toFixed(2) + '€</p><button id="buyBtn' + i
        + '" class="buyBtn" id >Ajouter au panier</button></div>'
    );
}

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
        console.log("post send: " + articles[btnIndex].article_id + " " + articles[btnIndex].price);
    });
}

function initPriceInput()
{
    var i;
    for(i = 1; i < articles.length; i++){
        if(maxPrice < articles[i].price){
            maxPrice = articles[i].price;
        }
    }
    maxPrice = Math.ceil(articles[0].price);
    $("#priceMaxInput").attr("value", maxPrice);
}

function priceInputHandler()
{
    $('#priceMaxInput,#priceMinInput').change(function()
    {
        $(this).attr('value', $(this).val());   
    });
}

function searchPriceBtn()
{
    $('#priceSearchButton').click(function()
    {
        if($.isNumeric($("#priceMinInput, #priceMaxInput").attr("value")))
        {
            $.post("/home/search", {min: $("#priceMinInput").attr("value"), max: $("#priceMaxInput").attr("value")}, function(data)
            {
                $("#gallery").empty();
                createGallery(data.new_articles);
            });
        }
    });
}