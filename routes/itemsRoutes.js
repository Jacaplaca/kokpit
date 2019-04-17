const db = require("../models/index");
const User = db.users;
const Transaction = db.transactions;
const Channel = db.sales_channels;
const Item = db.items;
const ChannelItems = db.channel_items;
const ChannelUsers = db.channel_users;
const ChannelsConfig = db.channels_config_new;
const to = require("await-to-js").default;

module.exports = app => {
  //remove configs

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
        // raw: true
      })
    );

    if (!items) {
      res.sendStatus(500);
    } else {
      // console.log("items", items);
      // const itemIds = items.map(x => x.get().id);
      // console.log("itemIds", itemIds);
      // const [err, configs] = await to(
      //   ChannelsConfig.findAll({
      //     where: { clientId, itemId: itemIds, channelId }
      //     // raw: true
      //   })
      // );
      // console.log("configs", configs);
      //
      // res.json(
      //   items.map(x => {
      //     return Object.assign(x.get(), { aaa: "aaa" });
      //   })
      // );
      res.json(items);
    }
  });

  app.get("/api/allitem/channel/:channelId", async (req, res) => {
    const { channelId } = req.params;
    console.log(`allitem/channel/${channelId}`);
    if (!req.user) res.redirect("/");
    const { clientId, role, user_id } = req.user;

    const query = {
      include: [
        {
          model: Channel,
          as: "SalesChannels",
          where: { id: channelId }
        }
      ],
      where: { clientId }
    };

    const query0 = {
      include: [
        {
          model: Channel,
          as: "SalesChannels"
        }
      ],
      where: { clientId }
    };

    const [err, items] = await to(
      Item.findAll(channelId === "0" ? query0 : query)
    );

    // console.log("items", items);

    if (!items) {
      res.sendStatus(500);
    } else {
      res.json(items);
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
};
