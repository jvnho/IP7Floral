
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

server.get("/home", function(req,res)
{
    if(req.session.initialized)
    {
        if(req.session.code == 0) //client
        { 
            pool.query('SELECT * FROM article', function(err, rows, fields) 
            {
                if (err) throw err;
                res.render("catalogue.ejs", {articles: rows, username: req.session.username});
            });
        } else //vendeur
        {
            res.render("seller.ejs");
        }
        
    } else {
        res.redirect('/login/');
    }
});

server.post("/home/cart", function(req, res)
{
    console.log("request from " + req.body.article_id + ' ' + req.body.username);
    var obj_res = {status : "ok"};
    res.status(200).send(JSON.stringify(obj_res));
});

server.get("/home/*", function(req,res)
{
    res.redirect('/home/');
});

server.get("/logout", function(req, res)
{
    req.session.destroy();
    res.redirect("/home");
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