exports.up = function(knex) {
  return knex.schema.dropTableIfExists('families');
};

exports.down = function(knex) {
  return Promise.resolve();
};
