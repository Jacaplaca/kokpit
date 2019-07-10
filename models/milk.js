module.exports = (sequelize, Sequelize) => {
  const Milk = sequelize.define(
    "milks",
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

  return Milk;
};

// module.exports = User;
