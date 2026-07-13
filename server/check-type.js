require('dotenv').config()
const knexfile = require('./knexfile')
const knex = require('knex')(knexfile.production)

knex.raw("SHOW COLUMNS FROM users WHERE Field = 'id'")
  .then(result => {
    console.log(result[0])
    return knex.destroy()
  })