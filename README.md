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
- [ ] Mettre en place un linter
- [ ] CI
- [ ] Export CSV
- [ ] Refacto du module legacy

---

## Installation

1 - Récupérer le projet sur le github https://github.com/FouziGit/fintrack-starter via un fork 
2 - Git clone le projet sur ma machine avec git clone https://github.com/TatianaAll/fintrack-starter.git    
3 - Vérifier que la version de node est la bonne enregistré dans le .nvmrc avec `node –version`, et la modifier avec la bonne version 
4 - Lancer `npm ci` pour installer les dépendances écrites dans le package-lock.json 
5 - Copier le .env.example pour créer le .env du projet 

*Projet fil rouge B3 Dev — My Digital School Bordeaux*
