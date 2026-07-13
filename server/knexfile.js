require('dotenv').config()

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    },
    migrations: { directory: './migrations' }
  },
  production: {
    client: 'mysql2',
    connection: {
      host: 'reseau.proxy.rlwy.net',
      port: 59400,
      user: 'root',
      password: 'ddBhScKFfoWYZObUTBTcKmDaovYPWSxS',
      database: 'railway'
    },
    migrations: { directory: './migrations' }
  }
};