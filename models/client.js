module.exports = (sequelize, Sequelize) => {
  const Client = sequelize.define(
    "clients",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      logo: {
        type: Sequelize.STRING
      },
      currency: {
        type: Sequelize.STRING
      },
      nextReportsLink: {
        type: Sequelize.STRING
      },
      accountType: {
        type: Sequelize.STRING
      }
    },
    {
      freezeTableName: true
    }
  );

  return Client;
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
