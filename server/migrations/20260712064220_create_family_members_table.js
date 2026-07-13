exports.up = function(knex) {
  return knex.schema.createTable('family_members', (table) => {
    table.increments('id').primary();
    table.integer('family_id').references('id').inTable('families').onDelete('CASCADE');
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.string('role').notNullable();
    table.timestamp('joined_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('family_members');
};