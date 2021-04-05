- Dans votre éditeur de texte préféré, ouvrez main.js et modifiez à partir de la ligne 20, les informations concernant mysql, c'est-à-dire "user" et "password" (éventuellement host).

- Ouvrir un terminal dans le répertoire courant et exécutez "source tables.sql" ce qui devrait créer une nouvelle base de donnée ainsi que les tables et quelques données
(si vous n'arrivez pas à effectuer cette étape copier-coller le contenu de tables.sql dans l'interpréteur mysql devrait faire l'affaire)

- Toujours dans un terminal, exécutez npm install afin d'installer les dépendances du programme
(si pour une raison quelconque ceci ne fonctionne pas pour vous, il va falloir installer à la main les modules suivants : express, express-session, mysql, path, ejs, body-parser, en tapant npm install <module>)

- Exécutez "node main.js", ouvrir un navigateur tapez "localhost:8080" et vous êtes prêt à utiliser le site.

