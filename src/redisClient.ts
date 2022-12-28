import { log } from '@/utils/util'

const redis = require('redis')

let redisClient: any

export async function connectRedis() {
  if (redisClient) {
    return redisClient
  }

  const { REDIS_PORT, REDIS_HOST } = process.env
  const url = `redis://${REDIS_HOST}:${REDIS_PORT}`

  log(`Redis connected ${url}`)

  redisClient = redis.createClient({
    url
  })
  await redisClient.connect()
  return redisClient
}
