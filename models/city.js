module.exports = (sequelize, Sequelize) => {
  const City = sequelize.define(
    "gus_simc",
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
      rm: {
        type: Sequelize.STRING
      },
      mz: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      nazwa: {
        type: Sequelize.STRING
      },
      sym: {
        type: Sequelize.STRING
      },
      sympod: {
        type: Sequelize.STRING
      },
      stan_na: {
        type: Sequelize.DATE
      },
      woj_pow: {
        type: Sequelize.STRING
      },
      woj_pow_gmi: {
        type: Sequelize.STRING
      }
      // city_woj_pow: {
      //   type: new Sequelize.VIRTUAL(Sequelize.STRINGN, ["woj", "pow"]),
      //   get: function() {
      //     return this.get("woj") + this.get("pow");
      //   }
      // }
    },
    {
      freezeTableName: true
    }
  );

  return City;
};
