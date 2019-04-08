module.exports = (sequelize, Sequelize) => {
  const ModulesUsers = sequelize.define(
    "modules_users",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      module_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Module",
          key: "id"
        },
        allowNull: false
        // defaultValue: 1
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "User",
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

  return ModulesUsers;
};
