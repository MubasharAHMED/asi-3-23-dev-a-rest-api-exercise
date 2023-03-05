export const up = async (knex) => {
  await knex.schema.createTable("users", (table) => {
    table.increments("id")
    table.text("email").notNullable().unique()
    table.text("firstName").notNullable()
    table.text("lastName").notNullable()
    table.text("password").notNullable()
    table.text("role").notNullable()
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("users")
}
