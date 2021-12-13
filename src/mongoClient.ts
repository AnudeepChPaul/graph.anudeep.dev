import { MongoClient } from 'mongodb'

let client: MongoClient

export const connectMongo = async () => {
  if ( client ) {
    return
  }

  client = new MongoClient( `${process.env['MONGO_URL']}` )
  await client.connect()

  return client
}
