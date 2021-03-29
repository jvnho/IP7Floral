$(document).ready(function()
{    
    createImageGalery();

    buyButtonHandler();
});

function createImageGalery(){
    $("#gallery").append(function()
    {
        var i;
        for(i =0; i < articles.length; i++){
            addImageToGalery(i);
        }
    });
}

function addImageToGalery(i){
    $('#gallery').append(
        '<div class="article"><img id="bouquet' + i 
        +'" src="../'+ articles[i].location +'" alt="bouquet' + i 
        +'"> <button id="buyBtn' + i +'" class="buyBtn" id >Acheter</button></div>');
    $(".buyBtn").hide();  
}

function buyButtonHandler(){
    var btnIndex;

    $('#gallery').on('mouseover', 'div', function() {
        btnIndex = $(this).index();
        $('#buyBtn'+btnIndex).fadeIn();
    });

    $('#gallery').on('mouseleave', 'div', function() {
        index = $(this).index();
        $('#buyBtn'+index).fadeOut(100);
    });

    $('#gallery').on('click', '.buyBtn', function() {
        $.post('/home/cart', {article_id : articles[btnIndex].article_id, username : username}, function(data){
            //callback: changera le panier
            console.log(data);
        });
        console.log("post send: " + articles[btnIndex].article_id + " " +  username);
    });
}