
const express = require('express');
const session = require('express-session');
const ejs = require("ejs");
const path = require("path");
const mysql = require('mysql');
const md5 = require('md5');
const bodyParser = require('body-parser')

const server = express();

server.set('view engine','ejs');
    
server.use(express.urlencoded({extended:false}));
server.use(session({secret: 'lalalala', saveUninitialized: true, resave: true}));

server.use("/", express.static(__dirname + '/views/'));
server.use("/", express.static(__dirname + '/public/'));

var pool = mysql.createPool(
{
    host: 'localhost',
    user: '',
    password: '',
    database: 'pw6sangsiri',
    connectionLimit : 10
});
    
//page de login
server.get("/login", function(req,res)
{
    if(req.session.initialized)
    {
        res.redirect("/home/");
    } else {
        res.render('login.ejs');
    }
});

//traitement du formulaire de login
server.post("/login", function(req,res)
{
    var login = (req.body.login).trim(), password = md5(req.body.password);        
    pool.query('SELECT * FROM utilisateur WHERE username = ? AND password = ?', [login, password], function(err, rows, fields) 
    {
        if (err) throw err;
        if(rows.length > 0)
        {
            req.session.initialized = true;
            req.session.username = rows[0].username;
            req.session.user_id = parseInt(rows[0].user_id);
            req.session.code = parseInt(rows[0].code, 10);
            res.redirect("/home/");
        } else 
        {
            res.render('login.ejs', {message : "Mot de passe ou utilisateur inexistant", loginEntered : login});
        }
    });
});

server.get("/login/*", function(req,res)
{
    res.redirect('/login/');
});

//page d'achat
server.get("/home", function(req,res)
{
    if(req.session.initialized)
    {
        if(req.session.code == 0) //client
        { 
            pool.query("SELECT * FROM article WHERE type ='bouquet'", function(err, rows, fields) 
            {
                if (err) throw err;
                res.render("catalogue.ejs", {articles: rows, username: req.session.username, code : req.session.code});
            });
        } else //vendeur
        {
            res.redirect("/orders/");
        }
        
    } else {
        res.redirect('/login/');
    }
});

//permet de changer la vue entre bouquets et bouquets personnalis??s
server.post("/home/swap", function(req,res)
{
    pool.query('SELECT * FROM article WHERE type = ?', [req.body.type], function(err, rows, fields) 
    {
        if(err) throw err
        res.send({new_articles : rows});
    });
});

//ajout article au panier
//invariant: on consid??re que si le serveur recoit une quantite d'article alors il s'agit d'article pour le bouquet personnalis??
server.post("/home/cart", function(req, res)
{
    //premiere requete: r??cup??re l'id de l'article ?? partir du nom depuis la requete avec JQuery
    pool.query('SELECT * FROM article WHERE name = ?', [req.body.article_name], function(err0,rows0, fields0)
    {
        if(err0) throw err0;
        var article_id = parseInt(rows0[0].article_id);
        //deuxieme requete: r??cup??re le panier de l'utilisateur et regarde si l'article n'est pas d??j?? pr??sent
        pool.query('SELECT * FROM panier WHERE user_id = ? AND article_id = ?', [req.session.user_id , article_id], function(err1,panier, fields1)
        {
            if(err1) throw err1
            if(typeof req.body.article_quantity === 'undefined')//cas bouquet pre-d??finis
            {
                if(panier.length == 0)
                {
                    //le panier ne contient pas cet article: ins??re une nouvelle valeur dans la table 
                    pool.query("INSERT INTO panier (article_id, user_id) VALUES ("+article_id +","+req.session.user_id+")", function(err2, rows2, fields2)
                    {
                        if(err2) throw err2;
                        res.status(200).end();
                    });
                } else 
                {
                    //le panier contient deja cet article: augmente la quantite de l'article ajout??
                    pool.query('UPDATE panier SET quantite = ? WHERE user_id = ? AND article_id = ?', [panier[0].quantite+1, req.session.user_id, article_id],function(err3, rows3, fields3)
                    {
                        if(err3) throw err3;
                        res.status(200).end();
                    });
                }
            } else //cas bouquet personnalis??
            {
                if(panier.length == 0)
                {
                    //le panier ne contient pas cet article: ins??re une nouvelle valeur dans la table avec la quantit??
                    pool.query("INSERT INTO panier (article_id, user_id, quantite) VALUES ("+article_id +","+req.session.user_id+","+parseInt(req.body.article_quantity)+")", function(err2, rows2, fields2)
                    {
                        if(err2) throw err2;
                        res.status(200).end();
                    });
                } else { //panier contient l'article on augmente la quantit??
                    var new_quantity = panier[0].quantite + parseInt(req.body.article_quantity);
                    pool.query("UPDATE panier SET quantite = ? WHERE user_id = ? AND article_id = ?", [new_quantity, req.session.user_id, article_id],function(err2, rows2, fields2)
                    {
                        if(err2) throw err2;
                        res.status(200).end();
                    });
                }
            }
        });
    });
});

//recherche d'articles selon prix
server.post("/home/search", function(req,res)
{
    pool.query('SELECT * FROM article WHERE price > ? AND price < ?', [req.body.min, req.body.max], function(err, rows, fields) 
    {
        if(err) throw err
        res.send({new_articles : rows});
    });
});

server.get("/home/*", function(req,res)
{
    res.redirect('/home/');
});

//page du panier utilisateur
server.get("/cart", function(req,res)
{
    if(req.session.initialized && req.session.code == 0)//utilisateur connect?? et utilisateur client
    {
        pool.query('SELECT * FROM panier AS p, article AS a WHERE p.user_id = ? AND a.article_id = p.article_id', [req.session.user_id], function(err, rows, fields){
            if(err) throw err;
            res.render('cart.ejs', {panier : rows, username: req.session.username, code : req.session.code});
        });
    } else {
        res.redirect('/home/');
    }
});

//requete: client qui enleve un article depuis son panier
//en deux ??tapes: supprime les tuples voulues et renvoie la table panier ?? l'utilisateur correspondant
server.post("/cart/remove", function(req,res)
{
    pool.query('DELETE FROM panier WHERE user_id = ? AND article_id = ?', [req.session.user_id, req.body.article_id], function(err,rows,fields)
    {
        if(err) throw err;
        pool.query('SELECT * FROM panier AS p, article AS a WHERE p.user_id = ? AND a.article_id = p.article_id', [req.session.user_id], function(err, rows, fields)
        {
            if(err) throw err;
            res.send({new_panier : rows, username: req.session.username, code : req.session.code});
        });
    });
});

//requete client qui change la quantite d'un de ses articles de son panier
//deux etapes similaire ?? la fonction pr??c??dente
server.post("/cart/update", function(req,res)
{
    pool.query('UPDATE panier SET quantite = ? WHERE user_id = ? AND article_id = ?', [req.body.new_quantite, req.session.user_id, req.body.article_id], function(err,rows,fields)
    {
        if(err) throw err;
        pool.query('SELECT * FROM panier AS p, article AS a WHERE p.user_id = ? AND a.article_id = p.article_id', [req.session.user_id], function(err, rows, fields)
        {
            if(err) throw err;
            res.send({new_panier : rows, username: req.session.username, code : req.session.code});
        });
    });
});

//passer ?? la commande
server.post("/cart/order", function(req,res)
{
    var panier = JSON.parse(req.body.panier);
    var query = "INSERT INTO commande(user_id, total, date_command) VALUES("+ req.session.user_id+","+ req.body.total + ", CURDATE())";
    //cr??er un nouveau tuple dans la table commande
    pool.query(query, function(err, rows, fields)
    {
        if(err) throw err;
        //r??cup??re l'id de cette derni??re
        var query = "SELECT commande_id FROM commande ORDER BY commande_id DESC LIMIT 1";
        pool.query(query, function(err, rows, fields)
        {
            if(err) throw err;
            //ajout dans article_commande chaque article pr??sent dans le panier du client
            var commande_id = rows[0].commande_id;
            var i, query;
            for(i = 0; i < panier.length; i++)
            {
                query = "INSERT INTO article_commande(commande_id, article_id, quantite) VALUES ("+commande_id+","+panier[i].article_id+","+panier[i].quantite+")";
                pool.query(query,function(err, rows, fields)
                {
                    if(err) throw err;
                });
            }
            //vide la panier courant du client
            pool.query('DELETE FROM panier WHERE user_id = ?', [req.session.user_id],function(err, rows, fields)
            {
                if(err) throw err;
                res.send("/orders/");
            });
        });
    });
});

server.get("/cart/*", function(req,res)
{
    res.redirect("/cart/");
});

server.get("/orders", function(req,res)
{
    if(req.session.initialized && req.session.code == 0)//utilisateur connect?? et client
    {
        pool.query('SELECT * FROM commande WHERE user_id = ? ORDER BY date_command DESC', [req.session.user_id], function(err, rows, fields){
            if(err) throw err;
            res.render('orders.ejs', {commandes : rows, username: req.session.username, code : req.session.code});
        });
    } else if(req.session.initialized && req.session.code == 1)//utilisateur connect?? et vendeur
    {
        pool.query("SELECT * FROM commande WHERE status <> 'Livr??e' AND status <> 'Annul??e' ORDER BY date_command", [req.session.user_id], function(err, rows, fields){
            if(err) throw err;
            res.render('orders.ejs', {commandes : rows, username: req.session.username, code : req.session.code});
        });
    }
    else {
        res.redirect('/home/');
    }
});

server.post("/orders", function(req,res){
    pool.query('SELECT * FROM article_commande ac, article art WHERE ac.commande_id = ? AND ac.article_id = art.article_id', [req.body.commande_id], function(err, rows, fields)
    {
        if(err) throw err;
        res.send({articles : rows});
    });
});

server.post("/orders/update", function(req,res){
    pool.query(req.body.query, function(err, rows, fields)
    {
        if(err) throw err;
        res.sendStatus(200);
    });
});

server.get("/orders/*", function(req,res){
    res.redirect("/orders/")
});

server.get("/logout", function(req, res)
{
    req.session.destroy();
    res.redirect("/home/");
});

server.get("/", function(req, res)
{
    if(req.session.initialized)
    {
        res.redirect('home/');
    } else {
        res.redirect('login/');
    }
});

server.get("*", function(req, res)
{
    if(req.session.initialized)
    {
        res.redirect('home/');
    } else {
        res.redirect('login/');
    }
});

server.listen(8080);