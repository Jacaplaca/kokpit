const db = require("../models/index");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const User = db.users;
const Invoices4SMS = db.invoices4sms_intf;
const to = require("await-to-js").default;
// const sendAccountInfo = require("../email/accountInfo");

module.exports = app => {
  //remove configs

  app.get("/api/invoices/", async (req, res, next) => {
    const { clientId, user_id, id_client_soft } = req.user;
    console.log("api/invoices/", clientId, user_id, id_client_soft);

    Invoices4SMS.findAll({
      where: {
        // nr_pelny: { [Op.not]: sentNumbers },
        termin_platnosci: {
          [Op.lt]: new Date(new Date() - 15 * 24 * 60 * 60 * 1000)
          // [Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
        },
        // pozostalo_do_zaplacenia: {
        //   [Op.gt]: 1
        // }
        id_pracownik: id_client_soft
      }
      // raw: true
    }).then(response => {
      // console.log("sentInvoices", sentInvoices.length);
      return res.json(response);
    });

    // console.log(req.body);
    // const { clientId, user_id } = req.user;
    // if (!req.user) {
    //   return res.redirect("/");
    // }
    // const { name, surname, email, password, ediadd } = req.body;
    // const response = await sendAccountInfo({
    //   name,
    //   surname,
    //   email,
    //   password,
    //   ediadd
    // });
    // console.log("response", response);
    // return res.json(response);
  });
};
