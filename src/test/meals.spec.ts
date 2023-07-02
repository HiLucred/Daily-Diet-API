import { it, beforeAll, beforeEach, afterAll, describe, expect } from 'vitest'
import { app } from '../app'
import request from 'supertest'
import { execSync } from 'child_process'

describe('Meals routes', () => {
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

  it('shouble be able to create a new meal', async () => {
    const createANewUser = await request(app.server).post('/user').send({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
    })

    const cookies = createANewUser.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Lasanha de Beringela',
        description:
          'Lasanha vegana cremosa feita de beringela e queijo de castanha.',
        date: '2023-06-30T20:36:08Z',
        isOnTheDiet: false,
      })
      .expect(201)
  })

  it('shouble be able to list all meals', async () => {
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

    const listAllMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listAllMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        name: 'Lasanha de Beringela',
        description:
          'Lasanha vegana cremosa feita de beringela e queijo de castanha.',
      }),
    ])
  })

  it('shouble be able to update a meal', async () => {
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

    const listAllMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    const mealId = listAllMealsResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        name: 'Macarrão',
        description:
          'Macarrão cremoso estilo italiano feito com almondegas de soja.',
        date: '2023-07-03T21:10:00Z',
        isOnTheDiet: false,
      })
      .expect(201)
  })

  it('shouble be able to delete a meal', async () => {
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

    const listAllMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    const mealId = listAllMealsResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(204)
  })
})
