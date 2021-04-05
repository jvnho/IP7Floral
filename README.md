- Dans votre éditeur de texte préféré, ouvrez main.js et ajoutez à partir de la ligne 20, les informations concernant la machine où tourne mysql, c'est-à-dire "user" (l.23) et "password" (l.24 ).

- Ouvrir un terminal dans le répertoire courant et exécuter "source tables.sql" ce qui devrait créer une nouvelle base de donnée ainsi que les tables et quelques données associés
(si vous n'arrivez pas à effectuer cette étape copier-coller le contenu de tables.sql dans l'interpréteur mysql devrait faire l'affaire)

- Toujours dans un terminal, exécutez "npm install" afin d'installer les dépendances du programme
(si pour une raison quelconque ceci ne fonctionne pas pour vous, il va falloir installer à la main les modules suivants : express, express-session, mysql, md5, path, ejs, body-parser, en tapant npm install <module>)

- Exécutez "node main.js", ouvrir un navigateur tapez "localhost:8080" et vous êtes prêt à utiliser le site.

Pour se connecter en tant que client:
- login: client, mot de passe: client
- login: client2, mot de passe: client2

Pour se connecter en tant de vendeur/fleuriste:
- login: nicolas, mot de passe: nicolas
- login: vendeur, mot de passe: vendeur

(utilisation du protocole MD5 bien qu'obsolète)

Les clients ont déjà un panier remplit, rien n'empêche de le modifier (ajouter, augmenter/diminuer la quantiter, supprimer un article).
Les vendeurs ont quelques commandes à préparer, les clients peuvent en créer en validant le contenu de leur panier.