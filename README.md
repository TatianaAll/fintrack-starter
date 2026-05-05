# FinTrack

Application de gestion de budget personnel.

## Stack

- React 18
- Vite

## Installation

```bash
npm ci
npm run dev
```

L'appli est dispo sur http://localhost:5173.

## Structure

- `src/calculator.js` — moteur de calcul
- `src/transactions-legacy.js` — module historique de traitement des transactions
- `src/seed.js` — données de démarrage
- `src/App.jsx` — interface

## TODO

- [ ] Ajouter des tests
- [X] Mettre en place un linter
- [X] CI
- [ ] Export CSV
- [ ] Refacto du module legacy

---

## Installation

1 - Récupérer le projet sur le github https://github.com/FouziGit/fintrack-starter via un fork 
2 - Git clone le projet sur ma machine avec git clone https://github.com/TatianaAll/fintrack-starter.git    
3 - Vérifier que la version de node est la bonne enregistré dans le .nvmrc avec `node –version`, et la modifier avec la bonne version  
4 - Lancer `npm ci` pour installer les dépendances écrites dans le package-lock.json  
5 - Copier le .env.example pour créer le .env du projet  
6 - Avant de push vérifier que vous êtes bien sur votre repo avec `git remote -v` 

### Dépendance ajoutées
ESLint et Prettier pour Linter et formater le projet durant la CI-CD `npm install --save-dev eslint prettier eslint-config-prettier`
Installation avec `npx eslint --init` pour du JS, linter + formattage (donc avec vérification du code), sur un code REACT, utilisation de npm

Installation de Husky pour faire tourner ESLint et Prettier durant la CI-CD `npm install --save-dev husky lint-staged && npx husky init`

Modification du package.json pour ajouter le linter avec 
```json 
"lint-staged": {
    "*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,json}": [
      "prettier --write"
    ]
  }
  ```

Création d'un dossier .github avec un dossier workflows et création du workflow à exécuter au push dans gitHub grace à github Action

## Ecriture des tests unitaires
Première étape installer Jest `npm install --save-dev jest`, et ajouter le script "test" dans le package.json 
Vu que le projet est en ESM et que Jest est configuré de base pour du Common JS j'ai dû faire quelques modifications (sources : https://github.com/jestjs/jest/blob/main/docs/ECMAScriptModules.md).

Pour le test de coverage il faut lancer `npm test -- --coverage` vu qu'on est avec l'écriture ESM

*Projet fil rouge B3 Dev — My Digital School Bordeaux*
