import { beforeAll, afterAll, describe, it, beforeEach, expect } from 'vitest'
import { execSync } from 'node:child_process'
import request from 'supertest'
import { app } from '../app'

describe('Users routes', () => {
  execSync('npm run knex migrate:latest')

  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Paulo Straforini',
        email: 'paulo.straforini@example.com',
      })
      .expect(201)
  })

  it('should be able to list all users', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'Paulo Straforini',
      email: 'paulo.straforini@example.com',
    })

    const cookies = createUserResponse.get('Set-Cookie')

    const listUsersResponse = await request(app.server)
      .get('/users')
      .set('Cookie', cookies)
      .expect(200)
    expect(listUsersResponse.body.users).toEqual([
      expect.objectContaining({
        name: 'Paulo Straforini',
        email: '',
      }),
    ])
  })
})
