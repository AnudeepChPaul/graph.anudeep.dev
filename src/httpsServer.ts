import fs from 'fs'
import https, { ServerOptions } from 'https'

export function createHttpsSever(app?: any) {
  const serverOptions = {
    key: fs.readFileSync('.ssl/graphql_private_key.pem')
    , cert: fs.readFileSync('.ssl/graphql_certificate.pem')
    , ca: fs.readFileSync('.ssl/graphql_certificate.pem')
    , strictSSL: false
    , requestCert: false
    , rejectUnauthorized: false
  }

  if (app) {
    return https.createServer(serverOptions as ServerOptions, app)
  }

  return https.createServer(serverOptions as ServerOptions)
}
