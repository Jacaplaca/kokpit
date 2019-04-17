module.exports = (sequelize, Sequelize) => {
  const Items = sequelize.define(
    "items",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      unit: {
        type: Sequelize.STRING
      },
      clientId: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      // ddd: {
      //   type: Sequelize.INTEGER,
      //   defaultValue: 1
      // },
      order: {
        type: Sequelize.INTEGER
      }
    },
    {
      freezeTableName: true
    }
  );

  return Items;
};
