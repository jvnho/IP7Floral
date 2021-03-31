
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
                res.render("catalogue.ejs", {articles: rows, });
            });
        } else //vendeur
        {
            res.render("seller.ejs");
        }
        
    } else {
        res.redirect('/login/');
    }
});

//ajout article au panier
server.post("/home/cart", function(req, res)
{
    pool.query('SELECT * FROM panier WHERE user_id = ? AND article_id = ?', [req.session.user_id ,req.body.article_id], function(err1,rows1, fields1)
    {
        if(err1) throw err1
        if(rows1.length == 0)
        {
            //insère une nouvelle valeur dans la table 
            pool.query("INSERT INTO panier (article_id, user_id) VALUES ("+req.body.article_id +","+req.session.user_id+")", function(err2, rows2, fields2)
            {
                if(err2) throw err2;
                res.status(200).end();
            });
        } else 
        {
            //augmente la quantite de l'article ajouter
            pool.query('UPDATE panier SET quantite = ? WHERE user_id = ? AND article_id = ?', [parseInt(rows1[0].quantite+1), req.session.user_id, req.body.article_id],function(err3, rows3, fields3)
            {
                if(err3) throw err3;
                res.status(200).end();
            });
        }
    });

});

//recherche d'articles selon prix
server.post("/home/search", function(req,res)
{
    pool.query('SELECT * FROM article WHERE prix > ? AND prix < ?', [req.body.min, req.body.max], function(err, rows, fields) 
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
        pool.query('SELECT * FROM panier WHERE user_id = ?', [req.session.user_id], function(err, rows, fields){
            res.render('cart.ejs', {panier : rows, username: req.session.username});
        });
    } else {
        res.redirect('/home/');
    }
});

//passer à la commande
server.post("/cart/buy", function(req,res)
{
    //verifier cote client que le pannier n'est pas vide
});

server.get("/cart/*", function(req,res)
{
    res.redirect("/cart/");
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