module.exports = (sequelize, Sequelize) => {
  const ChannelsConfigNew = sequelize.define(
    "channels_config_new",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      from: {
        type: Sequelize.DATE
      },
      to: {
        type: Sequelize.DATE
      },
      bonusType: {
        type: Sequelize.STRING
      },
      bonus: {
        type: Sequelize.DECIMAL(10, 4)
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

  return ChannelsConfigNew;
};
