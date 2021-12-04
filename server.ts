import { ApolloServer } from "apollo-server-express";
import express from "express";
import https, { ServerOptions } from 'https'
import fs from 'fs'
import { DocumentNode } from "graphql";
import { resolvers, typeDefs } from "./schema";
import { loadEnvVariables } from "./utils/util";

loadEnvVariables();

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

  httpServer.listen({ port: process.env.PORT }, () => {
    console.log(`🚀 Server ready at https://localhost:${process.env.PORT}${server.graphqlPath}`)
  });
}

startApolloServer(typeDefs, resolvers)
