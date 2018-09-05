module.exports = (sequelize, Sequelize) => {
  const PlanerRodzajeAktywnosci = sequelize.define(
    "planer_akt_rodz",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      clientId: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
    },
    {
      freezeTableName: true
    }
  );

  return PlanerRodzajeAktywnosci;
};
