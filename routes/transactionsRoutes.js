const db = require("../models/index");
const User = db.users;

const Channel = db.sales_channels;
const Item = db.items;
const ChannelItems = db.channel_items;
const ChannelsConfig = db.channels_config;
const to = require("await-to-js").default;

module.exports = app => {
  //remove configs
  app.post("/api/channel_config/destroy/:id", (req, res, next) => {
    const id = req.params.id;
    // if (!req.user) {
    //   console.log("przekierowanie");
    //   return res.redirect("/");
    // }
    // const { user_id, clientId } = req.user;
    console.log("trans remove id", id.split(","));
    ChannelsConfig.destroy({ where: { clientId: 2, id: id.split(",") } })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.post("/api/channel/destroy/:id", (req, res, next) => {
    const id = req.params.id;
    // if (!req.user) {
    //   console.log("przekierowanie");
    //   return res.redirect("/");
    // }
    // const { user_id, clientId } = req.user;
    console.log("trans remove id", id.split(","));
    Channel.destroy({ where: { clientId: 2, id: id.split(",") } })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  //remove item
  app.post("/api/item/destroy/:id", (req, res, next) => {
    const id = req.params.id;
    // if (!req.user) {
    //   console.log("przekierowanie");
    //   return res.redirect("/");
    // }
    // const { user_id, clientId } = req.user;
    console.log("trans remove id", id.split(","));
    Item.destroy({ where: { clientId: 2, id: id.split(",") } })
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
    //   // if (!req.user) res.redirect("/");
    //   // const { clientId, role, user_id } = req.user;

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
};
