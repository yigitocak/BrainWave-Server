/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async(knex) => {
    return knex.schema.createTable("users", table => {
        table.increments("id").primary();
        table.string("email", 255).notNullable().unique()
        table.string("name",255).notNullable()
        table.string("password",255).notNullable()
        table.timestamp("created_at").defaultTo(knex.fn.now());
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async(knex) => {
  return knex.schema.dropTable("users")
};
