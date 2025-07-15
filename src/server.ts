import fastify from 'fastify'
import { knex } from './database'
import { env } from './env'

const app = fastify()

app.get('/hello', async () => {
  const users = await knex('users').where('id', 1).select('*')
  return users
})

app
  .listen({
    port: Number(env.PORT) || 3333,
  })
  .then(() => {
    console.log('Server is running on http://localhost:3333')
  })
