const db = require("../models/index");
const Client = db.clients;
const Sequelize = require("sequelize");
const passport = require("passport");
const fs = require("fs");
const path = require("path");
const Op = Sequelize.Op;
// let email = '';
// let errorsy = [];
const to = require("await-to-js").default;
module.exports = app => {
  app.get("/api/client/", async (req, res, next) => {
    const { clientId } = req.user;
    console.log("get api/client", clientId);
    if (!req.user) {
      return res.redirect("/");
    }
    const [errClient, client] = await to(Client.findByPk(clientId));
    if (!client) {
      console.log("errClient", errClient);
      res.sendStatus(500);
    } else {
      // console.log("client", client);

      res.json(client);
    }
  });

  app.put("/api/client/", async (req, res, next) => {
    // console.log("api/transaction/");
    // console.log(req.body);
    const { file, name, currency } = req.body;
    // const { id } = req.params;
    const { clientId } = req.user;
    console.log("put api/client", file, clientId);
    const newName = file ? file.split("/")[1] : null;
    if (!req.user) {
      return res.redirect("/");
    }

    const [errShowClient, showClient] = await to(
      Client.findByPk(clientId, { raw: true })
    );
    // console.log("showClient logo", showClient.logo);
    const pathWithName = showClient.logo;
    const oldName = pathWithName ? pathWithName.split("/")[1] : null;
    console.log("name", oldName);

    if (newName !== oldName) {
      console.log(newName, oldName);
      // path.join(__dirname, `/../client/src/images/${newFileName}`),
      fs.unlink(
        path.join(__dirname, `/../client/src/images/${oldName}`),
        err => {
          if (err) {
            console.error(err);
            return;
          }

          //file removed
        }
      );
    }

    const [errClient, client] = await to(
      Client.update(
        { logo: file, name, currency },
        {
          where: { id: clientId }
        }
      )
    );
    if (!client) {
      console.log("errClient", errClient);
      res.sendStatus(500);
    } else {
      // console.log("client", client);
      res.json(client);
    }
  });
};
