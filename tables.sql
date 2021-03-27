DROP DATABASE IF EXISTS ip7floral;

CREATE DATABASE ip7floral;

USE ip7floral;

DROP TABLE utilisateur IF EXISTS;
DROP TABLE article IF EXISTS;
DROP TABLE panier IF EXISTS;
DROP TABLE commande IF EXISTS;

CREATE TABLE utilisateur(
    user_id INT AUTO_INCREMENT NOT NULL,
    username VARCHAR(15) NOT NULL,
    password VARCHAR(25) NOT NULL,
    code INT(1) DEFAULT 0,
    PRIMARY KEY(user_id, username)
);

CREATE TABLE article(
    article_id INT AUTO_INCREMENT NOT NULL,
    location VARCHAR(256),
    type VARCHAR(10) NOT NULL,
    prix REAL,
    CONSTRAINT type CHECK (type == 'bouquet' OR type == 'fleur'),
    PRIMARY KEY(article_id, location)
);


CREATE TABLE panier(
    user_id INT NOT NULL,
    article_id INT NOT NULL,
    total INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES utilisateur(user_id),
    FOREIGN KEY (article_id) REFERENCES article(article_id),
    PRIMARY KEY(user_id, article_id)
);

CREATE TABLE commande(
    commande_id VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    total INT DEFAULT 0,
    date_command, TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT "En cours de traitement",
    FOREIGN KEY (user_id) REFERENCES utilisateur(user_id)
);


INSERT INTO utilisateur VALUES(0, 'user1', 'user1pass', 0);
INSERT INTO utilisateur VALUES(1, 'user2', 'user2pass', 0);
INSERT INTO utilisateur VALUES(2, 'user3', 'user3pass', 0);
INSERT INTO utilisateur VALUES(3, 'nicolas', 'nicolas', 0);

INSERT INTO article VALUES(0, 'img/bouquet1.jpg', 'bouquet', 7.99);
INSERT INTO article VALUES(1, 'img/bouquet2.jpg', 'bouquet', 6.99);
INSERT INTO article VALUES(2, 'img/bouquet3.jpg', 'bouquet', 8.99);

pensez aux bouquets personnalisées