module.exports = (sequelize, Sequelize) => {
  const ChannelsItems = sequelize.define(
    "channels_items",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      unit: {
        type: Sequelize.STRING
      },
      clientId: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      channelId: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
    },
    {
      freezeTableName: true
    }
  );

  return ChannelsItems;
};
