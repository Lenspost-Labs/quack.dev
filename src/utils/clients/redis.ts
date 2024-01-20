import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: 'https://whole-flamingo-47060.upstash.io',
  token: process.env.REDIS_TOKEN as string
})

export default redis;