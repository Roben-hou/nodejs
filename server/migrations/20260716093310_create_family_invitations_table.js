exports.up = function(knex) {
    return knex.schema.createTable('family_invitations', (table) => {
        table.increments('id').primary();
        table.integer('family_id').references('id').inTable('families').onDelete('CASCADE').unsigned();
        table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').unsigned();
        table.string('status').notNullable().defaultTo('pending');
        table.string('type').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('family_invitations');
};