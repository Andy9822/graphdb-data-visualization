"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _graphqlSchema = require("./graphql-schema");

var _apolloServerExpress = require("apollo-server-express");

var _express = _interopRequireDefault(require("express"));

var _neo4jDriver = _interopRequireDefault(require("neo4j-driver"));

var _graphql = require("@neo4j/graphql");

var _dotenv = _interopRequireDefault(require("dotenv"));

// set environment variables from .env
_dotenv.default.config();

const app = (0, _express.default)();
/*
 * Create a Neo4j driver instance to connect to the database
 * using credentials specified as environment variables
 * with fallback to defaults
 */

const driver = _neo4jDriver.default.driver(process.env.NEO4J_URI || 'bolt://localhost:7687', _neo4jDriver.default.auth.basic(process.env.NEO4J_USER || 'neo4j', process.env.NEO4J_PASSWORD || 'neo4j'));
/*
 * Create an executable GraphQL schema object from GraphQL type definitions
 * including autogenerated queries and mutations.
 * Read more in the docs:
 * https://neo4j.com/docs/graphql-manual/current/
 */


const neoSchema = new _graphql.Neo4jGraphQL({
  typeDefs: _graphqlSchema.typeDefs,
  driver
});
/*
 * Create a new ApolloServer instance, serving the GraphQL schema
 * created using makeAugmentedSchema above and injecting the Neo4j driver
 * instance into the context object so it is available in the
 * generated resolvers to connect to the database.
 */

const server = new _apolloServerExpress.ApolloServer({
  context: {
    driver,
    driverConfig: {
      database: process.env.NEO4J_DATABASE || 'neo4j'
    }
  },
  schema: neoSchema.schema,
  introspection: true,
  playground: true
}); // Specify host, port and path for GraphQL endpoint

const port = process.env.GRAPHQL_SERVER_PORT || 4001;
const path = process.env.GRAPHQL_SERVER_PATH || '/graphql';
const host = process.env.GRAPHQL_SERVER_HOST || '0.0.0.0';
/*
 * Optionally, apply Express middleware for authentication, etc
 * This also also allows us to specify a path for the GraphQL endpoint
 */

server.applyMiddleware({
  app,
  path
});
app.listen({
  host,
  port,
  path
}, () => {
  console.log(`GraphQL server ready at http://${host}:${port}${path}`);
});