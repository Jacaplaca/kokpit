const db = require("../models/index");
const User = db.users;

const Channel = db.sales_channels;
const Item = db.items;
const ChannelItems = db.channel_items;
const ChannelUsers = db.channel_users;
const ChannelsConfig = db.channels_config;
const to = require("await-to-js").default;

module.exports = app => {
  //adding user to channel
  app.post("/api/channel/:channel_id/user/:user_id", async (req, res) => {
    if (!req.user) res.redirect("/");
    const { clientId, role } = req.user;

    const { channel_id, user_id } = req.params;
    console.log("channel_id user_id", channel_id, user_id);

    const [errItem, items] = await to(
      ChannelUsers.findAll({ where: { user_id, channel_id } })
    );

    if (items.length === 0) {
      const [errAdding, adding] = await to(
        ChannelUsers.create({ user_id, channel_id })
      );

      if (!adding) {
        res.sendStatus(500);
      } else {
        res.json(adding);
      }
    } else {
      const [errAdding, adding] = await to(
        ChannelUsers.destroy({ where: { user_id, channel_id } })
      );

      if (!items) {
        res.sendStatus(500);
      } else {
        res.json(items);
      }
    }
  });

  app.get("/api/channelusers/", async (req, res) => {
    // console.log("api/channelusers");
    if (!req.user) res.redirect("/");
    const { clientId, role, user_id } = req.user;
    // console.log("ChannelUsers", clientId, user_id);

    const [err, details] = await to(
      // ChannelUsers.findAll({
      //   include: [
      //     {
      //       model: Channel,
      //       as: "SalesChannels"
      //     }
      //     // {
      //     //   model: Harvester,
      //     //   as: "Harvesters"
      //     // },
      //     // {
      //     //   model: Cultivator,
      //     //   as: "Cultivators"
      //     // },
      //     // {
      //     //   model: Agro,
      //     //   as: "Agros"
      //     // },
      //     // {
      //     //   model: User,
      //     //   as: "User",
      //     //   attributes: ["name", "surname"]
      //     // }
      //   ],
      //   where: { user_id }
      // })
      Channel.findAll({
        include: [
          {
            model: User,
            as: "SalesUsers",
            where: { id: user_id },
            attributes: []
          }
        ],
        where: { clientId }
      })
    );
    // console.log("details", details, err);
    if (!details) {
      res.sendStatus(500);
    } else {
      res.json(details);
    }
  });

  app.get("/api/channelusers/:id", async (req, res) => {
    // console.log("api/channelusers");
    const { id } = req.params;
    if (!req.user) res.redirect("/");
    const { clientId, role, user_id } = req.user;
    // console.log("ChannelUsers", clientId, user_id, id);

    const [err, details] = await to(
      User.findAll({
        include: [
          {
            model: Channel,
            as: "SalesChannels",
            where: { id },
            attributes: ["id", "name"]
          }
        ],
        where: { clientId },
        attributes: ["id", "name", "surname"]
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
