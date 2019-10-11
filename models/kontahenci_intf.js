module.exports = (sequelize, Sequelize) => {
  const KontrahenciINTF = sequelize.define(
    "kontrahenci_intf",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      symbol: {
        type: Sequelize.TEXT
      },
      kod: {
        type: Sequelize.TEXT
      },
      miejscowosc: {
        type: Sequelize.TEXT
      },
      client_id: {
        type: Sequelize.INTEGER
      }
    },
    {
      freezeTableName: true
    }
  );

  return KontrahenciINTF;
};

// module.exports = User;
