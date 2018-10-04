module.exports = (sequelize, Sequelize) => {
  const Cost = sequelize.define(
    "costs",
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nr_dokumentu: {
        type: Sequelize.STRING
      },
      data_wystawienia: {
        type: Sequelize.DATE
      },
      nazwa_pozycji: {
        type: Sequelize.STRING
      },
      kwota_netto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      kwota_brutto: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      categoryId: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      groupId: {
        type: Sequelize.INTEGER,
        defaultValue: 1
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

  return Cost;
};

// module.exports = User;
