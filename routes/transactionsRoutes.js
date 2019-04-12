const db = require("../models/index");
const User = db.users;
const Transaction = db.transactions;
const Channel = db.sales_channels;
const Item = db.items;
const ChannelItems = db.channel_items;
const ChannelUsers = db.channel_users;
const ChannelsConfig = db.channels_config;
const to = require("await-to-js").default;

module.exports = app => {
  //remove configs

  app.post("/api/transaction/:userId", (req, res, next) => {
    console.log("api/transaction/");
    console.log(req.body);
    const { userId } = req.params;
    const { clientId, user_id } = req.user;
    if (!req.user) {
      return res.redirect("/");
    }
    const form = Object.assign(req.body, {
      clientId,
      userId: userId === "0" ? user_id : userId
    });
    Transaction.create(form)
      .then(results => {
        return res.json(results);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.post("/api/transaction/delete/:id", (req, res, next) => {
    console.log("transaction/delete/id");
    const id = req.params.id;
    if (!req.user) {
      console.log("przekierowanie");
      return res.redirect("/");
    }
    // let ids;
    // ids.push(id);
    const { user_id, clientId } = req.user;
    // console.log("trans remove id", ids.split(","));
    Transaction.destroy({ where: { clientId, id: id.split(",") } })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.post("/api/item", (req, res, next) => {
    console.log("api/item/");
    console.log(req.body);
    const { channelId } = req.params;
    const { clientId, user_id } = req.user;
    if (!req.user) {
      return res.redirect("/");
    }
    const form = Object.assign(req.body, {
      clientId,
      userId: user_id,
      channelId
    });
    Item.create(form)
      .then(results => {
        return res.json(results);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.post("/api/transaction/edit/id/:id/:userId", (req, res, next) => {
    const { id, userId } = req.params;
    console.log("edytuje transaction api", id, req.body);
    if (!req.user) {
      console.log("przekierowanie");
      return res.redirect("/");
    }
    const { user_id, clientId } = req.user;
    const form = Object.assign(req.body, {
      clientId,
      userId: userId === 0 ? user_id : userId
    });
    // console.log(req.body);
    Transaction.update(form, {
      where: { clientId, id }
    })
      .then(result => res.json(result))
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.post("/api/item/edit/id/:id", (req, res, next) => {
    console.log("/api/channel_item/edit/:id");
    const id = req.params.id;
    console.log("edytuje channel item api,", id, req.body);
    if (!req.user) {
      console.log("przekierowanie");
      return res.redirect("/");
    }
    const { user_id, clientId } = req.user;
    const form = Object.assign(req.body, { clientId, userId: user_id });
    // console.log(req.body);
    Item.update(form, {
      where: { clientId, id }
    })
      .then(result => res.json(result))
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  // app.post("/api/channel_config/destroy/:id", (req, res, next) => {
  //   const id = req.params.id;
  //   // if (!req.user) {
  //   //   console.log("przekierowanie");
  //   //   return res.redirect("/");
  //   // }
  //   // const { user_id, clientId } = req.user;
  //   console.log("trans remove id", id.split(","));
  //   ChannelsConfig.destroy({ where: { clientId: 2, id: id.split(",") } })
  //     .then(result => {
  //       res.json(result);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       res.sendStatus(500);
  //     });
  // });

  //remove item
  app.post("/api/item/destroy/:id", (req, res, next) => {
    const id = req.params.id;
    if (!req.user) {
      console.log("przekierowanie");
      return res.redirect("/");
    }
    const { user_id, clientId } = req.user;
    console.log("trans remove id", id.split(","));
    Item.destroy({ where: { clientId, id: id.split(",") } })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  //adding items to channel
  app.post("/api/channel/:channel_id/item/:item_id", async (req, res) => {
    if (!req.user) res.redirect("/");
    const { clientId, role, user_id } = req.user;

    const { channel_id, item_id } = req.params;
    console.log("channelId itemId", channel_id, item_id);

    const [errItem, items] = await to(
      ChannelItems.findAll({ where: { item_id, channel_id } })
    );

    if (items.length === 0) {
      const [errAdding, adding] = await to(
        ChannelItems.create({ item_id, channel_id })
      );

      if (!adding) {
        res.sendStatus(500);
      } else {
        res.json(adding);
      }
    } else {
      const [errAdding, adding] = await to(
        ChannelItems.destroy({ where: { item_id, channel_id } })
      );

      if (!items) {
        res.sendStatus(500);
      } else {
        res.json(items);
      }
    }
  });

  //itemsy in particular channel
  app.get("/api/item/channel/:id", async (req, res) => {
    //   // if (!req.user) res.redirect("/");
    //   // const { clientId, role, user_id } = req.user;

    const id = req.params.id;

    const [err, items] = await to(
      Item.findAll({
        include: [
          {
            model: Channel,
            as: "SalesChannels",
            where: { id }
          }
        ],
        where: {}
      })
    );

    if (!items) {
      res.sendStatus(500);
    } else {
      res.json(items);
    }
  });

  app.get("/api/allitem/channel/", async (req, res) => {
    console.log("allitem/channel");
    if (!req.user) res.redirect("/");
    const { clientId, role, user_id } = req.user;

    const [err, items] = await to(
      Item.findAll({
        include: [
          {
            model: Channel,
            as: "SalesChannels"
            // where: {}
          }
        ],
        where: { clientId }
      })
    );

    if (!items) {
      res.sendStatus(500);
    } else {
      res.json(items);
    }
  });

  app.get("/api/allusers/channel/", async (req, res) => {
    if (!req.user) res.redirect("/");
    const { clientId, role, user_id } = req.user;

    const [err, users] = await to(
      User.findAll({
        include: [
          {
            model: Channel,
            as: "SalesChannels"
            // where: {}
          }
        ],
        where: { clientId }
      })
    );
    console.log("channels", users);

    if (!users) {
      res.sendStatus(500);
    } else {
      res.json(users);
    }
  });

  app.get("/api/channel_items/", async (req, res) => {
    //   // if (!req.user) res.redirect("/");
    //   // const { clientId, role, user_id } = req.user;

    const [err, items] = await to(
      Item.findAll({
        where: {}
      })
    );

    if (!items) {
      res.sendStatus(500);
    } else {
      res.json(items);
    }
  });

  app.get("/api/transaction/:id", async (req, res) => {
    const { id } = req.params;
    //   // if (!req.user) res.redirect("/");
    const { clientId, role, user_id } = req.user;

    const [err, items] = await to(
      Transaction.find({
        // include: [{ model: Category }, { model: Group }],
        where: { clientId, id },
        include: [
          {
            model: User,
            as: "User",
            // where: { id: userIdParams === "0" ? user_id : userIdParams },
            // where: { id: user_id },
            attributes: ["id", "name", "surname"]
          }
        ]
      })
    );

    if (!items) {
      res.sendStatus(500);
    } else {
      res.json(items);
    }
  });

  // case "transactions":
  //   Transaction.findAll({ where: { clientId, userId: user_id } })
  //     .then(result => res.json(result))
  //     .catch(err => {
  //       console.log(err);
  //       res.sendStatus(500);
  //     });
  //   break;

  app.get("/api/transactions/:channelId/:userIdParams", async (req, res) => {
    const { channelId, userIdParams } = req.params;
    if (!req.user) res.redirect("/");
    const { clientId, role, user_id } = req.user;

    let user = user_id;
    let query = {};

    // if (role === "master" && userIdParams !== user_id && userIdParams !== "0") {
    //   user = userIdParams;
    //   query = { clientId, userId: user, channelId };
    // } else if (role === "master" && userIdParams !== "0") {
    //   query = { clientId, user: userIdParams };
    // } else {
    //   user = user_id;
    //   query = { clientId };
    // }

    if (userIdParams === "0" && role === "master") {
      //showing every transaction in channel
      query = { channelId, clientId };
    } else {
      // showing transaction only for specyfic user
      if (role !== "master" && userIdParams !== user_id) {
        user = user_id;
        // query = { clientId, userId: user, channelId };
      } else {
        user = userIdParams;
      }
      // user = user_id;
      query = { clientId, userId: user, channelId };
    }

    console.log("query", query);

    const [err, transactions] = await to(
      Transaction.findAll({
        where: query,
        include: [
          {
            model: User,
            as: "User",
            // where: { id: userIdParams === "0" ? user_id : userIdParams },
            // where: { id: user_id },
            attributes: ["id", "name", "surname"]
          }
        ]
      })
    );

    if (!transactions) {
      res.sendStatus(500);
    } else {
      res.json(transactions);
    }
  });
};
