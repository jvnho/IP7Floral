
$(document).ready(function(){
    console.log(commandes);
    initOrderSummary();
});

function initOrderSummary(){
    if(commandes.length > 0)
    {
        var i;
        for(i = 0; i < commandes.length; i++){
            createOrderDiv(i);
        }
    } else {
        $("#mainContainer").append(
            '<h1 class="emptyCart">Votre n\'avez passé aucune commande sur notre site.</h1>'+
            '<h2 class="emptyCart">Visitez notre boutique via la rubrique Notre catalogue</h2>'
        );
    }
}


//source pour le Date.parse: https://stackoverflow.com/questions/27869606/remove-time-from-gmt-time-format
function createOrderDiv(i){
    $("#mainContainer").append(
        '<div class="commande" id="commandeSection'+i+'">'+
            '<p class="commande_ref">Référence commande: '+commandes[i].commande_id+'</p>'+
            '<p class="commande_date">Date de commande: ' + Date(Date.parse(commandes[i].date))+ '</p>'+
            '<p class="commande_status">Statut : '+commandes[i].status+'</p>'
        );
    var commande_id = commandes[i].commande_id;
    $.post("/orders/", {commande_id : commande_id}, function(data)
    {
        var articleCommande = data.articles;
        console.log(articleCommande);
        var y;
        for(y = 0; y < articleCommande.length; y++)
        {
            $("#commandeSection"+i).append(
                '<div class="article">'+
                    '<div class="imgContainer">'+
                        '<img src="../'+ articleCommande[y].location+'" alt="article'+y+'">'+
                    '</div>'+
                    '<div class="infoContainer">'+
                        '<p class="article_name">Nom : '+articleCommande[y].name+'</p>'+
                        '<p class="article_quantite">Quantité: '+articleCommande[y].quantite+'</p>'+
                    '</div>'+
                '</div>'
            );
        }
        $("#commandeSection"+i).append('<hr></hr><p>Total(TTC): '+ (commandes[i].total).toFixed(2)+'€</p></div>');
    });
}