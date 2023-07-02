import { it, beforeAll, beforeEach, afterAll, describe, expect } from 'vitest'
import { app } from '../app'
import request from 'supertest'
import { execSync } from 'child_process'

describe('User routes', () => {
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

  it('shouble be able to get info about the user', async () => {
    const createANewUser = await request(app.server).post('/user').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
    })

    const cookies = createANewUser.get('Set-Cookie')

    const infoAboutUserResponse = await request(app.server)
      .get('/user')
      .set('Cookie', cookies)

    expect(infoAboutUserResponse.body.user).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
      }),
    )
  })

  it('shouble be able to create a new user', async () => {
    await request(app.server)
      .post('/user')
      .send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
      })
      .expect(201)
  })

  it('shouble be able to get the summary', async () => {
    const createANewUser = await request(app.server).post('/user').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
    })

    const cookies = createANewUser.get('Set-Cookie')

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Lasanha de Beringela',
      description:
        'Lasanha vegana cremosa feita de beringela e queijo de castanha.',
      date: '2023-06-30T20:36:08Z',
      isOnTheDiet: false,
    })

    await request(app.server).post('/meals').set('Cookie', cookies).send({
      name: 'Feijão e Arroz',
      description: 'Tradicional arroz com feijão no almoço.',
      date: '2023-07-30T20:36:08Z',
      isOnTheDiet: true,
    })

    const summaryResponse = await request(app.server)
      .get('/user/summary')
      .set('Cookie', cookies)

    expect(summaryResponse.body.summary).toEqual({
      totalMealsCount: 2,
      totalDietMealsCount: 1,
      totalMealsOutsideDietCount: 1,
    })
  })
})
