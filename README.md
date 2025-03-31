# quizzmeup_api
Un projet API Express.js généré avec *express-new*.

## 🚀 Lancer le projet

1. Installer les dépendances :
   ```sh
   npm install
   ```

2. Configurer l'environnement :
   - Modifier le fichier `.env` selon votre setup.
   ```env
   DB_NAME=quizzmeup_api
   MONGODB_URI=mongodb://localhost:27017/quizzmeup_api
   JWT_SECRET=mon_super_secret
   PORT=3000
   ```

3. Démarrer le serveur :
   ```sh
   npm start
   ```

## 📌 Structure

- **config/** : Connexion MongoDB
- **src/controllers/** : Logique des routes
- **src/models/** : Modèles Mongoose
- **src/routes/** : Définition des routes
- **src/middlewares/** : Middlewares Express
