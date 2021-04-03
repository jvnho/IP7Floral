
const express = require('express');
const session = require('express-session');
const ejs = require("ejs");
const path = require("path");
const mysql = require('mysql');

//const bodyParser = require('body-parser')

const server = express();

server.set('view engine','ejs');
    
server.use(express.urlencoded({extended:false}));
server.use(session({secret: 'lalalala', saveUninitialized: true, resave: true}));

server.use("/", express.static(__dirname + '/views/'));
server.use("/", express.static(__dirname + '/public/'));

var pool = mysql.createPool(
{
    host: 'localhost',
    user: 'root',
    password: 'Nicola$32',
    database: 'ip7floral',
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
    var login = (req.body.login).trim(), password = req.body.password;        
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
            res.render('login.ejs', {message : "Mot de passe ou utilisateur inexistant"});
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
            pool.query('SELECT * FROM article', function(err, rows, fields) 
            {
                if (err) throw err;
                res.render("catalogue.ejs", {articles: rows, username: req.session.username, code : req.session.code});
            });
        } else //vendeur
        {
            res.redirect("/orders");
        }
        
    } else {
        res.redirect('/login/');
    }
});

//ajout article au panier
server.post("/home/cart", function(req, res)
{
    //premiere requete: récupère l'id de l'article à partir du nom depuis la requete avec JQuery
    pool.query('SELECT * FROM article WHERE name = ?', [req.body.article_name], function(err0,rows0, fields0)
    {
        if(err0) throw err0;
        var article_id = parseInt(rows0[0].article_id);
        //premiere requete: récupère l'id de l'article à partir du nom qu'on a récupéré
        pool.query('SELECT * FROM panier WHERE user_id = ? AND article_id = ?', [req.session.user_id , article_id], function(err1,rows1, fields1)
        {
            if(err1) throw err1
            if(rows1.length == 0)
            {
                //le panier ne contient pas cet article: insère une nouvelle valeur dans la table 
                pool.query("INSERT INTO panier (article_id, user_id) VALUES ("+article_id +","+req.session.user_id+")", function(err2, rows2, fields2)
                {
                    if(err2) throw err2;
                    res.status(200).end();
                });
            } else 
            {
                //le panier contient deja cet article: augmente la quantite de l'article ajouté
                pool.query('UPDATE panier SET quantite = ? WHERE user_id = ? AND article_id = ?', [parseInt(rows1[0].quantite+1), req.session.user_id, article_id],function(err3, rows3, fields3)
                {
                    if(err3) throw err3;
                    res.status(200).end();
                });
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
    if(req.session.initialized && req.session.code == 0)//utilisateur connecté et utilisateur client
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
//en deux étapes: supprime les tuples voulues et renvoie la table panier à l'utilisateur correspondant
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
//deux etapes similaire à la fonction précédente
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

//passer à la commande
server.post("/cart/order", function(req,res)
{
    var panier = JSON.parse(req.body.panier);
    var query = "INSERT INTO commande(user_id, total, date_command) VALUES("+ req.session.user_id+","+ req.body.total + ", CURRENT_TIME())";
    //créer un nouveau tuple dans la table commande
    pool.query(query, function(err, rows, fields)
    {
        if(err) throw err;
        //récupère l'id de cette dernière
        var query = "SELECT commande_id FROM commande ORDER BY commande_id DESC LIMIT 1";
        pool.query(query, function(err, rows, fields)
        {
            if(err) throw err;
            //ajout dans article_commande chaque article présent dans le panier du client
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
    if(req.session.initialized && req.session.code == 0)//utilisateur connecté et client
    {
        pool.query('SELECT * FROM commande WHERE user_id = ?', [req.session.user_id], function(err, rows, fields){
            if(err) throw err;
            res.render('orders.ejs', {commandes : rows, username: req.session.username, code : req.session.code});
        });
    } else if(req.session.initialized && req.session.code == 1)//utilisateur connecté et vendeur
    {
        pool.query("SELECT * FROM commande WHERE status <> 'Livré'", [req.session.user_id], function(err, rows, fields){
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