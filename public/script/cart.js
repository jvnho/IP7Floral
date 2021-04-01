var valeurTotalPanier;

$(document).ready(function()
{    
    initPanier(panier);
});

function initPanier(panier){
    valeurTotalPanier = 0.0;
    if(panier.length == 0) 
    { 
        $("#mainContainer").append(
            '<h1 class="emptyCart">Votre panier est vide.</h1>'+
            '<h2 class="emptyCart">Ajoutez des articles depuis la rubrique Notre Catalogue</h2>'
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
            '<button id="orderBtn">Commander</button>'
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
            '<p class="article_soustotal">Sous-Total: '+sousTotal+'€</p>'+
            '<button class="articleDecBtn" onclick="decreaseBtnHandler(this,'+panier[i].article_id+')">-</button>'+
            '<button class="articleIncBtn" onclick="increaseBtnHandler(this,'+panier[i].article_id+')">+</button>'+
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
function decreaseBtnHandler(btn_clicked, article_id){
    $(btn_clicked).siblings('.article_quantity').html("666");
    $.post("cart/decrease", {article_id : article_id}, function(data){
        //update le sous total et la quantite de l'article
    });
}

function increaseBtnHandler(btn_clicked, article_id){
    $(btn_clicked).siblings('.article_quantity').html("666");
    $.post("cart/increase", {article_id : article_id}, function(data){
        //update le sous total et la quantite de l'article
    });
}

function deleteBtnHandler(btn_clicked, article_id){
    $.post("cart/remove", {article_id : article_id}, function(data){
        //update le contenu de la page avec un pseudo-refresh (empty + recreation des divs)
        $("#mainContainer").empty();
        initPanier(data.new_panier);
    });
}

function orderCommand(){
    $("#orderBtn").click(function()
    {

    });
}