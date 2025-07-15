import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/hello', async () => {
    const users = await knex('users').where('id', 1).select('*')
    return users
  })

  app.get('/users', async () => {
    const users = await knex('users').select('*')
    return users
  })
}
