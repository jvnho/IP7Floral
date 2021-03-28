
const express = require('express');
const session = require('express-session');
const ejs = require("ejs");
const path = require("path");
//const bodyParser = require('body-parser')

const server = express();

server.set('view engine','ejs');
    
server.use(express.urlencoded({extended:false}));
server.use(session({secret: 'lalalala', saveUninitialized: true, resave: true}));

server.use("/", express.static(__dirname + '/views/'));
server.use("/", express.static(__dirname + '/public/'));

const database = require('./database');

server.post("/login", function(req,res)
{
    var login = (req.body.login).trim(), password = req.body.password;
    database.query('SELECT * FROM utilisateur WHERE username = ? AND password = ?', [login, password], function(err, rows, fields) 
    {
        if (err) throw err;
        if(rows.length > 0)
        {
            req.session.initialized = true;
            req.session.username = login;
            database.query('SELECT code FROM utilisateur WHERE username = ?', [login], function(err, rows, fields) 
            {
                req.session.code = parseInt(rows[0].code, 10);
                res.redirect("/home/");
            });
            database.end();
            if (err) throw err;
        } else 
        {
            database.end();
            res.render('login.ejs', {message : "Mot de passe ou utilisateur inexistant"});
        }
    });
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

server.get("/home", function(req,res)
{
    if(req.session.initialized)
    {
        if(req.session.code == 0) //client
        {
            res.render("client.ejs");
        } else //vendeur
        {
            res.render("seller.ejs");
        }
        
    } else {
        res.redirect('/login/');
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