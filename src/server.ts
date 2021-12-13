import { connectRedis } from '@/redisClient'
// import { connectMongo } from '@/mongoClient'
import { log } from '@/utils/util'
import { dataSources } from '@/datasource'
import { formatError } from '@/errors'
import { schema } from '@/schema'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { conenctGunClient } from '@/gunClient'
import { createHttpsSever } from '@/httpsServer'
import { connectMongo } from '@/mongoClient'

if ( !process.env.ENV_LOADED ) {
  throw new Error(
    'Environment variables are not loaded. Please load them and set "ENV_LOADED" to true.'
  )
}

async function main() {
  await connectRedis()
  log( 'redis connected' )

  const client = await connectMongo()
  log( 'mongo connected' )

  conenctGunClient()
  log( 'Gun connected' )

  const server = new ApolloServer( {
    introspection: true
    , formatError
    , schema: schema
    , dataSources: dataSources( client )
    , context: async ({ req }: { req: any }) => {
      const client = await connectRedis()
      const phone = req.headers['X-AUTH-TOKEN'] as string

      if ( !phone ) {
        return {
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
  app.get( '/config', function (_req, res) {
    res.json( {
      env: { ...process.env }
    } )
  } )

  await server.start()
  server.applyMiddleware( { app, path: process.env.GRAPHQL_PATH } )

  const httpServer = createHttpsSever( app )
  httpServer.listen( { port: process.env.PORT }, () => {
    log( `🚀 Server ready at https://localhost:${process.env.PORT}${server.graphqlPath}` )
  } )
}

main()