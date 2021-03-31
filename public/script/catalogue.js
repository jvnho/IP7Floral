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
        $.post('/home/cart', {article_id : articles[btnIndex].article_id}, function(data){
            //callback: changera le panier
            console.log("receive : " + data);
        });
        console.log("post send: " + articles[btnIndex].article_id + " " + articles[btnIndex].prix);
    });
}

function initPriceSlider()
{
    var maxPrice = articles[0].prix;
    var i;
    for(i = 1; i < articles.length; i++){
        if(maxPrice < articles[i].prix){
            maxPrice = articles[i].prix;
        }
    }
    var maxPrice = Math.ceil(articles[0].prix);
    $("#priceSlider").attr("max", maxPrice);
    $("#priceSlider").attr("value", maxPrice);
}