'use strict';

module.exports = {
  up: function(queryInterface, DataTypes) {
    return [
      queryInterface.addColumn('users', 'password', {
        type: DataTypes.STRING,
        allowNull: false
      }),
      queryInterface.addColumn('users', 'status', {
        type: DataTypes.ENUM('active', 'inactive'),
        defaultValue: 'active',
        allowNull: true
      })
    ];
  },

  down: function(queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('users', 'password'),
      queryInterface.removeColumn('users', 'status')
    ];
  }
};
