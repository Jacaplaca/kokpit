module.exports = (sequelize, Sequelize) => {
  const FlagsCustomers = sequelize.define(
    "flags_customers",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flag_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Flag",
          key: "id"
        },
        allowNull: false
        // defaultValue: 1
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "PlanerKlient",
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

  return FlagsCustomers;
};
