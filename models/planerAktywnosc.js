module.exports = (sequelize, Sequelize) => {
  const PlanerAktywnosc = sequelize.define(
    "planer_aktywnosci",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      start: {
        type: Sequelize.DATE
      },
      stop: {
        type: Sequelize.DATE
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
      wyslano: {
        type: Sequelize.TINYINT
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      klient_id: {
        type: Sequelize.INTEGER
      }
    },
    {
      freezeTableName: true
    }
  );

  return PlanerAktywnosc;
};

// module.exports = User;
