var maxPrice = articles[0].price; //prix de l'article le plus élevé présent sur la page

var showCustom = false; //true = montrer la section pour les bouquets personnalisables, par défaut on montre la collection du site

$(document).ready(function()
{    
    createGallery(articles);        
    buyButtonHandler();
    initPriceInput();
    priceInputHandler();
    quantityChangeHandler();
    searchPriceBtn();
    $("#collection").prop('disabled', true);
    $("#customMessage").hide();
    $("#orderCustom").hide();
    $("#prixCustom").hide();
});

function createGallery(array){
    if(array.length > 0)
    {
        var i;
        for(i = 0; i < array.length; i++){
            createImageGallery(array, i);
        }
    } else 
    {
        $("body").append
        ('<h1 class="emptyStore">Aucun article trouvé</h1>');
    }
}   

function createImageGallery(array, i){
    $("#gallery").append
    (
        (showCustom == false ?
        '<div class="article">' +
            '<img id="bouquet'+i+'" src="../'+array[i].location + '" alt="bouquet'+i+'">'+ 
            '<p class="item_name">'+array[i].name+'</p>'+
            '<p class="item_price">'+(array[i].price).toFixed(2)+'€'+'</p>'+
            '<button id="'+array[i].name+'" class="buyBtn">Ajouter au panier</button>'+
        '</div>'
        : 
        '<div class="article">' +
            '<img class ="singleFlower" id="fleur'+i+'" src="../'+array[i].location + '" alt="fleur'+i+'">'+ 
            '<p class="item_name">'+array[i].name+'</p>'+
            '<p class="item_price"><span class="numericPrice">'+(array[i].price).toFixed(2)+'</span>€'+'</p>'+
            '<input type="number" class="quantitySelector" min="0" max="10" value="0"></input>'+
        '</div>'
        )
    );
}

function showCustomBtn(){
    if(showCustom == false)
    {
        showCustom = true;
        $("#perso").prop('disabled', true);
        $("#collection").prop('disabled', false);
        swapGallery();
    }
}

function showCollectionBtn(){
    if(showCustom == true)
    {
        showCustom = false;
        $("#collection").prop('disabled', true);
        $("#perso").prop('disabled', false);
        swapGallery();
    }
}

function swapGallery(){
    var type = "";
    if(showCustom == true){
        type = "fleur";
    } else {
        type = "bouquet";
    }
    $.post("/home/swap", {type : type}, function(data)
    {
        $("#gallery").empty();
        if(showCustom == true){
            $("#prixCustom").show();
            $("#customMessage").show();
            $("#orderCustom").show();
            $("#priceRange").hide();
        } else {
            $("#prixCustom").hide();
            $("#customMessage").hide();
            $("#orderCustom").hide();
            $("#priceRange").show();
        }
        createGallery(data.new_articles);
    });
}

function quantityChangeHandler(){
    $('#gallery').on('change', '.quantitySelector', function() 
    {
        $(this).attr('value', $(this).val());   
        var customTotalPrice = 0.0;
        $(".article").each(function(){
            var item_price = parseFloat($(this).children('p.item_price').children("span.numericPrice").text());
            var item_quantity = parseInt($(this).children(".quantitySelector").val());
            if(item_quantity > 0){
                customTotalPrice = customTotalPrice + (item_price*item_quantity);
            } 
        });
        $("#realPrice").html(customTotalPrice.toFixed(2));
    });
}

//constituion d'un bouquet personnalisé
function buyCustomFlower(){
    var articleNumber = $("#gallery").children().length;
    //on regarde là ou la quantité de fleur est supérieure à 1 afin de composer le bouquet perso et le mettre dans la panier
    $(".article").each(function(){
        var art_quantity = parseInt($(this).children(".quantitySelector").val());
        if(art_quantity > 0)
        {
            var art_name = $(this).children(".item_name").text();
            $.post("/home/cart", {article_name : art_name, article_quantity : art_quantity }, function(req, res){
                $("#notification").children("p").html("Article ajouté au panier");
                $("#notification").css('background-color', 'green');
                $("#notification").show().delay(1000).fadeOut();
            });
        }
    })
}

//bouquet non personnalisé, bouquet de "collection"
function buyButtonHandler(){
    $('#gallery').on('click', '.buyBtn', function() {
        $.post('/home/cart', {article_name : $(this).attr('id')}, function(data)
        {
            $("#notification").children("p").html("Article ajouté au panier");
            $("#notification").css('background-color', 'green');
            $("#notification").show().delay(1000).fadeOut();
        });
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