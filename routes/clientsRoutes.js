const db = require("../models/index");
const Client = db.clients;
const Sequelize = require("sequelize");
const passport = require("passport");
const Op = Sequelize.Op;
// let email = '';
// let errorsy = [];
const to = require("await-to-js").default;
module.exports = app => {
  app.get("/api/client/", async (req, res, next) => {
    const { clientId, user_id } = req.user;
    console.log("get api/client", clientId);
    if (!req.user) {
      return res.redirect("/");
    }
    const [errClient, client] = await to(Client.findByPk(clientId));
    if (!client) {
      console.log("errClient", errClient);
      res.sendStatus(500);
    } else {
      console.log("client", client);

      res.json(client);
    }
  });

  app.put("/api/client/", async (req, res, next) => {
    // console.log("api/transaction/");
    // console.log(req.body);
    const { file, name } = req.body;
    // const { id } = req.params;
    const { clientId, user_id } = req.user;
    console.log("put api/client", file, clientId);
    if (!req.user) {
      return res.redirect("/");
    }

    const [errClient, client] = await to(
      Client.update(
        { logo: file, name },
        {
          where: { id: clientId }
        }
      )
    );
    if (!client) {
      console.log("errClient", errClient);
      res.sendStatus(500);
    } else {
      console.log("client", client);
      res.json(client);
    }
  });
};
