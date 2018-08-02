'use strict';

module.exports = {
  up: function(queryInterface, DataTypes) {
    return [
      queryInterface.addColumn('users', 'clientId', {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false
      })
    ];
  },

  down: function(queryInterface, Sequelize) {
    return [queryInterface.removeColumn('users', 'clientId')];
  }
};
