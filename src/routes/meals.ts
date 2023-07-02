import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdExists] }, async (request) => {
    const { sessionId } = request.cookies

    let meals = await knex('meals').where('session_id', sessionId).select()

    const searchQuerySchema = z.object({
      search: z.string().optional(),
    })

    const { search } = searchQuerySchema.parse(request.query)

    if (search) {
      meals = await knex('meals')
        .where({ id: search, session_id: sessionId })
        .select()
    }

    return { meals }
  })

  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const createANewMealSchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string().datetime(),
        isOnTheDiet: z.boolean(),
      })

      const { isOnTheDiet, ...dataFromBody } = createANewMealSchema.parse(
        request.body,
      )

      const { sessionId } = request.cookies

      await knex('meals').insert({
        id: randomUUID(),
        is_on_the_diet: isOnTheDiet,
        session_id: sessionId,
        ...dataFromBody,
      })

      return reply.status(201).send()
    },
  )

  app.put(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const updateMealSchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string().datetime(),
        isOnTheDiet: z.boolean(),
      })

      const { isOnTheDiet, ...dataFromBody } = updateMealSchema.parse(
        request.body,
      )

      const updateMealQuerySchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = updateMealQuerySchema.parse(request.params)

      const { sessionId } = request.cookies

      const meal = await knex('meals')
        .where({
          id,
          session_id: sessionId,
        })
        .select()

      if (meal.length === 0) {
        return reply.status(404).send()
      }

      await knex('meals')
        .where({ id, session_id: sessionId })
        .update({
          is_on_the_diet: isOnTheDiet,
          updated_at: knex.fn.now(),
          ...dataFromBody,
        })

      return reply.status(201).send()
    },
  )

  app.delete(
    '/:id',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const deleteMealQuerySchema = z.object({
        id: z.string().uuid(),
      })
      const { id } = deleteMealQuerySchema.parse(request.params)

      const { sessionId } = request.cookies

      await knex('meals').where({ id, session_id: sessionId }).delete()

      return reply.status(204).send()
    },
  )
}
