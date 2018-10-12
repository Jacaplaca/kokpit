module.exports = (sequelize, Sequelize) => {
  const OverduePayments = sequelize.define(
    "overdue_payments",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      date_of_issue: {
        type: Sequelize.DATE
      },
      deadline: {
        type: Sequelize.DATE
      },
      nr_document: {
        type: Sequelize.STRING
      },
      gross_amount: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      id_customer_client: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      id_user: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      sent: {
        type: Sequelize.TINYINT
      }
    },
    {
      freezeTableName: true
    }
  );

  return OverduePayments;
};

// module.exports = User;
