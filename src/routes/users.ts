import { checkSessionIdExists } from '../middlewares/check-session-id-exits'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { z } from 'zod'

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const createUserBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
      })

      const { name, email } = createUserBodySchema.parse(request.body)

      let sessionId = request.cookies.session_id

      if (!sessionId) {
        sessionId = randomUUID()

        reply.cookie('session_id', sessionId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        })
      }

      await knex('users').insert({
        id: crypto.randomUUID(),
        name,
        email,
        session_id: crypto.randomUUID(),
      })

      return reply.status(201).send()
    },
  )

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const users = await knex('users').where('session_id', sessionId).select()
      return { users }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getUserParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getUserParamsSchema.parse(request.params)

      const { sessionId } = request.cookies

      const user = await knex('users')
        .where({
          session_id: sessionId,
          id,
        })
        .andWhere('session_id', sessionId)
        .first()

      return { user }
    },
  )
}

// import { FastifyInstance } from 'fastify'
// import { z } from 'zod'
// import { knex } from '../database'
// import { randomUUID } from 'node:crypto'

// export async function usersRoutes(app: FastifyInstance) {
//   app.post('/', async (request, reply) => {
//     const createUserBodySchema = z.object({
//       name: z.string(),
//       email: z.string().email(),
//     })

//     let sessionId = request.cookies.sessionId

//     if (!sessionId) {
//       sessionId = randomUUID()

//       reply.setCookie('sessionId', sessionId, {
//         path: '/',
//         maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
//       })
//     }

//     const { name, email } = createUserBodySchema.parse(request.body)

//     const userByEmail = await knex('users').where({ email }).first()

//     if (userByEmail) {
//       return reply.status(400).send({ message: 'User already exists' })
//     }

//     await knex('users').insert({
//       id: randomUUID(),
//       name,
//       email,
//       session_id: sessionId,
//     })

//     return reply.status(201).send()
//   })
// }
