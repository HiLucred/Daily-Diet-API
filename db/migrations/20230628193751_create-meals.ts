import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', async (table) => {
    table.uuid('id').notNullable().primary()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.datetime('date').notNullable()
    table.boolean('is_on_the_diet').notNullable()
    table.uuid('session_id').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
