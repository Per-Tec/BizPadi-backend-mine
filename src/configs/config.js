require("dotenv").config();

const {test_pg_uri} = process.env

module.exports = {
  "development": {
    "url": test_pg_uri,
    "dialect": "postgres",
    dialectOptions: { ssl: { require: true } },
  }
}