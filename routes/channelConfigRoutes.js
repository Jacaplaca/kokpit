const db = require("../models/index");
const User = db.users;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Channel = db.sales_channels;
const Item = db.items;
const ChannelItems = db.channel_items;
const ChannelsConfig = db.channels_config_new;
const to = require("await-to-js").default;

const suffix = bonusType => {
  if (bonusType === "% marży") {
    return "%";
  } else if (bonusType === "stawka") {
    return "zł";
  } else {
    return "";
  }
};

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const dynamicSort = property => {
  // console.log("dynamicSort", property);
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function(a, b) {
    const aPL = a[property];
    const bPL = b[property];
    const aDate = new Date(aPL).getTime();
    const bDate = new Date(bPL).getTime();
    // console.log(aDate, bDate);
    const result = aDate < bDate ? -1 : aDate > bDate ? 1 : 0;
    // console.log(result);
    // console.log(sortOrder);
    return result * sortOrder;
  };
};

module.exports = app => {
  app.get("/api/channel_config/:channelId/", async (req, res) => {
    if (!req.user) {
      return res.redirect("/");
    }
    // const clientId = 2;
    const { clientId, role, id: user_id } = req.user;
    const { channelId } = req.params;

    const [errItems, items] = await to(
      Item.findAll({
        include: [
          {
            model: Channel,
            as: "SalesChannels",
            where: { id: channelId }
          }
        ],
        where: {},
        raw: true
      })
    );

    const itemsIds = items.map(x => x.id);
    console.log("itemsids", itemsIds);

    const [errConfigs, configs] = await to(
      ChannelsConfig.findAll({
        where: { clientId, itemId: itemsIds, channelId },
        attributes: [
          // "id",
          "from",
          "to",
          "itemId",
          "channelId",
          "bonusType",
          "bonus",
          "suffix"
        ],
        raw: true
      })
    );

    // console.log(configs);

    if (!configs) {
      res.sendStatus(500);
    } else {
      const availableItems = configs.map(x => x.itemId);
      const uniqueItems = availableItems.filter(onlyUnique);
      console.log(uniqueItems);
      let groupedConfigs = [];
      for (let item of uniqueItems) {
        const filtered = configs.filter(x => x.itemId === item);
        const sorted = filtered.sort(dynamicSort("to"));
        // console.log(filtered);
        groupedConfigs.push(sorted.reverse()[0]);
      }
      // console.log(groupedConfigs);

      res.json(groupedConfigs);
    }
  });

  app.get(
    "/api/config/month_channel/:day/:channelId/:userId",
    async (req, res) => {
      const { day, channelId, userId } = req.params;
      console.log(`I'm in geting configs`);
      if (!req.user) {
        return res.redirect("/");
      }
      // const clientId = 2;
      const { clientId, role, id: user_id } = req.user;

      // console.log("config", user_id, userId, userId === "0" ? user_id : userId);
      const [errItem, channels] = await to(
        Channel.findAll({
          include: [
            {
              model: User,
              as: "SalesUsers",
              where: { id: userId === "0" ? user_id : userId },
              // where: { id: user_id },
              attributes: []
            }
          ],
          where: { clientId },
          raw: true
        })
      );
      // console.log("channels", channels);
      const channelsIds = channels.map(x => x.id);
      console.log(
        "channelsIds",
        channelsIds,
        channelId,
        channelsIds.includes(Math.trunc(channelId))
      );

      const add = { channelId };

      const where = {
        clientId,
        [Op.or]: [
          {
            from: {
              [Op.lte]: new Date(day)
            },
            to: {
              [Op.gte]: new Date(day)
            }
          }
        ]
      };

      const query = {
        attributes: [
          ["id", "configId"],
          "bonusType",
          "bonus",
          "suffix",
          "from",
          "to"
        ],
        where: channelId === "0" ? where : Object.assign(where, add),
        include: [
          {
            model: Item,
            as: "Item",
            attributes: ["name", "id", "unit"]
          },
          {
            model: Channel,
            as: "Channel",
            attributes: ["name", "id"]
            // include: [{ model: User, as: "SalesUsers" }]
          }
        ],
        raw: true
      };
      // if (
      //   channelsIds.includes(Math.trunc(channelId)) ||
      //   (role === "master" && channelId === "0")
      // ) {
      //   console.log(
      //     channelsIds.includes(Math.trunc(channelId)) ||
      //       (role === "master" && channelId === "0")
      //   );
      //   ChannelsConfig.findAll(query)
      //     .then(result => {
      //       // console.log("config", result);
      //       return res.json(result);
      //     })
      //     .catch(err => {
      //       console.log(err);
      //       res.sendStatus(500);
      //     });
      // } else {
      //   return res.json([]);
      // }
      // console.log(
      //   "query",
      //   query,
      //   channelsIds.includes(Math.trunc(channelId)),
      //   channelId === "0"
      // );
      // if (!channelsIds.includes(Math.trunc(channelId)) && channelId === "0") {
      //   ChannelsConfig.findAll(query)
      //     .then(result => {
      //       console.log("config1", result);
      //       return res.json(result);
      //     })
      //     .catch(err => {
      //       console.log(err);
      //       res.sendStatus(500);
      //     });
      // } else if (
      //   channelsIds.includes(Math.trunc(channelId)) &&
      //   channelId !== "0"
      // ) {
      //   ChannelsConfig.findAll(query)
      //     .then(result => {
      //       // console.log("config", result);
      //       console.log("config2", result);
      //       return res.json(result);
      //     })
      //     .catch(err => {
      //       console.log(err);
      //       res.sendStatus(500);
      //     });
      // } else {
      //   console.log("config3");
      //   return res.json([]);
      // }
      ChannelsConfig.findAll(query)
        .then(result => {
          // console.log("config", result);
          console.log("config2", result);
          return res.json(result);
        })
        .catch(err => {
          console.log(err);
          res.sendStatus(500);
        });
    }
  );

  app.get(
    "/api/channel_config_new/itemchannel/id/:itemId/:channelId/",
    async (req, res) => {
      const { itemId, channelId } = req.params;
      // if (!req.user) res.redirect("/");
      const { clientId, id: user_id } = req.user;
      console.log("config views", clientId, channelId, itemId);
      const [err, result] = await to(
        ChannelsConfig.findAll({
          where: { clientId, itemId, channelId }
          // raw: true
        })
      );
      // console.log("result", result);
      if (!result) {
        res.sendStatus(500);
      } else {
        // res.json(result);
        res.json(
          result.map(x => {
            const suffix = x.get().suffix;
            const bonus = x.get().bonus;
            // const bonusType = x.get().bonus
            return Object.assign(x.get(), {
              bonus:
                suffix === "%"
                  ? `${parseFloat(bonus) * 100}`.replace(".", ",")
                  : `${parseFloat(bonus)}`.replace(".", ",")
            });
            // console.log(x);
          })
          // result
        );
      }
    }
  );

  //remove configs

  app.post("/api/channels_config/", async (req, res, next) => {
    console.log("api/channels_config/", req.body);
    // console.log(req.body);
    const { from, to, channelId, itemId, bonusType, bonus } = req.body;
    // res.json(bonus);
    const { clientId, id: user_id } = req.user;
    // console.log("req.user", req.user);
    if (!req.user) {
      return res.redirect("/");
    }
    // const item = await Item.find({
    //   where: { clientId: 2, id: clickedRow },
    //   raw: true
    // });
    //
    // const bonus_type = await BonusType.find({
    //   where: { name: bonusType },
    //   raw: true
    // });
    //
    // const monthConverted = month ? month : dateToYM(new Date());
    //
    // const { name, unit, channelId } = item;
    console.log(
      "bonus",
      bonus,
      parseFloat(bonus),
      bonus.replace(",", "."),
      parseFloat(bonus.replace(",", "."))
    );
    const form = Object.assign(req.body, {
      // name,
      // unit,
      // channelId,
      bonus:
        suffix(bonusType) === "%"
          ? parseFloat(bonus.replace(",", ".")) / 100
          : parseFloat(bonus.replace(",", ".")),
      // itemId,
      // key: `${monthConverted}${name}`,
      // month: monthConverted,
      clientId,
      // userId: user_id,
      suffix: suffix(bonusType)
    });

    ChannelsConfig.create(form)
      .then(results => {
        return res.json(results);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.post("/api/channel_config/destroy/:id", (req, res, next) => {
    console.log("channel config destroy");
    const id = req.params.id;
    if (!req.user) {
      console.log("przekierowanie");
      return res.redirect("/");
    }
    const { id: user_id, clientId } = req.user;
    console.log("trans remove id", id.split(","));
    ChannelsConfig.destroy({ where: { clientId, id: id.split(",") } })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  //adding items to channel

  app.post("/api/channel_config/edit/id/:id", async (req, res, next) => {
    console.log("/api/channel_config/edit/:id");
    const id = req.params.id;
    if (!req.user) {
      console.log("przekierowanie");
      return res.redirect("/");
    }
    const { bonusType, bonus } = req.body;

    const { id: user_id, clientId } = req.user;

    // const bonus_type = await BonusType.find({
    //   where: { name: bonusType },
    //   raw: true
    // });

    const form = Object.assign(req.body, {
      // bonus: bonusType.suffix === "%" ? bonus / 100 : bonus,
      // suffix: bonusType.suffix
      bonus:
        suffix(bonusType) === "%"
          ? parseFloat(bonus.replace(",", ".")) / 100
          : parseFloat(bonus.replace(",", ".")),
      // itemId,
      // key: `${monthConverted}${name}`,
      // month: monthConverted,
      clientId,
      // userId: user_id,
      suffix: suffix(bonusType)
    });
    // console.log(req.body);
    ChannelsConfig.update(form, {
      where: { clientId, id }
    })
      .then(result => res.json(result))
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });
};
