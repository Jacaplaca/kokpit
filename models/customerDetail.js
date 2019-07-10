module.exports = (sequelize, Sequelize) => {
  const CustomerDetail = sequelize.define(
    "customer_details",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      surname: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      field: {
        type: Sequelize.DECIMAL(10, 2)
      },
      meadow: {
        type: Sequelize.DECIMAL(10, 2)
      },
      cows: {
        type: Sequelize.INTEGER
      },
      pigs: {
        type: Sequelize.INTEGER
      },
      clientId: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      userId: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      customerId: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
    },
    {
      freezeTableName: true
    }
  );

  return CustomerDetail;
};

// module.exports = User;
