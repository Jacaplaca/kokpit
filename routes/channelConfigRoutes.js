const db = require("../models/index");
const User = db.users;

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

module.exports = app => {
  app.get(
    "/api/channel_config_new/itemchannel/id/:itemId/:channelId/",
    async (req, res) => {
      const { itemId, channelId } = req.params;
      // if (!req.user) res.redirect("/");
      const { clientId, user_id } = req.user;
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
    const { clientId, user_id } = req.user;
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
    const { user_id, clientId } = req.user;
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

    const { user_id, clientId } = req.user;

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
