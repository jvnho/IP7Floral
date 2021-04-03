
$(document).ready(function(){
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
    var ref_command = commandes[i].commande_id;
    var status_command = commandes[i].status;
    $("#mainContainer").append
    (
        '<div class="commande" id="commandeSection'+i+'">'+
            '<p class="commande_ref">Référence commande: '+ref_command+'</p>'+
            (code == 1 ? '<p>ID Client: ' + commandes[i].user_id+'</p>':'')+
            '<p class="commande_date">Date de commande: ' + Date(Date.parse(commandes[i].date))+ '</p>'+
            '<p class="commande_status">Statut : '+status_command+'</p>'+
            ((code == 0 || status_command === 'Livré') ? '': 
            '<p class="commande_status">Mettre à jour le statut: </p>'+
            '<select name="orderStatus" id="statusList'+i+'">'+
                '<option value="abort" selected>Annulé</option>'+
                '<option value="attente" selected>En cours de traitement</option>'+
                '<option value="expedie">Expedié</option>'+
                '<option value="livre">Livré</option>'+
            '</select>'+
            '<button class ="updateStatusBtnClass" onclick="updateClientOrder('+i+')" >Mettre à jour la commande</button>'
            )
    );
    var commande_id = commandes[i].commande_id;
    $.post("/orders/", {commande_id : commande_id}, function(data)
    {
        var articleCommande = data.articles;
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

function updateClientOrder(index){
    var commande_id = commandes[index].commande_id;
    var new_status = $('#statusList'+index + ' option:selected').text();
    var query = "UPDATE commande SET status = '" + new_status + "' WHERE commande_id = " + commande_id;
    $.post("/orders/update", {query : query}, function(data){
        location.reload();
    });
}