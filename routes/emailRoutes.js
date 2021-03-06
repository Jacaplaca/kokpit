const db = require("../models/index");
const User = db.users;

const to = require("await-to-js").default;
const sendAccountInfo = require("../email/accountInfo");

module.exports = app => {
  //remove configs

  app.post("/api/accountinfo/", async (req, res, next) => {
    console.log("api/accountinfo/");
    console.log(req.body);
    if (!req.user) {
      return res.redirect("/");
    }
    const { name, surname, email, password, ediadd } = req.body;
    const response = await sendAccountInfo({
      name,
      surname,
      email,
      password,
      ediadd
    });
    console.log("response", response);
    return res.json(response);
  });
};
