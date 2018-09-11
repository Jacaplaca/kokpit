module.exports = (sequelize, Sequelize) => {
  const PlanerRaport = sequelize.define(
    "planer_raporty",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      kiedy: {
        type: Sequelize.DATE
      },
      start: {
        type: Sequelize.TEXT
      },
      stop: {
        type: Sequelize.TEXT
      },
      miejsce_id: {
        type: Sequelize.INTEGER
      },
      aktywnosc_id: {
        type: Sequelize.INTEGER
      },
      inna: {
        type: Sequelize.TEXT
      },
      uwagi: {
        type: Sequelize.TEXT
      },
      nawozy: {
        type: Sequelize.TINYINT
      },
      nowyklient: {
        type: Sequelize.TINYINT
      },
      sprzedaz: {
        type: Sequelize.TINYINT
      },
      zamowienie: {
        type: Sequelize.TINYINT
      },
      zboza: {
        type: Sequelize.TINYINT
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      planer_klienci_id: {
        type: Sequelize.INTEGER
      },
      firma_id: {
        type: Sequelize.INTEGER
      }
    },
    {
      freezeTableName: true
    }
  );

  return PlanerRaport;
};

// module.exports = User;
