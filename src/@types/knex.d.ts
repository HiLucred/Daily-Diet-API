// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      created_at: string
      session_id?: string
    }

    meals: {
      id: string
      name: string
      description: string
      date: string
      time: string
      is_on_the_diet: boolean
      session_id: string
      created_at: string
      updated_at: string
    }
  }
}
