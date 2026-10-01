require('dotenv').config()
const app = require('./src/app')
const { sequelize } = require('./src/models')

const PORT = process.env.PORT || 5001

async function start() {
  try {
    await sequelize.authenticate()
    console.log(`Database connection established (${process.env.DB_DIALECT || 'mssql'}).`)

    // sync() auto-creates tables from the models above — convenient for
    // development. For a real production rollout, replace this with
    // Sequelize migrations so schema changes are tracked and reversible.
    await sequelize.sync()
    console.log('Models synced.')

    app.listen(PORT, () => {
      console.log(`FieldStock API running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

start()
