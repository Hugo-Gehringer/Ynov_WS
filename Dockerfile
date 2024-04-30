# Utilisation de l'image Node.js Alpine à partir des registres d'images.
FROM node:16-alpine

# Définition du répertoire dans le conteneur à /app pour stocker les fichiers et lancer notre application.
WORKDIR /app

# Copie du fichier package.json dans le répertoire /app avec ses dépendances.
COPY package.json /app

# Installation des dépendances de l'application.
RUN npm install

# Copie du reste de l'application dans le répertoire /app.
COPY . /app

# Commande pour exécuter notre application, qui est index.js.
CMD node app.js

# Exposition du port sur lequel notre application s'exécute, à savoir le port 3000.
EXPOSE 3000
#
#  docker build -t web .
# docker run -p 8080:3000 web