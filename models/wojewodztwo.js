module.exports = (sequelize, Sequelize) => {
  const Wojewodztwo = sequelize.define(
    "gus_terc_woj",
    {
      id: {
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      nazwa: {
        type: Sequelize.STRING
      }
    },
    {
      freezeTableName: true
    }
  );

  return Wojewodztwo;
};
