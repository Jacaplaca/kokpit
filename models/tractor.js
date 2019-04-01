module.exports = (sequelize, Sequelize) => {
  const Tractor = sequelize.define(
    "tractors",
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

  return Tractor;
};

// module.exports = User;
