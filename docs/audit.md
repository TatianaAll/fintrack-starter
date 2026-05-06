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
  **Problème observé :** absence de typage, nom des paramètres peu clairs,  pas de validation globale ni de documentation sur la structure attendue des données.  
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


## Analyse détaillée du fichier

C'est un fichier js de 245 lignes pour 3 fonctions.
Les variables modilables sont déclarées avec *var* ce qui est déprécié, si le scope est correct il vaut mieux les déclarer avec un *let*.

En première ligne sont déclarés des types, écrits en majuscule cela laisse à penser que c'est un tableau de constantes, pourtant il est déclaré avec un var, il serait plus judicieux de le déclarer comme une constante donc avec *const*.

### Fonction fmt()

C'est la première fonction du fichier qui n'est pas appelé dans l'application mais qui est utilisée dans la fonction `processTransactions`.
Elle fait 6 lignes.
Cette fonction prend 1 paramètre nommé **d** et possède a 3 variables qui sont :
- dd: le jour de d calculé avec d.getDate();
- mm: le mois de d avec d.getMont() + 1 (car les mois vont de 0 à 11)
- yyyy: l'année de d
Cette fonction retourne une string de format **jj/mm/AAAA**
Mais l'on ne sait pas quelle donnée passer en paramètre.

### Fonction processTransactions()

C'est la plus grosse fonction qui fait plus de 200 lignes ! Elle pourrait surement être découpée en plusieurs petites fonctions qui la rendrait plus maintenable.
Cette fonction prend en entrée 2 paramètres : **txs** et **opts**, on ne sait pas exactement ce que représentent ces paramètres si l'on doit renseigner des arrays, des nombres, etc.
