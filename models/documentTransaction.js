module.exports = (sequelize, Sequelize) => {
  const DocumentTransaction = sequelize.define(
    "documents_transactions",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      documents_nr: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      ammount_netto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
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

  return DocumentTransaction;
};

// module.exports = User;
