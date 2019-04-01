module.exports = (sequelize, Sequelize) => {
  const Harvester = sequelize.define(
    "harvesters",
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

  return Harvester;
};

// module.exports = User;
