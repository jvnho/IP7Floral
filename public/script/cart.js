//server-client synchronisé: page totalement dynamisé

var valeurTotalPanier;

$(document).ready(function()
{    
    initPanier(panier);
});

function initPanier(panier){
    valeurTotalPanier = 0.0;
    if(panier.length == 0) 
    { 
        $("body").append(
            '<div id="msgContainer">'+
                '<h1 class="emptyCart">Votre panier est vide.</h1>'+
                '<h2 class="emptyCart">Ajoutez des articles depuis la rubrique <span id="ourStore">Notre Catalogue</span></h2>'+
            '</div>'
        );
    } else {
        var i;
        for(i = 0; i < panier.length; i++)
        {
            createArticleDiv(i,panier);
        }
        valeurTotalPanier = valeurTotalPanier.toPrecision(4);
        $("#mainContainer").append(
            '<p id="totalText">Total: ' + valeurTotalPanier + '€</p>'+
            '<button id="orderBtn" onclick="orderCommandBtn()">Passer à la commande</button>'
        );
    }
}

function createArticleDiv(i,panier){
    var src = panier[i].location;
    var nom = panier[i].name;
    var prix = (panier[i].price).toFixed(2);
    var quantite = panier[i].quantite;
    var sousTotal = (parseFloat(prix) * parseFloat(quantite)).toFixed(2);
    $("#mainContainer").append(
        '<div class="article">'+
            '<img src="../'+ src+'" alt="bouquet'+i+'">'+
            '<p class="article_name">Nom de l\'article: '+nom+'</p>'+
            '<p class="article_priceUnit">Prix unitaire: '+prix+'€</p>'+
            '<p class="article_quantity">Quantité: '+quantite+'</p>'+
            '<p class="article_sousTotal">Sous-Total: '+sousTotal+'€</p>'+
            '<button class="articleDecBtn" onclick="decreaseBtnHandler(this,'+panier[i].article_id+','+quantite+','+i+')">-</button>'+
            '<button class="articleIncBtn" onclick="increaseBtnHandler(this,'+panier[i].article_id+','+quantite+','+i+')">+</button>'+
            '<button class="articleDelBtn" onclick="deleteBtnHandler(this,'+panier[i].article_id+')">Supprimer du panier</button>'+
        '</div>'
    );
    initButtons($(".article").last(), quantite);
    valeurTotalPanier += parseFloat(sousTotal);
}

function initButtons(article_container, article_quantity){
    if(article_quantity <=1 )
    {
        $(article_container).children('button.articleDecBtn').prop('disabled','true');
    }
}

//aide externe: https://stackoverflow.com/questions/7463242/how-do-i-select-a-sibling-element-using-jquery
//à propos de la fonction "siblings" de JQuery

//invariant: on peut diminuer la quantité ssi la quantité est >= à 2
function decreaseBtnHandler(btn_clicked, article_id, article_quantity, index){
    $.post("/cart/update", {article_id : article_id, new_quantite : (article_quantity-1)}, function(data)
    {
        var price = data.new_panier[index].price;
        var sousTotal = (price * ((article_quantity)-1)).toFixed(2);

        $(btn_clicked).siblings('p.article_quantity').html("Quantité: " + (article_quantity-1));
        $(btn_clicked).siblings('p.article_sousTotal').html("Sous-Total: " + sousTotal+'€');

        valeurTotalPanier =  (parseFloat(valeurTotalPanier) - price).toFixed(2);
        $("#totalText").html("Total: " + valeurTotalPanier + "€");

        $(btn_clicked).attr('onclick','decreaseBtnHandler(this,'+article_id+','+(article_quantity-1)+','+index+')');
        $(btn_clicked).siblings(".articleIncBtn").attr('onclick','increaseBtnHandler(this,'+article_id+','+(article_quantity-1)+','+index+')');

        panier[index].quantite = (panier[index].quantite)-1;

        if(article_quantity-1 <= 1)//respect de l'invariant
        {
            $(btn_clicked).prop('disabled', true);
        }
    });
}

function increaseBtnHandler(btn_clicked, article_id, article_quantity, index){
    $.post("/cart/update", {article_id : article_id, new_quantite : (article_quantity+1)}, function(data)
    {
        var price = data.new_panier[index].price;
        var sousTotal = (price * ((article_quantity)+1)).toFixed(2);

        $(btn_clicked).siblings('p.article_quantity').html("Quantité: " + (article_quantity+1));
        $(btn_clicked).siblings('p.article_sousTotal').html("Sous-Total: " + sousTotal+'€');

        valeurTotalPanier =  (parseFloat(valeurTotalPanier) + price).toFixed(2);
        $("#totalText").html("Total: " + valeurTotalPanier+ "€");

        $(btn_clicked).attr('onclick','increaseBtnHandler(this' + ', '+article_id+','+(article_quantity+1)+','+index+')');
        $(btn_clicked).siblings(".articleDecBtn").attr('onclick','decreaseBtnHandler(this,'+article_id+','+(article_quantity+1)+','+index+')');

        panier[index].quantite = (panier[index].quantite)+1;

        $(btn_clicked).siblings(".articleDecBtn").prop('disabled', false);
    });
}

function deleteBtnHandler(btn_clicked, article_id){
    $.post("/cart/remove", {article_id : article_id}, function(data)
    {
        $("#notification").children("p").html("Article supprimé du panier");
        $("#notification").css('background-color', 'red');
        $("#notification").show().delay(3000).fadeOut();
        $("#mainContainer").empty();
        initPanier(data.new_panier);
    });
}

function orderCommandBtn(){
    $.post("/cart/order", {panier: JSON.stringify(panier), total : valeurTotalPanier}, function(data){
        window.location.replace(data);
    });
}