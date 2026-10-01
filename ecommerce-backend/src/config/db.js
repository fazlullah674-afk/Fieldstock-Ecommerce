const { Sequelize } = require('sequelize')
require('dotenv').config()

const dialect = process.env.DB_DIALECT || 'mssql'

let sequelize

if (dialect === 'sqlite') {
  // Used for local development/testing without a SQL Server instance.
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || './dev.sqlite',
    logging: false,
  })
} else {
  // Production path: Microsoft SQL Server.
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 1433,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
      },
    },
    logging: false,
  })
}

module.exports = sequelize
