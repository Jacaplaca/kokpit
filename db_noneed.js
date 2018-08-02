const Sequelize = require('sequelize');
require('dotenv').config();
// const mysql = require('mysql2');

const connection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    operatorsAliases: false
  }
);

module.exports = connection;
