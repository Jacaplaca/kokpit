module.exports = (sequelize, Sequelize) => {
  const Terc = sequelize.define(
    'gus_terc',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      rodz: {
        type: Sequelize.STRING
      },
      nazwa: {
        type: Sequelize.STRING
      },
      nazwa_dod: {
        type: Sequelize.STRING
      },
      stan_na: {
        type: Sequelize.DATE
      }
    },
    {
      freezeTableName: true
    }
  );

  return Terc;
};
