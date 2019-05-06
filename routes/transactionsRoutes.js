const db = require("../models/index");
const User = db.users;
const Transaction = db.transactions;
const Channel = db.sales_channels;
const Item = db.items;
const ChannelItems = db.channel_items;
const Place = db.places;
const ChannelUsers = db.channel_users;
const ChannelsConfig = db.channels_config;

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const to = require("await-to-js").default;

module.exports = app => {
  //remove configs

  app.post("/api/transaction/:userId", (req, res, next) => {
    // console.log("api/transaction/");
    // console.log(req.body);
    const { userId } = req.params;
    const { clientId, user_id } = req.user;
    if (!req.user) {
      return res.redirect("/");
    }
    const form = Object.assign(req.body, {
      clientId,
      userId: userId === "0" ? user_id : userId
    });
    console.log("form", form);
    if (!form.channelId || !form.itemId || !form.clientId || !form.userId) {
      console.log("nie zapisuje");
      res.sendStatus(500);
    } else {
      Transaction.create(form)
        .then(results => {
          return res.json(results);
        })
        .catch(err => {
          console.log(err);
          res.sendStatus(500);
        });
    }
  });

  app.post("/api/transaction/delete/:id", (req, res, next) => {
    // console.log("transaction/delete/id");
    const id = req.params.id;
    if (!req.user) {
      // console.log("przekierowanie");
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

  app.post("/api/transaction/edit/id/:id/:userId", (req, res, next) => {
    const { id, userId } = req.params;
    // console.log("edytuje transaction api", id, req.body);
    if (!req.user) {
      // console.log("przekierowanie");
      return res.redirect("/");
    }
    const { user_id, clientId } = req.user;
    const form = Object.assign(req.body, {
      clientId,
      userId: userId === 0 ? user_id : userId
    });
    console.log(form);
    Transaction.update(form, {
      where: { clientId, id }
    })
      .then(result => res.json(result))
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
    // console.log("channelId itemId", channel_id, item_id);

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
    // console.log("channels", users);

    if (!users) {
      res.sendStatus(500);
    } else {
      res.json(users);
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
          },
          {
            model: Place,
            as: "Places",
            // where: { id: userIdParams === "0" ? user_id : userIdParams },
            // where: { id: user_id },
            attributes: ["id", "name"]
          },
          {
            model: Channel,
            as: "ChannelTrans",
            // where: { id: userIdParams === "0" ? user_id : userIdParams },
            // where: { id: user_id },
            attributes: ["id", "name"]
          },
          {
            model: Item,
            as: "ItemTrans",
            // where: { id: userIdParams === "0" ? user_id : userIdParams },
            // where: { id: user_id },
            attributes: ["id", "name"]
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

  app.get(
    "/api/transactions/:channelId/:userIdParams/:start/:end",
    async (req, res) => {
      const { channelId, userIdParams, start, end } = req.params;
      if (!req.user) res.redirect("/");
      const { clientId, role, user_id } = req.user;
      console.log("start", start, new Date(start));
      let user = user_id;
      let query = {};
      const queryDate = {
        [Op.lte]: new Date(end),
        [Op.gte]: new Date(start)
      };

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
        query =
          channelId === "0"
            ? { clientId, date: queryDate }
            : { channelId, clientId, date: queryDate };
      } else {
        // showing transaction only for specyfic user
        if (role !== "master" && userIdParams !== user_id) {
          user = user_id;
          // query = { clientId, userId: user, channelId };
        } else {
          user = userIdParams;
        }
        // user = user_id;
        query =
          channelId === "0"
            ? { clientId, userId: user, date: queryDate }
            : { clientId, userId: user, channelId, date: queryDate };
      }

      // console.log("query", query);

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
            },
            {
              model: Channel,
              as: "ChannelTrans",
              // where: { id: userIdParams === "0" ? user_id : userIdParams },
              // where: { id: user_id },
              attributes: ["id", "name"]
            },
            {
              model: Item,
              as: "ItemTrans",
              // where: { id: userIdParams === "0" ? user_id : userIdParams },
              // where: { id: user_id },
              attributes: ["id", "name"]
            },
            {
              model: Place,
              as: "Places",
              // where: { id: userIdParams === "0" ? user_id : userIdParams },
              // where: { id: user_id },
              attributes: ["id", "name"]
            }
          ]
        })
      );

      if (!transactions) {
        res.sendStatus(500);
      } else {
        res.json(transactions);
      }
    }
  );

  app.get("/api/transactions/:channelId/:start/:end", async (req, res) => {
    const { channelId, start, end } = req.params;
    // console.log(`api/transactions/${channelId}/${start}/${end}`);
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

    // if (userIdParams === "0" && role === "master") {
    //   //showing every transaction in channel
    //   query = channelId === "0" ? { clientId } : { channelId, clientId };
    // } else {
    //   // showing transaction only for specyfic user
    //   if (role !== "master" && userIdParams !== user_id) {
    //     user = user_id;
    //     // query = { clientId, userId: user, channelId };
    //   } else {
    //     user = userIdParams;
    //   }
    //   // user = user_id;
    //   query =
    //     channelId === "0"
    //       ? { clientId, userId: user }
    //       : { clientId, userId: user, channelId };
    // }
    const queryDate = {
      [Op.lte]: new Date(end),
      [Op.gte]: new Date(start)
    };
    if (role === "master") {
      if (channelId === "0") {
        query = {
          date: queryDate,
          clientId
        };
      } else {
        query = {
          channelId,
          date: queryDate,
          clientId
        };
      }
    } else {
      if (channelId === "0") {
        query = {
          date: queryDate,
          clientId,
          userId: user_id
        };
      } else {
        query = {
          channelId,
          date: queryDate,
          clientId,
          userId: user_id
        };
      }
    }

    // console.log("query", query);

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
          },
          {
            model: Channel,
            as: "ChannelTrans",
            // where: { id: userIdParams === "0" ? user_id : userIdParams },
            // where: { id: user_id },
            attributes: ["id", "name"]
          },
          {
            model: Item,
            as: "ItemTrans",
            // where: { id: userIdParams === "0" ? user_id : userIdParams },
            // where: { id: user_id },
            attributes: ["id", "name"]
          },
          {
            model: Place,
            as: "Places",
            // where: { id: userIdParams === "0" ? user_id : userIdParams },
            // where: { id: user_id },
            attributes: ["id", "name"]
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
