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

const connectedModules = [
  // {
  //   id: 24,
  //   modules: [3, 17]
  // }
  // {
  //   id: 20,
  //   modules: [26, 27]
  // }
];

const addModules = async (user_id, module, add) => {
  console.log("addModules", module, add);
  let modules = connectedModules.filter(x => x.id === Math.trunc(module));
  modules = modules.length > 0 ? modules[0].modules : [];
  modules.push(Math.trunc(module));
  let errAdding, adding;
  console.log("modules", modules);
  const ops = modules.map(async x => {
    [errAdding, adding] = await to(
      add
        ? ModuleUser.create({ user_id, module_id: x })
        : ModuleUser.destroy({ where: { user_id, module_id: x } })
    );
  });
  await Promise.all(ops);
  return { errAdding, adding };
};

module.exports = app => {
  //adding user to channel
  app.post("/api/module/:module_id/user/:user_id", async (req, res) => {
    // if (!req.user) res.redirect("/");
    // const { clientId, role } = req.user;
    //
    // let adding
    const { module_id, user_id } = req.params;
    // let errAdding
    // console.log("channel_id user_id", channel_id, user_id);

    const [errMC, mu] = await to(
      ModuleUser.findAll({ where: { user_id, module_id } })
    );

    if (mu.length === 0) {
      // const [errAdding, adding] = await to(
      //   ModuleUser.create({ user_id, module_id })
      // );
      const add = await addModules(user_id, module_id, true);
      const { adding, errAdding } = add;
      // console.log("add", errAdding, adding);

      if (!adding) {
        res.sendStatus(500);
      } else {
        res.json(adding);
      }
    } else {
      const add = await addModules(user_id, module_id, false);
      const { adding, errAdding } = add;
      // console.log("add", errAdding, adding);
      // const [errAdding, adding] = await to(
      //   ModuleUser.destroy({ where: { user_id, module_id } })
      // );

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
