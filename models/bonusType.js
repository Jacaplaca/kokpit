module.exports = (sequelize, Sequelize) => {
  const BonusType = sequelize.define(
    "bonus_type",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      suffix: {
        type: Sequelize.STRING
      }
    },
    {
      freezeTableName: true
    }
  );

  return BonusType;
};
