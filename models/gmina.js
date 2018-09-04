module.exports = (sequelize, Sequelize) => {
  const Gmina = sequelize.define(
    "gus_terc",
    {
      id: {
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      nazwa: {
        type: Sequelize.STRING
      },
      woj: {
        type: Sequelize.STRING
      },
      pow: {
        type: Sequelize.STRING
      },
      gmi: {
        type: Sequelize.STRING
      },
      woj_pow_gmi: {
        type: Sequelize.STRING
      }
    },
    {
      freezeTableName: true
    }
  );

  return Gmina;
};
