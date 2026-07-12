exports.up = function(knex) {
  return knex.schema.alterTable('records', (table) => {
    table.integer('family_id').unsigned().nullable().references('id').inTable('families').onDelete('SET NULL');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('records', (table) => {
    table.dropColumn('family_id');
  });
};