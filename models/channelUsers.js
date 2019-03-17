module.exports = (sequelize, Sequelize) => {
  const ChannelUsers = sequelize.define(
    "channel_users",
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
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
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

  return ChannelUsers;
};
