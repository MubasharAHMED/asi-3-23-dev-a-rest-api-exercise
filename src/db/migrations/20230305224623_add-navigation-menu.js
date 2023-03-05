export const up = async (knex) => {
  await knex.schema.createTable("navigationMenu", (table) => {
    table.increments("id")
    table.string("name").notNullable()
    table.text("listePages").notNullable()
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("navigationMenu")
}
