var valeurTotalPanier = 0.0;

$(document).ready(function()
{    
    console.log(panier);
    initPanier(panier);
});

function initPanier(panier){
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
            '<button class="articleBtn">-</button>'+
            '<button class="articleBtn">+</button>'+
            '<button class="articleBtn">Supprimer du panier</button>'+
        '</div>'
    );
    valeurTotalPanier += parseFloat(sousTotal);
}

function orderCommand(){
    $("#orderBtn").click(function()
    {

    });
}