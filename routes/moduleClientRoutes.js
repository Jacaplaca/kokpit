const db = require("../models/index");
const User = db.users;

// const Channel = db.sales_channels;
const Module = db.modules;
const Client = db.clients;
// const Item = db.items;
const ModuleClient = db.modules_clients;
const ModuleUser = db.modules_users;
// const ChannelUsers = db.channel_users;
// const ChannelsConfig = db.channels_config;
const to = require("await-to-js").default;

module.exports = app => {
  //adding user to channel
  app.post("/api/module/:module_id/client/:client_id", async (req, res) => {
    // if (!req.user) res.redirect("/");
    // const { clientId, role } = req.user;
    //
    const { module_id, client_id } = req.params;

    const [errMC, mc] = await to(
      ModuleClient.findAll({ where: { client_id, module_id } })
    );

    if (mc.length === 0) {
      const [errAdding, adding] = await to(
        ModuleClient.create({ client_id, module_id })
      );

      if (!adding) {
        res.sendStatus(500);
      } else {
        res.json(adding);
      }
    } else {
      // const [errAdding, adding] = await to(
      //   ModuleClient.destroy({ where: { client_id, module_id } })
      // );
      // await disableModule(client_id, module_id)

      const [errDisableForUser, disableForUser] = await to(
        ModuleUser.destroy({
          include: [
            {
              model: Client,
              as: "ModuleClient",
              where: { id: client_id },
              attributes: []
            }
          ],
          where: { module_id }
          // where: { client_id, module_id }
        })
      );
      const [errDisableForClient, disableForClient] = await to(
        ModuleClient.destroy({ where: { client_id, module_id } })
      );

      if (!mc) {
        res.sendStatus(500);
      } else {
        res.json(mc);
      }
    }
  });

  app.get("/api/modulesclients/", async (req, res) => {
    console.log("api/modulesclients");

    // const { client_id } = req.params;

    if (!req.user) res.redirect("/");
    const { clientId, role } = req.user;
    console.log("ChannelUsers", clientId);

    const [err, details] = await to(
      User.findAll({
        include: [
          {
            model: Module,
            as: "UserModule"
            // where: { id: clientId },
            // attributes: []
          }
        ],
        where: { clientId }
      })
    );
    //   Module.findAll({
    //     include: [
    //       {
    //         model: Client,
    //         as: "ModuleClient",
    //         where: { id: clientId },
    //         attributes: []
    //       }
    //     ],
    //     where: {}
    //   })
    // );
    // console.log("details", details, err);
    if (!details) {
      res.sendStatus(500);
    } else {
      res.json(details);
    }
  });
};
