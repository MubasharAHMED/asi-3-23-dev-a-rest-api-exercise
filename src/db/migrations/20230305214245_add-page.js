export const up = async (knex) => {
  await knex.schema.createTable("pages", (table) => {
    table.increments("id")
    table.string("title").notNullable()
    table.text("content").notNullable()
    table.text("slug").notNullable()
    table
      .integer("creator_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
    table.integer("modifier_id").nullable().references("id").inTable("users")
    table.timestamp("published_at").nullable()
    table.text("status").notNullable()
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("pages")
}
