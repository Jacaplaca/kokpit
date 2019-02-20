module.exports = (sequelize, Sequelize) => {
  const Channels = sequelize.define(
    "sales_channels",
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

  return Channels;
};
