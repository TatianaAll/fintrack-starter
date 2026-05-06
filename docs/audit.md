# Audit du fichier transaction-legacy.js

## Diagnostic général

Le fichier `transaction-legacy.js` est un module JavaScript ancien (2019) qui centralise le traitement des transactions financières.  
Il contient trois fonctions principales et repose sur une logique procédurale, avec de nombreuses variables mutables déclarées via `var`.

Le fichier permet de filtrer les transactions par mois et par année, de valider certaines données (type, montant), de convertir les devises, de catégoriser les dépenses et de calculer des indicateurs globaux (totaux, moyennes, alertes).  
Sur le fond, la logique est fonctionnelle et couvre un périmètre métier assez large dans un seul point d’entrée.

En revanche, le code est difficile à maintenir : la fonction principale est très longue (plus de 200 lignes) et mélange plusieurs responsabilités, il manque de découpage.  
Les règles métier sont codées en dur (taux de change, mots-clés de catégorisation, seuils), ce qui complique leur évolution.

## Risques identifiés

- **Zone du code : variables globales et déclarations (`var`, `TYPES`)**  
  **Problème observé :** usage de `var` alors que la déclaration avec des `let` serait suffisante et la constante `TYPES` ets déclarée en tant que variable, il vaudrait mieux la passer en const comme le laisse suggérer sa typographie (toute en majuscule).  
  **Impact potentiel :** le scope n'est pas bien défini à cause des `var`, possibilité de modifier sans le vouloir les `TYPES` et donc il y a de gros risque d'effet de bord. L'évolution du code risque d'être compromise sans modification.

- **Zone du code : fonction `processTransactions` (structure globale)**  
  **Problème observé :** fonction monolithique (>200 lignes) avec de la validation mais aussi de la logique métier, des calculs, du formatage --> spaghetti code.
  **Impact potentiel :** dificile à lmaintenir ++, tests unitaires très compliqué à mettre en place.

- **Zone du code : paramètres d’entrée de la fonction `processTransactions` (`txs`, `opts`)**  
  **Problème observé :** absence de typage, nom des paramètres peu clairs, pas de validation globale ni de documentation sur la structure attendue des données.  
  **Impact potentiel :** erreurs à l’exécution et comportements incohérents selon les données fournies lors de l'appel de la fonction.

- **Zone du code : conversion de devises fonction `processTransaction` ligne 113 à 129**  
  **Problème observé :** taux de change codés en dur (alors que versatiles !) et partiels, avec un fallback arbitraire à `1`.  
  **Impact potentiel :** calculs financiers incorrects, perte de fiabilité des résultats et décisions basées sur des montants erronés.

- **Zone du code : catégorisation par libellé fonction `processTransaction` ligne 132 à 161**  
  **Problème observé :** catégorisation basée sur des mots-clés en dur et non normalisés.  
  **Impact potentiel :** classifications approximatives ou fausses.

- **Zone du code : gestion des dates `fmt`, tri final dans la fonction `processTransaction` ligne 190 à 213**  
  **Problème observé :** formatage manuel des dates en chaînes et re‑parsing pour le tri.  
  **Impact potentiel :** bugs liés au format, difficultés d’internationalisation et erreurs lors d’évolutions sur la gestion temporelle.

- **Zone du code : code mort et obsolète fonction `legacyHelper`, et fonctions commentées**  
  **Problème observé :** présence de fonctions non utilisées et/ou commenté.  
  **Impact potentiel :** confusion et risque d'erreur lors de la refactorisation.

## Code Smell

### Les différents code smell

- **Long Method** : une fonction qui fait plus de 30 lignes
- **Magic Number** : un nombre en dur dont personne ne sait ce qu’il représente
- **Duplicate Code** : le même bloc copié 2+ fois
- **God Object** : une classe ou un module qui fait tout
- **Dead Code** : du code jamais exécuté
- **Unclear Naming** : des variables nommées x, tmp, data2

### Code smell identifiés

#### [Long Method] **Priorité HAUTE**

Localisation : trasactions-legacy.js:ligne 34 à 236
Constat : La fonction processTransactions() fait plus de 200 lignes
Impact : fonction monolithique en spaghetti code mélangeant logique métier, affichage et calculs
Proposition : la découper en plusieurs petites fonctions

#### [Dead Code] **Priorité FAIBLE**

Localisation : transactions-legacy.js:fonction `legacyHelper` ligne 239 à 245, fonction commentée `formatDate2` ligne 24 à 31
Constat : Présence de fonctions définies mais jamais utilisées dans le module.  
Impact : Augmente inutilement la taille du code, crée de la confusion et laisse penser que certaines parties sont encore nécessaires.  
Proposition : Supprimer les fonctions non utilisées après vérification de leur absence d’appel dans le reste du projet.

#### [God Function] **Priorité HAUTE**

Localisation : transactions-legacy.js lignes 34 à 236  
Constat : `processTransactions()` assume trop de responsabilités : filtrage, validation, conversion, catégorisation, alertes, agrégation et formatage.  
Impact : Forte dépendance entre les règles métier et le traitement technique, rendant toute modification risquée.  
Proposition : Appliquer le principe SOLID avec la responsabilité unique (Single Responsibility Principle) en isolant chaque logique métier dans une fonction ou un module dédié. (https://en.wikipedia.org/wiki/SOLID)

#### [Magic Numbers] **Priorité MOYENNE**

Localisation : transactions-legacy.js : taux de change: ligne 115 à 125, seuil par défaut variable thershold, mots-clés de catégorisation ligne 132 à 161
Constat : Valeurs codées en dur directement dans le code.  
Impact : Difficulté de mise à jour (surtout pour les taux de changes qui sont versatiles), risque d’erreurs fonctionnelles et absence de traçabilité des règles métier.  
Proposition : Centraliser ces valeurs dans des constantes, une configuration ou un service dédié.

### [Unclear Naming] **Priorité MOYENNE**

Localisation : transactions-legacy.js : variables `i`, `j`, `tx`, `d`, `lab`. 
Constat : Utilisation de noms de variables courts ou peu explicites.  
Impact : Compréhension difficile de la logique, surtout lorsque l'on arrive sur le projet 
Proposition : Renommer les variables avec des noms explicites (`transaction`, `transactionDate`, `labelLowerCase`, `index`).

#### [Duplicated Logic] **Priorité BASSE**

Localisation : transactions-legacy.js : formatage et parsing des dates avec la fonction `fmt()` et `formatDate2()` (commentée)  
Constat : Formatage manuel des dates suivi d’un re-parsing pour effectuer le tri.  
Impact : Code fragile, peu performant et sujet aux erreurs liées au format de date.  
Proposition : Conserver les dates sous forme d’objets `Date` pour les calculs et ne formater qu’au moment de l’affichage.

#### [Missing Documentation] **Priorité MOYENNE**

Localisation : transactions-legacy.js (paramètres `txs`, `opts`)  
Constat : Absence de documentation ou de contrat clair sur la structure attendue des paramètres.  
Impact : Mauvaise compréhension de la fonction, erreurs d’utilisation.  
Proposition : Documenter les structures attendues (JSDoc, schémas, types en TS) et valider les entrées en début de traitement.

### SonarJS
En lançant SonarJS sur le fichier j'ai un seul code smell qui est : 
```zsh
Refactor this function to reduce its Cognitive Complexity from 59 to the 15 allowed  sonarjs/cognitive-complexity
✖ 1 problem (0 errors, 1 warning)
```
