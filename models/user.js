const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
var connection = require('./dbcred');

var User = connection.define(
  'users',
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    // firstname: {
    //     type: Sequelize.STRING,
    //     notEmpty: true
    // },
    // lastname: {
    //     type: Sequelize.STRING,
    //     notEmpty: true
    // },
    // username: {
    //     type: Sequelize.TEXT
    // },
    // about: {
    //     type: Sequelize.TEXT
    // },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true
        // unique: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    resetPasswordToken: {
      type: Sequelize.STRING
    },
    resetPasswordExpires: {
      type: Sequelize.STRING
    },
    last_login: {
      type: Sequelize.DATE
    },
    status: {
      type: Sequelize.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  },
  {
    freezeTableName: true
  }
);

module.exports = User;
