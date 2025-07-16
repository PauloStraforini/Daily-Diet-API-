// import { FastifyInstance } from 'fastify'
// import { z } from 'zod'
// import { randomUUID } from 'node:crypto'
// import { knex } from '../database'

// export default function mealsRoutes(app: FastifyInstance) {
//   app.post('/', async (request, reply) => {
//     const createMealBodySchema = z.object({
//       name: z.string(),
//       description: z.string(),
//       is_diet: z.boolean(),
//       date: z.string().datetime(),
//     })

//     const { name, description, isOnDiet, date } = createMealBodySchema.parse(
//       request.body,
//     )

//     await knex('meals').insert({
//       id: randomUUID(),
//       name,
//       description,
//       is_on_diet: isOnDiet,
//       date: date.getTime(),
//       user_id: request.user?.id,
//     })

//     reply.status(201).send()
//   })
// }
