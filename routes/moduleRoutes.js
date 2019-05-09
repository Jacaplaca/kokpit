const db = require("../models/index");
// const User = db.users;

// const Channel = db.sales_channels;
const Module = db.modules;
const Client = db.clients;
// const User = db.users;
// const Item = db.items;
// const ModuleUser = db.modules_users;
// const ChannelUsers = db.channel_users;
// const ChannelsConfig = db.channels_config;
const to = require("await-to-js").default;

module.exports = app => {
  app.post("/api/remove/modules/:id", async (req, res, next) => {
    const { id } = req.params;
    const { clientId, user_id } = req.user;
    if (!req.user) {
      return res.redirect("/");
    }
    const [errRemoving, remove] = await to(Module.destroy({ where: { id } }));

    if (!remove) {
      res.sendStatus(500);
    } else {
      res.json(remove);
    }
  });

  app.post("/api/modules", (req, res, next) => {
    const { clientId, user_id } = req.user;
    if (!req.user) {
      return res.redirect("/");
    }
    Module.create(req.body)
      .then(results => {
        return res.json(results);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.get("/api/modules/", async (req, res) => {
    console.log("api/modules");

    // const { client_id } = req.params;

    if (!req.user) res.redirect("/");
    const { clientId, role, user_id } = req.user;
    console.log("ChannelUsers", clientId, user_id);

    const [err, details] = await to(
      // User.findAll({
      //   include: [
      //     {
      //       model: Module,
      //       as: "UserModule"
      //       // where: { id: clientId },
      //       // attributes: []
      //     }
      //   ],
      //   where: { clientId }
      // })
      Module.findAll({
        include: [
          {
            model: Client,
            as: "ModuleClient",
            where: { id: clientId },
            attributes: []
          }
        ],
        where: {}
      })
    );
    // console.log("details", details, err);
    if (!details) {
      res.sendStatus(500);
    } else {
      res.json(details);
    }
  });
  app.get("/api/allmodules/", async (req, res) => {
    // console.log("api/modules");
    if (!req.user) res.redirect("/");
    const { clientId, role, user_id } = req.user;

    const [err, details] = await to(
      Module.findAll({
        where: {}
      })
    );
    if (!details) {
      res.sendStatus(500);
    } else {
      res.json(details);
    }
  });

  app.get("/api/modulefirst/", async (req, res) => {
    console.log("api/modules");

    // const { client_id } = req.params;

    if (!req.user) res.redirect("/");
    const { clientId, role, user_id } = req.user;
    console.log("ChannelUsers", clientId, user_id);

    const [err, details] = await to(
      Module.findAll({
        where: { id: 1 }
      })
    );
    // console.log("details", details, err);
    if (!details) {
      res.sendStatus(500);
    } else {
      res.json(details);
    }
  });
};
