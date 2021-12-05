import { ApolloServer } from "apollo-server-express";
import express from "express";
import https, { ServerOptions } from 'https'
import fs from 'fs'
import { GraphQLSchema } from "graphql";
import { schema } from "./schema";
import { loadEnvVariables, log } from "./utils/util";

loadEnvVariables();

async function startApolloServer(schema: GraphQLSchema) {
  const server = new ApolloServer({ schema })
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
    log(`🚀 Server ready at https://localhost:${process.env.PORT}${server.graphqlPath}`)
  });
}

startApolloServer(schema)
