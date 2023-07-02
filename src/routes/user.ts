import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function userRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies

    const user = await knex('users')
      .where('session_id', sessionId)
      .select()
      .first()

    return { user }
  })

  app.get(
    '/summary',
    { preHandler: [checkSessionIdExists] },
    async (request) => {
      const { sessionId } = request.cookies

      const totalMealsCount = await knex('meals')
        .where('session_id', sessionId)
        .select()

      const totalDietMealsCount = await knex('meals').where({
        session_id: sessionId,
        is_on_the_diet: true,
      })

      const totalMealsOutsideDietCount = await knex('meals').where({
        session_id: sessionId,
        is_on_the_diet: false,
      })

      const summary = {
        totalMealsCount: totalMealsCount.length,
        totalDietMealsCount: totalDietMealsCount.length,
        totalMealsOutsideDietCount: totalMealsOutsideDietCount.length,
      }

      return { summary }
    },
  )

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
    })

    const { name, email } = createUserBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()
      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId,
    })

    return reply.status(201).send()
  })
}
