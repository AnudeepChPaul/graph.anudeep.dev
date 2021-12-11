import { log } from "@utils/util";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import https, { ServerOptions } from 'https'
import fs from 'fs'
import { GraphQLSchema } from "graphql";
import { schema } from "@/schema";
import { connectMongo, dataSources } from "@/dataSources";
import { formatError } from '@/errors'
import { connectRedis, getRedisClient } from '@/redisConnect'

if ( process.env.NODE_ENV === 'develop' ) {
  require( 'dotenv' ).config( {
    path: './dev.env'
  } ).parsed
}

async function startApolloServer(schema: GraphQLSchema, dataSources: any) {
  await connectRedis()
  const client = await connectMongo()

  const server = new ApolloServer( {
      schema,
      formatError,
      dataSources: dataSources( client ),
      context: async ({ req }) => {
        const client = getRedisClient()
        const phone = req.headers['X-AUTH-TOKEN'] as string

        if ( !phone ) {
          return {
            // @ts-ignore
            loggedIn: false
          }
        }
        const value = await client.get( phone )

        if ( value ) {
          return {
            isLoggedIn: true
          }
        }
      }
    }
  )
  const app = express()

// app.use( '/auth0', auth0App )
  app.get( '/config', function (req, res) {
    res.json( {
      env: { ...process.env }
    } )
  } )

  /* app.use( auth( {
     authRequired: process.env.AUTH0_AUTH_REQUIRED,
     auth0Logout: process.env.AUTH0_AUTH_LOGOUT,
     secret: process.env.AUTH0_SECRET,
     baseURL: process.env.AUTH0_BASE_URL,
     clientID: process.env.AUTH0_CLIENT_ID,
     issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
   } ) );*/

  await server.start();
  server.applyMiddleware( { app, path: process.env.GRAPHQL_PATH } )

  const serverOptions = {
    key: fs.readFileSync( '.ssl/graphql_private_key.pem' ),
    cert: fs.readFileSync( '.ssl/graphql_certificate.pem' ),
    ca: fs.readFileSync( '.ssl/graphql_certificate.pem' ),
    strictSSL: false,
    requestCert: false,
    rejectUnauthorized: false,
  }
  const httpServer = https.createServer( serverOptions as ServerOptions, app )

  httpServer.listen( { port: process.env.PORT }, () => {
    log( `🚀 Server ready at https://localhost:${process.env.PORT}${server.graphqlPath}` )
  } );
}

startApolloServer( schema, dataSources )
