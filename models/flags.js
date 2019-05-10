module.exports = (sequelize, Sequelize) => {
  const Flag = sequelize.define(
    "flags",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      short: {
        type: Sequelize.STRING
      }
    },
    {
      //charset: "utf8",
      //collate: "utf8_unicode_ci",
      // collate: "utf8_polish_ci",
      freezeTableName: true
    }
  );

  return Flag;
};
