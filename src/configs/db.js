const { configDotenv } = require('dotenv')
const { Sequelize } = require('sequelize')

configDotenv()

const { test_pg_uri } = process.env

const db = {}

const sequelize = new Sequelize(test_pg_uri,{
    dialect: 'postgres',

    dialectOptions: {
      ssl: {
        require: true,
      },
    },
  })

const pgTest = async () => {
    try {
        await sequelize.authenticate()
        console.log('Connection to neon postgres database has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

pgTest()

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db