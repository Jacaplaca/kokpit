module.exports = (sequelize, Sequelize) => {
  const PlanerKlient = sequelize.define(
    "planer_klienci",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nazwa: {
        type: Sequelize.TEXT
      },
      adr_Kod: {
        type: Sequelize.TEXT
      },
      adr_Miejscowosc: {
        type: Sequelize.TEXT
      },
      kh_id: {
        type: Sequelize.TEXT
      },
      clientId: {
        type: Sequelize.INTEGER
      }
    },
    {
      freezeTableName: true
    }
  );

  return PlanerKlient;
};

// module.exports = User;
