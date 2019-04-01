module.exports = (sequelize, Sequelize) => {
  const Cultivator = sequelize.define(
    "cultivators",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      brand: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      howMany: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      customerDetailsId: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
    },
    {
      freezeTableName: true
    }
  );

  return Cultivator;
};

// module.exports = User;
