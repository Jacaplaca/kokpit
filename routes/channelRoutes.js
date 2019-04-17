const db = require("../models/index");
const User = db.users;

const Channel = db.sales_channels;

const to = require("await-to-js").default;

module.exports = app => {
  //remove configs

  app.get("/api/channels", (req, res) => {
    const table = req.params;
    if (!req.user || req.user.role !== "master") {
      return res.redirect("/");
    }
    const { clientId, role, user_id } = req.user;
    Channel.findAll({ where: { clientId } })
      .then(result => res.json(result))
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.post("/api/channel/", (req, res, next) => {
    console.log("api/sales_channel/");
    console.log(req.body);
    const { clientId, user_id } = req.user;
    if (!req.user) {
      return res.redirect("/");
    }
    const form = Object.assign(req.body, { clientId, userId: user_id });
    // const form = Object.assign(req.body, { clientId: 2 });
    Channel.create(form)
      .then(results => {
        // console.log("res", results.dataValues.id);
        return res.json(results);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.post("/api/channel/edit/id/:id", (req, res, next) => {
    const id = req.params.id;
    console.log("edytuje channel api,", id, req.body);
    if (!req.user) {
      console.log("przekierowanie");
      return res.redirect("/");
    }
    const { user_id, clientId } = req.user;
    const form = Object.assign(req.body, { clientId, userId: user_id });
    // console.log(req.body);
    Channel.update(form, {
      where: { clientId, id }
    })
      .then(result => res.json(result))
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.post("/api/channel/destroy/:id", (req, res, next) => {
    const id = req.params.id;
    if (!req.user) {
      return res.redirect("/");
    }
    const { user_id, clientId } = req.user;
    console.log("channel remove id", id.split(","));
    Channel.destroy({ where: { clientId, id: id.split(",") } })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });
};
