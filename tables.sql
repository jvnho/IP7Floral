DROP DATABASE IF EXISTS ip7floral;

CREATE DATABASE ip7floral;

USE ip7floral;

DROP TABLE IF EXISTS utilisateur;
DROP TABLE IF EXISTS article;
DROP TABLE IF EXISTS panier;
DROP TABLE IF EXISTS commande;
DROP TABLE IF EXISTS article_commande;

CREATE TABLE utilisateur(
    user_id INT AUTO_INCREMENT NOT NULL,
    username VARCHAR(15) NOT NULL,
    password VARCHAR(25) NOT NULL,
    code INT(1) DEFAULT 0,
    PRIMARY KEY(user_id),
    UNIQUE(username)
);

CREATE TABLE article(
    article_id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(256) NOT NULL,
    location VARCHAR(256) NOT NULL,
    type ENUM('bouquet', 'fleur') NOT NULL,
    price REAL NOT NULL, 
    PRIMARY KEY(article_id),
    UNIQUE(location)
);

CREATE TABLE panier(
    user_id INT NOT NULL,
    article_id INT NOT NULL,
    quantite INT DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES utilisateur(user_id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES article(article_id) ON DELETE CASCADE
);

CREATE TABLE commande(
    commande_id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    total real DEFAULT 0, 
    date_command TIMESTAMP NOT NULL,
    status VARCHAR(256) NOT NULL DEFAULT "En cours de traitement",
    FOREIGN KEY (user_id) REFERENCES utilisateur(user_id) ON DELETE CASCADE,
    PRIMARY KEY(commande_id)
);

CREATE TABLE article_commande(
    commande_id INT NOT NULL,
    article_id INT NOT NULL,
    quantite INT DEFAULT 1,
    PRIMARY KEY (commande_id, article_id),
    FOREIGN KEY (commande_id) REFERENCES commande(commande_id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES article(article_id) ON DELETE CASCADE
);


INSERT INTO utilisateur (username, password, code) VALUES ('nicolas', 'nicolas', 1);
INSERT INTO utilisateur (username, password, code) VALUES ('client', 'client', 0);

INSERT INTO article (name, location, type, price) VALUES('Prisha', 'img/bouquet0.jpg', 'bouquet', 22.90);
INSERT INTO article (name, location, type, price) VALUES('Indira', 'img/bouquet1.jpg', 'bouquet', 19.95);
INSERT INTO article (name, location, type, price) VALUES('Neila', 'img/bouquet2.jpg', 'bouquet', 19.99);
INSERT INTO article (name, location, type, price) VALUES('Mayra', 'img/bouquet3.jpg', 'bouquet', 25.99);
INSERT INTO article (name, location, type, price) VALUES('Avani', 'img/bouquet4.jpg', 'bouquet', 29.99);
INSERT INTO article (name, location, type, price) VALUES('Rosa', 'img/bouquet5.jpg', 'bouquet', 17.90);
INSERT INTO article (name, location, type, price) VALUES('Margot', 'img/bouquet6.jpg', 'bouquet', 16.90);
INSERT INTO article (name, location, type, price) VALUES('Eve', 'img/bouquet7.jpg', 'bouquet', 21.99);
INSERT INTO article (name, location, type, price) VALUES('Kate', 'img/bouquet8.jpg', 'bouquet', 18.99);
INSERT INTO article (name, location, type, price) VALUES('Diana', 'img/bouquet9.jpg', 'bouquet', 27.99);
INSERT INTO article (name, location, type, price) VALUES('Constance', 'img/bouquet10.jpg', 'bouquet', 28.99);
INSERT INTO article (name, location, type, price) VALUES('Brigitte', 'img/bouquet11.jpg', 'bouquet', 22.99);
INSERT INTO article (name, location, type, price) VALUES('Clemence', 'img/bouquet12.jpg', 'bouquet', 17.99);
INSERT INTO article (name, location, type, price) VALUES('Emma', 'img/bouquet13.jpg', 'bouquet', 23.99);
INSERT INTO article (name, location, type, price) VALUES('Olympe', 'img/bouquet14.jpg', 'bouquet', 18.99);
INSERT INTO article (name, location, type, price) VALUES('Jade', 'img/bouquet15.jpg', 'bouquet', 21.99);
INSERT INTO article (name, location, type, price) VALUES('Louisa', 'img/bouquet16.jpg', 'bouquet', 19.99);
INSERT INTO article (name, location, type, price) VALUES('Elena', 'img/bouquet17.jpg', 'bouquet', 29.99);