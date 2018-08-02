'use strict';

module.exports = {
  up: function(queryInterface, DataTypes) {
    return [
      queryInterface.addColumn('users', 'resetPasswordToken', {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('users', 'resetPasswordExpires', {
        type: DataTypes.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('users', 'last_login', {
        type: DataTypes.DATE,
        allowNull: true
      })
    ];
  },

  down: function(queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('users', 'resetPasswordToken'),
      queryInterface.removeColumn('users', 'resetPasswordExpires'),
      queryInterface.removeColumn('users', 'last_login')
    ];
  }
};
