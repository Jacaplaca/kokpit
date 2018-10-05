module.exports = (sequelize, Sequelize) => {
  const Miejsce = sequelize.define(
    "miejsca",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      }
    },
    {
      //charset: "utf8",
      //collate: "utf8_unicode_ci",
      // collate: "utf8_polish_ci",
      freezeTableName: true
    }
  );

  return Miejsce;
};

// const Sequelize = require('sequelize');
// var connection = require('../db');
//
// var Client = connection.define(
//   'clients',
//   {
//     id: {
//       autoIncrement: true,
//       primaryKey: true,
//       type: Sequelize.INTEGER
//     },
//     name: {
//       type: Sequelize.STRING
//     }
//   },
//   {
//     freezeTableName: true
//   }
// );
//
// module.exports = Client;
