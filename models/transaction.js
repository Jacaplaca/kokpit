module.exports = (sequelize, Sequelize) => {
  const Transaction = sequelize.define(
    "transactions",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      customer: {
        type: Sequelize.STRING
      },
      cityName: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      item: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      name: {
        type: Sequelize.STRING,
        defaultValue: 1
      },
      quantity: {
        type: Sequelize.FLOAT,
        // type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      buy: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      sell: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      marginUnit: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      month: {
        type: Sequelize.STRING,
        defaultValue: 1
      },
      unit: {
        type: Sequelize.STRING,
        defaultValue: 1
      },
      key: {
        type: Sequelize.STRING,
        defaultValue: 1
      },
      bonusType: {
        type: Sequelize.STRING,
        defaultValue: 1
      },
      bonusUnit: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      bonus: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      gross: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      grossMargin: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      clientId: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      userId: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      }
    },
    {
      freezeTableName: true
    }
  );

  return Transaction;
};

// module.exports = User;
