DROP DATABASE IF EXISTS pw6sangsiri;

CREATE DATABASE pw6sangsiri;

USE pw6sangsiri;

DROP TABLE IF EXISTS utilisateur;
DROP TABLE IF EXISTS article;
DROP TABLE IF EXISTS panier;
DROP TABLE IF EXISTS commande;
DROP TABLE IF EXISTS article_commande;

CREATE TABLE utilisateur(
    user_id INT AUTO_INCREMENT NOT NULL,
    username VARCHAR(15) NOT NULL,
    password VARCHAR(64) NOT NULL,
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
    date_command DATE NOT NULL,
    status VARCHAR(256) NOT NULL DEFAULT "Commande validée",
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


INSERT INTO utilisateur (username, password, code) VALUES ('nicolas', md5('nicolas'), 1);
INSERT INTO utilisateur (username, password, code) VALUES ('vendeur', md5('vendeur'), 1);
INSERT INTO utilisateur (username, password, code) VALUES ('client', md5('client'), 0);
INSERT INTO utilisateur (username, password, code) VALUES ('client2', md5('client2'), 0);

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

INSERT INTO article (name, location, type, price) VALUES('Lucile', 'img/fleur1.jpg', 'fleur', 5.90);
INSERT INTO article (name, location, type, price) VALUES('Sofia', 'img/fleur2.jpg', 'fleur', 5.99);
INSERT INTO article (name, location, type, price) VALUES('Mya', 'img/fleur3.jpg', 'fleur', 6.99);
INSERT INTO article (name, location, type, price) VALUES('Inaya', 'img/fleur4.jpg', 'fleur', 5.99);
INSERT INTO article (name, location, type, price) VALUES('Ambre', 'img/fleur5.jpg', 'fleur', 5.99);
INSERT INTO article (name, location, type, price) VALUES('Louise', 'img/fleur6.jpg', 'fleur', 6.00);

INSERT INTO panier VALUES (3,6,1),(3,17,1),(4,23,3),(4,24,3);

INSERT INTO commande VALUES (1,3,35.94,'2021-04-05','En cours de traitement'),(2,4,50.98,'2021-04-04','Commande validée');

INSERT INTO article_commande VALUES (1,20,3),(1,22,2),(1,23,1),(2,10,1),(2,12,1);