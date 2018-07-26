const Sequelize = require('sequelize');
var connection = require('./dbcred');

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

module.exports = Article;
