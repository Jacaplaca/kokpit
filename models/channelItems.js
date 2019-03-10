module.exports = (sequelize, Sequelize) => {
  const ChannelItems = sequelize.define(
    "channel_items",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      channel_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Channels",
          key: "id"
        },
        allowNull: false
        // defaultValue: 1
      },
      item_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Items",
          key: "id"
        },
        allowNull: false
        // defaultValue: 1
      }
    },
    {
      freezeTableName: true
    }
  );

  return ChannelItems;
};
