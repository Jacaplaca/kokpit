module.exports = (sequelize, Sequelize) => {
  const Invoices4SMSsent = sequelize.define(
    "invoices4sms_sent",
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      id_client: {
        type: Sequelize.INTEGER
      },
      nr_document: {
        primaryKey: true,
        type: Sequelize.STRING
      },
      date_issue: {
        type: Sequelize.DATE
      },
      deadline: {
        type: Sequelize.DATE
      },
      id_client_soft: {
        type: Sequelize.INTEGER
      },
      name_emp: {
        type: Sequelize.STRING
      },
      surname_emp: {
        type: Sequelize.STRING
      },
      debtor: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DOUBLE
      },
      status: {
        type: Sequelize.STRING
      },
      remained: {
        type: Sequelize.DOUBLE
      }
    },
    {
      freezeTableName: true
    }
  );

  return Invoices4SMSsent;
};

// module.exports = User;
