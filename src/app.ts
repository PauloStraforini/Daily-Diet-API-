import cookie from '@fastify/cookie'
import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import mealsRoutes from './routes/meals'

export const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: '/users',
})

app.register(mealsRoutes, {
  prefix: '/meals',
})
