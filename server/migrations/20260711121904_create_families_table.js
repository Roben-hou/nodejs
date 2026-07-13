exports.up = function(knex) {
  return knex.schema.createTable('families', (table) => {
    table.increments('id').primary()
    table.string('name').notNullable()
    table.integer('created_by').unsigned().references('id').inTable('users')
    table.timestamp('created_at').unsigned().defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('families')
}
