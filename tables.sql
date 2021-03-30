DROP DATABASE IF EXISTS ip7floral;

CREATE DATABASE ip7floral;

USE ip7floral;

DROP TABLE IF EXISTS utilisateur;
DROP TABLE IF EXISTS article;
DROP TABLE IF EXISTS panier;
DROP TABLE IF EXISTS commande;

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
    location VARCHAR(256) NOT NULL,
    type ENUM('bouquet', 'fleur') NOT NULL,
    prix REAL NOT NULL, 
    PRIMARY KEY(article_id),
    UNIQUE(location)
);

CREATE TABLE panier(
    user_id INT NOT NULL,
    article_id INT NOT NULL,
    total REAL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES utilisateur(user_id),
    FOREIGN KEY (article_id) REFERENCES article(article_id),
    PRIMARY KEY(user_id)
);

CREATE TABLE commande(
    commande_id VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    total real DEFAULT 0, 
    date_command TIMESTAMP NOT NULL,
    status VARCHAR(256) NOT NULL DEFAULT "En cours de traitement",
    FOREIGN KEY (user_id) REFERENCES utilisateur(user_id),
    PRIMARY KEY(user_id, commande_id)
);


INSERT INTO utilisateur (username, password, code) VALUES ('nicolas', 'nicolas', 1);
INSERT INTO utilisateur (username, password, code) VALUES ('client', 'client', 0);

INSERT INTO article (location, type, prix) VALUES('img/bouquet1.jpg', 'bouquet', 7.99);
INSERT INTO article (location, type, prix) VALUES('img/bouquet2.jpg', 'bouquet', 7.90);
INSERT INTO article (location, type, prix) VALUES('img/bouquet3.jpg', 'bouquet', 6.99);
INSERT INTO article (location, type, prix) VALUES('img/bouquet4.jpg', 'bouquet', 6.90);
INSERT INTO article (location, type, prix) VALUES('img/bouquet5.jpeg', 'bouquet', 6.90);
INSERT INTO article (location, type, prix) VALUES('img/bouquet6.jpg', 'bouquet', 6.90);
INSERT INTO article (location, type, prix) VALUES('img/bouquet7.jpg', 'bouquet', 7.99);

pensez aux bouquets personnalisées