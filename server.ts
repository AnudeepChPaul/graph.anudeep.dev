import { ApolloServer, ExpressContext, gql } from "apollo-server-express";
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import express from "express";
import https, { ServerOptions } from 'https'
import fs from 'fs'
import { DocumentNode } from "graphql";
import path from "path";
import { resolvers, typeDefs } from "./schema";

const config = {
  PORT: 4000
}

async function startApolloServer(typeDefs: DocumentNode, resolvers: any) {

  const server = new ApolloServer({ typeDefs, resolvers })
  await server.start();

  const app = express()
  server.applyMiddleware({ app })

  const serverOptions = {
    key: fs.readFileSync('.ssl/graphql_private_key.pem'),
    cert: fs.readFileSync('.ssl/graphql_certificate.pem'),
    ca: fs.readFileSync('.ssl/graphql_certificate.pem'),
    strictSSL: false,
    requestCert: false,
    rejectUnauthorized: false,
  }
  const httpServer = https.createServer(serverOptions as ServerOptions, app)

  httpServer.listen({ port: config.PORT }, () => {
    console.log(`🚀 Server ready at https://localhost:${config.PORT}${server.graphqlPath}`)
  });
}

// const typeDefs = gql`
//   # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

//   # This "Book" type defines the queryable fields for every book in our data source.
//   type Book {
//     title: String
//     author: String
//   }

//   # The "Query" type is special: it lists all of the available queries that
//   # clients can execute, along with the return type for each. In this
//   # case, the "books" query returns an array of zero or more Books (defined above).
//   type Query {
//     books: [Book]
//   }
// `;
// const books = [
//   {
//     title: 'The Awakening',
//     author: 'Kate Chopin',
//   },
//   {
//     title: 'City of Glass',
//     author: 'Paul Auster',
//   },
// ];
// // Resolvers define the technique for fetching the types defined in the
// // schema. This resolver retrieves books from the "books" array above.
// const resolvers = {
//   Query: {
//     books: () => books,
//   },
// };

startApolloServer(typeDefs, resolvers)
