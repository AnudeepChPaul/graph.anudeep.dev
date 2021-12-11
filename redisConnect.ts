import { createClient } from 'redis';

let client = createClient()
let connected = false;

export function getRedisClient() {
  return client
}

export async function connectRedis() {
  if ( !connected ) {
    await client.connect();
  }
  connected = true
}