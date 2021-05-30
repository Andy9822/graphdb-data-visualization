# Graphdb Data Visualization 🎨

## Abstract 🗺
  Este trabalho apresenta uma análise dos dados de interação de usuários do portal de notícias
  G1. Através de um conjunto de publicações realizadas no portal e das informações de interação
  dos usuários com essas publicações, o trabalho busca entender o comportamento de usuários em
  relação às notícias consumidas. A base de dados possui informações de mais de 300 mil
  usuários e 46 mil artigos de notícias, totalizando 3 milhões de cliques nas páginas do portal
  do G1. O trabalho pretende apresentar quais são as características principais da interação
  dos usuários com o portal.

## Project ⚙️

The system consists in a graph-oriented database, Neo4j, used alongside with Neo4j Browser, our web application based on queries and data visualization.

As we opted for a grah database, it's really interesting the fact of being able to interact with the results: it's possible to move the nodes, expand a set of nodes and relationships and be able to understand and infer properties just by visually seeing the results.

### Built with 🪄

* [Neo4j DB](https://neo4j.com/product/neo4j-graph-database/) - Graph oriented database 
* [Neo4j Browser](https://neo4j.com/docs/browser-manual/current/) - Web tool for Neo4j db management and data visualization
* [GraphQL](https://graphql.org/) - Query and manipulation language for APIs
* [Apollo](https://www.apollographql.com/) - Tool for managing data with GraphQL
* [Cypher](https://neo4j.com/developer/cypher/) - Query language for store and retrieve data from a graph database

## Setup 🛠

The entire project has been _dockerized_: both database and web application are services in our `docker-compose.yml` file.
Due to it, by just executing `make services-up` we'll have a local deploy of the whole system and will open it in the browser.

We have a local script to seed the database with a sample of the entire dataset. However, it requires to insall `node` dependencies in the root folder and also in the api folder. To simplify this, it's possible to run `make install` (although it expects to have `yarn` installed).

It's valid to mention that in case of being the first time running the project andconfiguring the database constraints and internal rules, it's necessary to run the `Setup Constraints` script in Neo4j Browser (explained in the next section how to import and run scripts).<br />
See it in action below:
![](./assets/setup_constraints.gif)

## Executing ⚡️
Once having the services running by `docker-compose` we just need to open http://localhost:7474/browser/ in a browser.
The default database is `neo4j` and the password is `test`. Even though is possible to point to a remote database, we are using it local to simplify the execution.

In order of importing the scripts we've created, we need to drag the `queries_scripts.zip` and drop it in the Favorites tab in the web app.
Then we'll be able to press the play icon in any of the imported scripts (we suggest to give preference to those with `visual` in its name as they have better visualization in our tool).<br />
See it in action below:
![](./assets/queries_scripts.gif)

## Authors 🧙🏻‍♂️
* [Andy Ruiz Garramones](https://www.linkedin.com/in/ruizgarramones/)
* [Leonardo Vianna](https://www.linkedin.com/in/vianna274/)
* [Eder Matheus](https://www.linkedin.com/in/eder-matheus-rodrigues-monteiro-b61a53b4/)