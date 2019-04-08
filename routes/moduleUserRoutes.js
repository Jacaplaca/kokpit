const db = require("../models/index");
// const User = db.users;

// const Channel = db.sales_channels;
const Module = db.modules;
const User = db.users;
// const Item = db.items;
const ModuleUser = db.modules_users;
// const ChannelUsers = db.channel_users;
// const ChannelsConfig = db.channels_config;
const to = require("await-to-js").default;

module.exports = app => {
  //adding user to channel
  app.post("/api/module/:module_id/user/:user_id", async (req, res) => {
    // if (!req.user) res.redirect("/");
    // const { clientId, role } = req.user;
    //
    const { module_id, user_id } = req.params;
    // console.log("channel_id user_id", channel_id, user_id);

    const [errMC, mu] = await to(
      ModuleUser.findAll({ where: { user_id, module_id } })
    );

    if (mu.length === 0) {
      const [errAdding, adding] = await to(
        ModuleUser.create({ user_id, module_id })
      );

      if (!adding) {
        res.sendStatus(500);
      } else {
        res.json(adding);
      }
    } else {
      const [errAdding, adding] = await to(
        ModuleUser.destroy({ where: { user_id, module_id } })
      );

      if (!mu) {
        res.sendStatus(500);
      } else {
        res.json(mu);
      }
    }
  });

  app.get("/api/modulesusers/:user_id", async (req, res) => {
    console.log("api/modulesusers");

    const { user_id } = req.params;

    // if (!req.user) res.redirect("/");
    // const { clientId, role, user_id } = req.user;
    // console.log("ChannelUsers", clientId, user_id);

    const [err, modules] = await to(
      Module.findAll({
        include: [
          {
            model: User,
            as: "ModuleUser",
            where: { id: user_id },
            attributes: []
          }
        ],
        where: {}
      })
    );
    // console.log("details", details, err);
    if (!modules) {
      res.sendStatus(500);
    } else {
      res.json(modules);
    }
  });
};
