# FontsNinja

## Utilisation

Démarrage de l'api

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

## Choix prix pour la conceptions du projet

à partir de ma lecture de la problématique j'ai fait les choix de (dans un contexte en entreprise j'aurais demander validation avant le développement) :

- ne pas stocker le contenu de l'article mais juste le lien, le titre, la date et la source
- de faire une solution qui ne s'adapte qu'à un site, car le formattage des sites est différent à chaque fois, on pourrait améliorer la solutions avec une analyse de formattage via un llm, ou alors proposer depuis l'input des selecteur CSS pour faire le scrapping.
- un mauvais formattage d'un article ne stoppe pas la récupération
- j'ai mis une limite à la récupération des articles

### Piste d'amélioration

- mettre des transactions, des retry, de l'idempotence : la solution n'est pas résiliante
- un meilleur logger : remplacer console.log par winston
- faire un docker
- des tests d'intégration : db de test + supertest sur le controller
- faire des inversion de dépendance entre le repo et le service

## Choix de performance

### Techniquement

- (déjà fait) faire de la pagination par date de publication et non un offset,
  - car le offset va forcer dans le query planner à récupérer tous les pages précédentes et donc parcourrir tous l'index jusqu'à trouver tous les éléments requêté
- (déjà fait) un index composite sur le tri et la recherche
  - si on commence l'index par la clé de tri alors la récupération dans l'index sera déjà trié, il n'y aura pas d'opérations supplémentaire à faire sur la db et pas de recherche inutile dans la db. Ensuite on met le titre dans l'index pour que le query planner puis faire la recherche en IndexScan et ne pas le faire en lisant la donnée sur disque.
- (à faire) la recherche ILIKE n'est pas optimisé et n'est pas pertinente, il faudra utiliser un index GIST avec le mathode d'indexation par trigramme qui donne de bon résultat si on veut que ça soit pertinent et qui donne aussi de bonne performance

### En fonction de l'usage de l'application

- si on remarque que le niveau de lecture des anciens articles est très très bas, on peut faire une partition pour les vieux articles
- avoir un duplica dédié à la lecture
- si une requête ne récupère qu'un seul type de source alors on peut particionner par nombre de source... si le nombre de source est bas.
