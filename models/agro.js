module.exports = (sequelize, Sequelize) => {
  const Agro = sequelize.define(
    "agros",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      model: {
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

  return Agro;
};

// module.exports = User;
