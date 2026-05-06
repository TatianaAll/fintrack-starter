# Scénarios BDD pour `export-csv.test.js`

## Scénario 1 : filtrer les transactions du mois courant
- **Étant donné** une liste de transactions contenant des dates au format français `dd/MM/yyyy` et des dates ISO `YYYY-MM-DDTHH:mm:ss.sssZ`
- **Quand** on appelle `filterTransactionsCurrentMonth(arrayTransaction)`
- **Alors** seules les transactions dont la date appartient au mois et à l’année courante doivent être retournées
- **Et** les transactions des mois précédents doivent être exclues

## Scénario 2 : échapper une valeur CSV contenant des guillemets
- **Étant donné** une valeur de transaction contenant des guillemets doubles, par exemple `Prime "exceptionnelle"`
- **Quand** on appelle `escapeCsvValue(value)`
- **Alors** le résultat doit entourer la valeur de guillemets
- **Et** les guillemets internes doivent être doublés selon RFC 4180

## Scénario 3 : générer le contenu CSV pour un tableau vide
- **Étant donné** un tableau de transactions vide ou une valeur n’étant pas un tableau
- **Quand** on appelle `buildCsvContent(arrayTransaction)`
- **Alors** la fonction doit retourner uniquement la ligne d’en-tête CSV
- **Et** aucun enregistrement de transaction ne doit être ajouté