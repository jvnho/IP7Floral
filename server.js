
const express = require('express');
const session = require('express-session');
const ejs = require("ejs");
const path = require("path");
//const bodyParser = require('body-parser')
const mysql = require('mysql');

const server = express();
server.set('view engine','ejs');
server.use(express.urlencoded({extended:false}));
server.use(session({secret: 'lalalala', saveUninitialized: false, resave: false}));
server.use("/", express.static(__dirname + '/views/'));
server.use("/", express.static(__dirname + '/public/'));

server.post("/login", function(req,res)
{
    var login = req.body.login, password = req.body.password;
    const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "Nicola$32",
        database: "ip7floral"
    });
    db.connect();
    db.query('SELECT * FROM utilisateur WHERE username = ? AND password = ?', [login, password], function(err, rows, fields) 
    {
        if (err) throw err;
        if(rows.length > 0)
        {
            req.session.loggedIn = true;
            req.session.username = login;
            //req.session.mode
            res.redirect("/home/");
        } else 
        {
            res.render('login.ejs', {message : "Mot de passe ou utilisateur inexistant"});
        }
    });
});

server.get("/login", function(req,res)
{
    if(req.session.loggedIn)
    {
        res.render("//home/");
    } else {
        res.render('login.ejs');
    }
});

server.get("/home", function(req,res)
{
    if(req.session.loggedIn)
    {
        res.render("home.ejs");
    } else {
        res.redirect('login/');
    }
});

server.get("/", function(req, res)
{
    if(req.session.loggedIn)
    {
        res.render('home/');
    } else {
        res.redirect('login/');
    }
});

server.listen(8080);