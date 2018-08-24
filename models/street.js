module.exports = (sequelize, Sequelize) => {
  const Street = sequelize.define(
    'gus_ulic',
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
      rodz_gmi: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      sym: {
        type: Sequelize.STRING
      },
      sym_ul: {
        type: Sequelize.STRING
      },
      cecha: {
        type: Sequelize.STRING
      },
      nazwa_1: {
        type: Sequelize.STRING
      },
      nazwa_2: {
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

  return Street;
};
