require('dotenv').config()
const knex = require('knex')(require('./knexfile').development)

async function check() {
  const familiesId = await knex.raw("SHOW COLUMNS FROM families WHERE Field = 'id'")
  console.log('families.id:', familiesId[0])
  const usersId = await knex.raw("SHOW COLUMNS FROM users WHERE Field = 'id'")
console.log('users.id:', usersId[0])
  await knex.destroy()
}
check()