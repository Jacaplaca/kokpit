module.exports = (sequelize, Sequelize) => {
  const Module = sequelize.define(
    "modules",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      name_en: {
        type: Sequelize.STRING
      },
      comp: {
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

  return Module;
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
