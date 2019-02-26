module.exports = (sequelize, Sequelize) => {
  const Invoices4SMS = sequelize.define(
    "invoices4sms_intf",
    {
      id_client: {
        type: Sequelize.INTEGER
      },
      nr_pelny: {
        primaryKey: true,
        type: Sequelize.STRING
      },
      data_wystawienia: {
        type: Sequelize.DATE
      },
      termin_platnosci: {
        type: Sequelize.DATE
      },
      id_pracownik: {
        type: Sequelize.INTEGER
      },
      imie_pracownika: {
        type: Sequelize.STRING
      },
      nazwisko_pracownika: {
        type: Sequelize.STRING
      },
      klient: {
        type: Sequelize.STRING
      },
      wartosc_brutto: {
        type: Sequelize.DOUBLE
      },
      status_platnosci: {
        type: Sequelize.STRING
      },
      pozostalo_do_zaplacenia: {
        type: Sequelize.DOUBLE
      }
    },
    {
      freezeTableName: true
    }
  );

  return Invoices4SMS;
};

// module.exports = User;
