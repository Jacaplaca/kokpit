const db = require("../models/index");
const _ = require("lodash");
const User = db.users;
const PlanerKlienci = db.planer_klienci;
const CustomerDetail = db.customer_details;
const Tractor = db.tractors;
const Harvester = db.harvesters;
const Cultivator = db.cultivators;
const Agro = db.agros;

const to = require("await-to-js").default;

module.exports = app => {
  //remove configs

  // app.post("/api/item", (req, res, next) => {
  //   console.log("api/item/");
  //   console.log(req.body);
  //   const { channelId } = req.params;
  //   const { clientId, user_id } = req.user;
  //   if (!req.user) {
  //     return res.redirect("/");
  //   }
  //   const form = Object.assign(req.body, {
  //     clientId,
  //     userId: user_id,
  //     channelId
  //   });
  //   Item.create(form)
  //     .then(results => {
  //       return res.json(results);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       res.sendStatus(500);
  //     });
  // });
  //
  // app.post("/api/item/edit/id/:id", (req, res, next) => {
  //   console.log("/api/channel_item/edit/:id");
  //   const id = req.params.id;
  //   console.log("edytuje channel item api,", id, req.body);
  //   if (!req.user) {
  //     console.log("przekierowanie");
  //     return res.redirect("/");
  //   }
  //   const { user_id, clientId } = req.user;
  //   const form = Object.assign(req.body, { clientId, userId: user_id });
  //   // console.log(req.body);
  //   Item.update(form, {
  //     where: { clientId, id }
  //   })
  //     .then(result => res.json(result))
  //     .catch(err => {
  //       console.log(err);
  //       res.sendStatus(500);
  //     });
  // });
  //
  app.post("/api/customerdetail/destroy/:id", (req, res, next) => {
    const id = req.params.id;
    if (!req.user) {
      console.log("przekierowanie");
      return res.redirect("/");
    }
    const { user_id, clientId, role } = req.user;
    console.log("trans remove id", id.split(","));
    let where = {};
    if (role === "master") {
      where = { clientId, id: id.split(",") };
    } else {
      where = { clientId, userId: user_id, id: id.split(",") };
    }
    CustomerDetail.destroy({
      where
    })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });
  //
  // //remove item
  // app.post("/api/item/destroy/:id", (req, res, next) => {
  //   const id = req.params.id;
  //   if (!req.user) {
  //     console.log("przekierowanie");
  //     return res.redirect("/");
  //   }
  //   const { user_id, clientId } = req.user;
  //   console.log("trans remove id", id.split(","));
  //   Item.destroy({ where: { clientId, id: id.split(",") } })
  //     .then(result => {
  //       res.json(result);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       res.sendStatus(500);
  //     });
  // });
  //
  // //adding items to channel
  app.post("/api/customerdetail", async (req, res) => {
    // console.log("customer_details", req.body);
    if (!req.user) res.redirect("/");
    const { clientId, role, user_id } = req.user;
    //
    // const { channel_id, item_id } = req.params;
    // console.log("channelId itemId", channel_id, item_id);
    const {
      id,
      name,
      surname,
      address,
      phone,
      field,
      meadow,
      tractor,
      harvester,
      cultivator,
      agro,
      customerId
    } = req.body;
    const form = {
      name,
      surname,
      address,
      phone,
      field: field === "" ? 0 : parseFloat(field.replace(",", ".")),
      meadow: meadow === "" ? 0 : parseFloat(meadow.replace(",", ".")),
      clientId,
      userId: user_id,
      customerId
      // tractor: tractor || [],
      // harvester: harvester || [],
      // cultivator: cultivator || [],
      // agro: agro || []
    };
    const tractors = tractor ? tractor.filter(x => x.isOK) : [];
    const harvesters = harvester ? harvester.filter(x => x.isOK) : [];
    const cultivators = cultivator ? cultivator.filter(x => x.isOK) : [];
    const agros = agro ? agro.filter(x => x.isOK) : [];
    // console.log("form THCA", form, tractors, harvesters, cultivators, agros);
    let adding, updating, errAdding;
    if (id === 0) {
      [errAdding, adding] = await to(CustomerDetail.create(form));
    } else {
      [errAdding, updating] = await to(
        CustomerDetail.update(form, { where: { id } })
      );
    }

    // console.log("adding", adding);
    let customerDetailsId;
    if (!adding && !updating) {
      res.sendStatus(500);
    } else {
      if (id === 0) {
        customerDetailsId = adding.get().id;
      } else {
        customerDetailsId = id;
      }

      // console.log("tractor length", tractors);

      const machines = [
        { name: "tractor", post: tractors, db: Tractor },
        { name: "harvester", post: harvesters, db: Harvester },
        { name: "cultivator", post: cultivators, db: Cultivator },
        { name: "agro", post: agros, db: Agro }
      ];

      for (let machine of machines) {
        if (machine.post.length > 0) {
          const [errIds, ids] = await to(
            machine.db.findAll({
              attributes: ["id"],
              where: { customerDetailsId },
              raw: true
            })
          );
          let idsInPost = [];
          for (let mach of machine.post) {
            console.log("machine name", machine.name);
            const id = mach.id;
            idsInPost.push(id);
            let machForm;
            switch (machine.name) {
              case "tractor":
                machForm = tracHarvForm(mach, customerDetailsId);
                break;
              case "harvester":
                machForm = tracHarvForm(mach, customerDetailsId);
                break;
              case "cultivator":
                machForm = cultForm(mach, customerDetailsId);
                break;
              case "agro":
                machForm = agroForm(mach, customerDetailsId);
                break;
              default:
            }
            console.log("machForm", machForm);

            let addingMach, errAdding;
            if (id === 0) {
              [errAdding, addingMach] = await to(machine.db.create(machForm));
            } else {
              [errAdding, addingMach] = await to(
                machine.db.update(machForm, { where: { id } })
              );
            }
          }
          const idsInDB = ids.map(x => x.id);
          const toDistroy = _.differenceWith(idsInDB, idsInPost, _.isEqual);
          for (let delId of toDistroy) {
            const [errDels, delMachs] = await to(
              machine.db.destroy({ where: { customerDetailsId, id: delId } })
            );
          }
        } else if (id !== 0) {
          const [errDel, delMach] = await to(
            machine.db.destroy({ where: { customerDetailsId } })
          );
        }
      }

      // if (harvesters.length > 0) {
      //   for (let harv of harvesters) {
      //     const harvesterForm = Object.assign(harv, {
      //       customerDetailsId,
      //       brand: harv.otherBrand === "" ? harv.brand : harv.otherBrand
      //     });
      //     const [errAdding, addingHarvester] = await to(
      //       Harvester.create(harvesterForm)
      //     );
      //   }
      // }

      // if (cultivators.length > 0) {
      //   for (let cult of cultivators) {
      //     const cultivatorForm = Object.assign(cult, {
      //       brand: cult.otherBrand,
      //       customerDetailsId
      //     });
      //     const [errAdding, addingCultivator] = await to(
      //       Cultivator.create(cultivatorForm)
      //     );
      //   }
      // }

      // if (agros.length > 0) {
      //   for (let ag of agros) {
      //     const agroForm = Object.assign(ag, {
      //       model: ag.otherBrand,
      //       customerDetailsId
      //     });
      //     const [errAdding, addingCultivator] = await to(Agro.create(agroForm));
      //   }
      // }

      res.json(adding);
    }

    // const [errItem, items] = await to(
    //   ChannelItems.findAll({ where: { item_id, channel_id } })
    // );
    //
    // if (items.length === 0) {
    //   const [errAdding, adding] = await to(
    //     ChannelItems.create({ item_id, channel_id })
    //   );
    //
    //   if (!adding) {
    //     res.sendStatus(500);
    //   } else {
    //     res.json(adding);
    //   }
    // } else {
    //   const [errAdding, adding] = await to(
    //     ChannelItems.destroy({ where: { item_id, channel_id } })
    //   );
    //
    //   if (!items) {
    //     res.sendStatus(500);
    //   } else {
    //     res.json(items);
    //   }
    // }
  });
  //
  // //adding user to channel
  // app.post("/api/channel/:channel_id/user/:user_id", async (req, res) => {
  //   if (!req.user) res.redirect("/");
  //   const { clientId, role } = req.user;
  //
  //   const { channel_id, user_id } = req.params;
  //   console.log("channel_id user_id", channel_id, user_id);
  //
  //   const [errItem, items] = await to(
  //     ChannelUsers.findAll({ where: { user_id, channel_id } })
  //   );
  //
  //   if (items.length === 0) {
  //     const [errAdding, adding] = await to(
  //       ChannelUsers.create({ user_id, channel_id })
  //     );
  //
  //     if (!adding) {
  //       res.sendStatus(500);
  //     } else {
  //       res.json(adding);
  //     }
  //   } else {
  //     const [errAdding, adding] = await to(
  //       ChannelUsers.destroy({ where: { user_id, channel_id } })
  //     );
  //
  //     if (!items) {
  //       res.sendStatus(500);
  //     } else {
  //       res.json(items);
  //     }
  //   }
  // });
  //
  // //itemsy in particular channel
  // app.get("/api/item/channel/:id", async (req, res) => {
  //   //   // if (!req.user) res.redirect("/");
  //   //   // const { clientId, role, user_id } = req.user;
  //
  //   const id = req.params.id;
  //
  //   const [err, items] = await to(
  //     Item.findAll({
  //       include: [
  //         {
  //           model: Channel,
  //           as: "SalesChannels",
  //           where: { id }
  //         }
  //       ],
  //       where: {}
  //     })
  //   );
  //
  //   if (!items) {
  //     res.sendStatus(500);
  //   } else {
  //     res.json(items);
  //   }
  // });
  //
  // app.get("/api/allitem/channel/", async (req, res) => {
  //   console.log("allitem/channel");
  //   if (!req.user) res.redirect("/");
  //   const { clientId, role, user_id } = req.user;
  //
  //   const [err, items] = await to(
  //     Item.findAll({
  //       include: [
  //         {
  //           model: Channel,
  //           as: "SalesChannels"
  //           // where: {}
  //         }
  //       ],
  //       where: { clientId }
  //     })
  //   );
  //
  //   if (!items) {
  //     res.sendStatus(500);
  //   } else {
  //     res.json(items);
  //   }
  // });
  //
  // app.get("/api/allusers/channel/", async (req, res) => {
  //   if (!req.user) res.redirect("/");
  //   const { clientId, role, user_id } = req.user;
  //
  //   const [err, users] = await to(
  //     User.findAll({
  //       include: [
  //         {
  //           model: Channel,
  //           as: "SalesChannels"
  //           // where: {}
  //         }
  //       ],
  //       where: { clientId }
  //     })
  //   );
  //
  //   if (!users) {
  //     res.sendStatus(500);
  //   } else {
  //     res.json(users);
  //   }
  // });
  //
  app.get("/api/customerdetail/", async (req, res) => {
    if (!req.user) res.redirect("/");
    const { clientId, role, user_id } = req.user;
    console.log("customer detail", clientId, user_id);

    const [err, details] = await to(
      CustomerDetail.findAll({
        include: [
          {
            model: Tractor,
            as: "Tractors"
          },
          {
            model: Harvester,
            as: "Harvesters"
          },
          {
            model: Cultivator,
            as: "Cultivators"
          },
          {
            model: Agro,
            as: "Agros"
          },
          {
            model: User,
            as: "User",
            attributes: ["name", "surname"]
          },
          { model: PlanerKlienci, as: "Customer" }
        ],
        where: role === "master" ? { clientId } : { clientId, userId: user_id }
      })
    );
    console.log("details", details, err);
    if (!details) {
      res.sendStatus(500);
    } else {
      res.json(details);
    }
  });

  app.get("/api/customerdetail/:id", async (req, res) => {
    if (!req.user) res.redirect("/");
    const id = req.params.id;
    const { clientId, role, user_id } = req.user;
    // console.log("customer detail", clientId, user_id, id);
    let where = {};
    if (role === "master") {
      where = { clientId, id };
    } else {
      where = { clientId, userId: user_id, id };
    }

    const [err, details] = await to(
      CustomerDetail.findAll({
        include: [
          {
            model: Tractor,
            as: "Tractors"
          },
          {
            model: Harvester,
            as: "Harvesters"
          },
          {
            model: Cultivator,
            as: "Cultivators"
          },
          {
            model: Agro,
            as: "Agros"
          },
          {
            model: User,
            as: "User",
            attributes: ["name", "surname"]
          },
          { model: PlanerKlienci, as: "Customer" }
        ],
        where
      })
    );
    // console.log("de", details);
    if (!details) {
      res.sendStatus(500);
    } else {
      res.json(details);
    }
  });
};

const tracHarvForm = (mach, customerDetailsId) => {
  console.log("tracHarvForm ach, mach");
  return Object.assign(mach, {
    customerDetailsId,
    brand: mach.otherBrand === "" ? mach.brand : mach.otherBrand
  });
};

const cultForm = (mach, customerDetailsId) =>
  Object.assign(mach, {
    brand: mach.otherBrand,
    customerDetailsId
  });
const agroForm = (mach, customerDetailsId) =>
  Object.assign(mach, {
    model: mach.otherBrand,
    customerDetailsId
  });
