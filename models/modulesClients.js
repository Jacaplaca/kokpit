module.exports = (sequelize, Sequelize) => {
  const ModulesClients = sequelize.define(
    "modules_clients",
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
      client_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Client",
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

  return ModulesClients;
};
