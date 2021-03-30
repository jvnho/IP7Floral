$(document).ready(function()
{    
    buyButtonHandler();
    initPriceSlider();
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
        $.post('/home/cart', {article_id : articles[btnIndex].article_id, username : username}, function(data){
            //callback: changera le panier
            console.log(data);
        });
        console.log("post send: " + articles[btnIndex].article_id + " " +  username);
    });
}

function initPriceSlider()
{
    var maxPrice = articles[0].prix;
    var i;
    for(i = 1; i < articles.length; i++){
        if(maxPrice < articles[i].price){
            maxPrice = articles[i].price;
        }
    }
    var maxPrice = Math.ceil(articles[0].prix);
    $("#priceSlider").attr("max", maxPrice);
    $("#priceSlider").attr("value", maxPrice);
}