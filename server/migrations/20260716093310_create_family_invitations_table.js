async function isUnsigned(knex, tableName) {
  const [rows] = await knex.raw(
    `SELECT COLUMN_TYPE
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = 'id'`,
    [tableName]
  )

  if (!rows.length) {
    throw new Error(`${tableName}.id 不存在`)
  }

  return rows[0].COLUMN_TYPE.toLowerCase().includes('unsigned')
}

exports.up = async function (knex) {
  const familyIdUnsigned = await isUnsigned(knex, 'families')
  const userIdUnsigned = await isUnsigned(knex, 'users')

  return knex.schema.createTable('family_invitations', (table) => {
    table.increments('id').primary()

    const familyId = table.integer('family_id')
    if (familyIdUnsigned) familyId.unsigned()
    familyId.references('id').inTable('families').onDelete('CASCADE')

    const userId = table.integer('user_id')
    if (userIdUnsigned) userId.unsigned()
    userId.references('id').inTable('users').onDelete('CASCADE')

    table.string('status').notNullable().defaultTo('pending')
    table.string('type').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('family_invitations')
}