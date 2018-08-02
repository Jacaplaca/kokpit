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

var Article = connection.define('article', {
  title: Sequelize.STRING,
  body: Sequelize.TEXT
});

// connection.sync().then(function() {
//   Article.create({
//     title: 'demo2',
//     body: 'adfas'
//   });
// });

module.exports = connection;
