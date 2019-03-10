module.exports = (sequelize, Sequelize) => {
  const ChannelsConfig = sequelize.define(
    "channels_config",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      month: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      key: {
        type: Sequelize.STRING
      },
      bonusType: {
        type: Sequelize.STRING
      },
      bonus: {
        type: Sequelize.DECIMAL(10, 2)
      },
      clientId: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      channelId: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      itemId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Channels",
          key: "id"
        },
        allowNull: false
      },
      suffix: {
        type: Sequelize.STRING
      }
    },
    {
      freezeTableName: true
    }
  );

  return ChannelsConfig;
};
