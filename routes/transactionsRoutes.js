const db = require("../models/index");
const User = db.users;

const Channel = db.sales_channels;
const Item = db.items;
const ChannelItems = db.channel_items;
const to = require("await-to-js").default;

module.exports = app => {
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
