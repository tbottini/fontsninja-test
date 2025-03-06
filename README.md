# FontsNinja

## Utilisation

Démarrage de l'API

```sh
npm run start
```

Lancement des tests

```sh
npm run test
````

Lancement des migrations

```sh
npm run migration:run
````

## Choix de conception pour le projet

À partir de ma lecture de la problématique, j'ai fait les choix suivants (dans un contexte d'entreprise, j'aurais demandé une validation avant le développement) :

- ne pas stocker le contenu de l'article, mais seulement le lien, le titre, la date et la source
- créer une solution qui ne s'adapte qu'à un site, car le formatage des sites est différent à chaque fois. On pourrait améliorer la solution avec une analyse de formatage via un LLM, ou alors proposer des sélecteurs CSS depuis l'input pour faire le scraping.
- un mauvais formatage d'un article ne stoppe pas la récupération j'ai mis une limite à la récupération des articles
- ycombinator fournit les id de ses articles, j'ai pris cette donnée pour faire l'unicité des articles. Sinon j'aurais pu me baser sur l'url ou le titre, mais ils peuvent changer

## Pistes d'amélioration

- ajouter des transactions, des retry, de l'idempotence : la solution n'est pas résiliente. Ce qui fait qu'un cas n'est pas gérer : je fais un scrap, plus tard je fais un autre scrap mais il crash, alors il y a manque entre les deux scraps et en relancer un ne permettrait pas de combler ce manque.
- un meilleur logger : remplacer console.log par Winston créer un Dockerfile
- ajouter des tests d'intégration : base de données de test + Supertest sur le contrôleur
- faire des inversions de dépendance entre le repo et le service

## Choix de performance

### Techniquement

- (déjà fait) faire de la pagination par date de publication et non par offset, car l'offset va forcer le query planner à récupérer toutes les pages précédentes et donc parcourir tout l'index jusqu'à trouver tous les éléments requis
- (déjà fait) un index composite sur la source et ensuite sur la date de parution. J'ai considéré qu'on ne récupèrerait que les articles d'une source en même temps, dans le cas contraire on inverserait la position des deux attributs. L'attribut source est obligatoire pour chaque requête et date de parutions et l'attribut de tri, ce qui permet à la db de ne pas trier les données à la récupérations et de limiter la recherche dans l'index.
- (à faire) la recherche ILIKE n'est pas optimisée et n'est pas pertinente. Il faudra utiliser un index GIST avec la méthode d'indexation par trigramme, qui donne de bons résultats si on veut que ce soit pertinent et qui offre aussi de bonnes performances.

### En fonction de l'usage de l'application

- si on remarque que le niveau de lecture des anciens articles est très bas, on peut faire une partition pour les vieux articles
- avoir un duplica dédié à la lecture
- si une requête ne récupère qu'un seul type de source, alors on peut partitionner par nombre de sources... si le nombre de sources est bas.
