const permit = require("../services/permission");
const to = require("await-to-js").default;
// import permit from '../services/permission';
// const YMtoMonthYear = require("../client/src/common/functions");
// import {
//   YMtoMonthYear,
//   dynamicSort,
//   dateToYM
// } from "../client/src/common/functions";

const db = require("../models/index");
const User = db.users;
const Group = db.groups;
const Category = db.categories;

const Channel = db.sales_channels;
const Item = db.items;
const ChannelsConfig = db.channels_config_new;
const Transaction = db.transactions;
const BonusType = db.bonus_type;

const Invoices4SMS = db.invoices4sms_intf;

const RodzajAktywnosci = db.planer_akt_rodz;
const Cost = db.costs;
const Aktywnosci = db.planer_aktywnosci;
const Raporty = db.planer_raporty;
const Miejsca = db.miejsca;
const Place = db.places;
const Flag = db.flags;
const City = db.gus_simc;
const Street = db.gus_ulic;
const Terc = db.gus_terc;
const Wojewodztwo = db.gus_terc_woj;
const Powiat = db.gus_terc_pow;
const PlanerKlienci = db.planer_klienci;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const axios = require("axios");
// const onlyUnique = require("../client/src/common/functions");

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

module.exports = app => {
  app.get("/api/city/:city", (req, res, next) => {
    const wyszukiwanie = req.params.city;
    const city = wyszukiwanie;
    // const city = wyszukiwanie.split(" ")[0];
    const drugiCzlon = wyszukiwanie.split(" ")[1];
    console.log(city);
    // console.log(drugiCzlon);
    if (city.length < 3) {
      res.json([]);
    } else {
      const { id: user_id, clientId } = req.user;
      if (!req.user) {
        return res.redirect("/");
      }
      let mods = [];
      Miejsca.findAll({
        where: {
          name: { [Op.like]: `%${city}%` }
        },
        limit: 30
      }).then(result => {
        return res.json(result);
      });
    }
  });
  app.get("/api/places/:city", (req, res, next) => {
    const wyszukiwanie = req.params.city;
    const city = wyszukiwanie;
    console.log("places", city);
    // const city = wyszukiwanie.split(" ")[0];
    const drugiCzlon = wyszukiwanie.split(" ")[1];
    console.log(city);
    // console.log(drugiCzlon);
    if (city.length < 3) {
      res.json([]);
    } else {
      const { id: user_id, clientId } = req.user;
      if (!req.user) {
        return res.redirect("/");
      }
      let mods = [];
      Place.findAll({
        where: {
          name: { [Op.like]: `%${city}%` }
        },
        limit: 30
      }).then(result => {
        return res.json(result);
      });
    }
  });

  app.get("/api/placesid/:id", (req, res, next) => {
    const id = req.params.id;
    console.log(`/api/places/${id}`);
    if (!req.user) {
      console.log("przekierowanie");
      return res.redirect("/");
    }
    const { id: user_id, clientId } = req.user;
    Place.find({
      where: {
        id
      }
    }).then(result => {
      return res.json(result);
    });
  });

  app.get("/api/message", (req, res) => {
    const message = req.flash("info");
    res.send(message);
  });

  app.post("/api/:table/remove/:id", (req, res, next) => {
    const { id, table } = req.params;
    if (!req.user) {
      console.log("przekierowanie");
      return res.redirect("/");
    }
    const { id: user_id, clientId } = req.user;
    switch (table) {
      case "akt":
        Aktywnosci.destroy({ where: { user_id, id } })
          .then(() => res.end())
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
      case "planerRaporty":
        Raporty.destroy({ where: { user_id, id } })
          .then(() => res.end())
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
      default:
    }
  });

  app.post("/api/akt/planned/:day", (req, res, next) => {
    const day = req.params.day;
    console.log(day);
    if (!req.user) {
      console.log("przekierowanie");
      return res.redirect("/");
    }
    const { id: user_id, clientId } = req.user;
    console.log(user_id);
    Aktywnosci.update(
      {
        wyslano: 1
      },
      {
        where: { user_id, kiedy: new Date(day) }
        // where: {kiedy:}
      }
    )
      .then(() => res.end())
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.get("/api/id/:table/:id", (req, res, next) => {
    // console.log(req.params);
    console.log("przegladaj tabele");
    const table = req.params.table;
    const id = req.params.id;
    const { id: user_id, clientId } = req.user;
    console.log(`${table} ${id}`);
    if (!req.user) {
      return res.redirect("/");
    }
    switch (table) {
      case "channel":
        Channel.find({
          // include: [{ model: Category }, { model: Group }],
          where: { clientId, id }
        })
          .then(result => {
            res.json(result);
          })
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;

      case "cost":
        Cost.find({
          include: [{ model: Category }, { model: Group }],
          where: { clientId, id }
        })
          .then(result => {
            res.json(result);
          })
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
      case "akt":
        Aktywnosci.find({
          include: [
            // { model: User },
            { model: RodzajAktywnosci, attributes: ["name"] },
            //{ model: City, attributes: ["nazwa"] },
            { model: Place, attributes: ["name"] }
          ],
          where: { user_id, id }
        })
          .then(result => {
            res.json(result);
          })
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
      case "planerRaporty":
        console.log("raport");
        Raporty.find({
          include: [
            // { model: User },
            { model: RodzajAktywnosci, attributes: ["name"] },
            //{ model: City, attributes: ["nazwa"] },
            { model: Place, attributes: ["name"] },
            {
              model: PlanerKlienci,
              attributes: ["id", "name", "adr_Kod", "adr_Miejscowosc"],
              include: [
                {
                  model: Flag,
                  as: "CustomerFlag"
                }
              ]
            }
          ],
          where: { user_id, id }
        })
          .then(result => {
            res.json(result);
          })
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
      default:
    }
  });

  app.get(`/api/kiedy/akt/:data`, (req, res, next) => {
    console.log(req.params);
    console.log("przegladaj tabele /api/kiedy/akt/:data");
    const day = req.params.data;
    const { id: user_id, clientId } = req.user;
    if (!req.user) {
      return res.redirect("/");
    }
    Aktywnosci.findAll({
      include: [
        { model: RodzajAktywnosci, attributes: ["name"] },
        // { model: City, attributes: ["nazwa"] }
        { model: Place, attributes: ["name"] }
      ],
      where: { user_id, kiedy: new Date(day) }
    })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.get(`/api/kiedy/akt/`, (req, res, next) => {
    res.json([]);
  });

  app.post("/api/aktywnosci/", (req, res, next) => {
    console.log("api/aktywnosc/");
    console.log(req.body);
    const { clientId, id: user_id } = req.user;
    if (!req.user) {
      return res.redirect("/");
    }
    const {
      kiedy,
      start,
      stop,
      aktywnosc_id,
      miejsce_id,
      inna,
      uwagi
    } = req.body;
    console.log(miejsce_id);
    const cleanStart = start.replace(" ", "").replace(" ", "");
    const cleanStop = stop.replace(" ", "").replace(" ", "");
    Aktywnosci.create({
      kiedy,
      start: `${kiedy} ${cleanStart.split(":")[0]}:${cleanStart.split(":")[1]}`,
      stop: `${kiedy} ${cleanStop.split(":")[0]}:${cleanStop.split(":")[1]}`,
      aktywnosc_id,
      miejsce_id: miejsce_id === "" ? null : miejsce_id,
      inna,
      uwagi,
      klient_id: clientId,
      user_id
    })
      .then(results => {
        return res.json(results);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  //Changed for Miejsca
  app.get("/api/table/:table/:zakres", (req, res) => {
    const table = req.params;
    const zakres = table.zakres;
    const start = zakres.split("_")[0];
    const stop = zakres.split("_")[1];
    const startDate = new Date(start);
    const stopDate = new Date(`${stop} 23:59:59`);
    console.log(startDate);
    console.log(stopDate);
    if (!req.user) {
      return res.redirect("/");
    }
    const { clientId, role, id: user_id } = req.user;
    switch (table.table) {
      case "planerAktywnosci":
        let whereMasterAct = { klient_id: clientId };
        let whereUserAct = { user_id };
        let whereAct = {
          start: {
            [Op.gte]: startDate
          },
          stop: {
            [Op.lte]: stopDate
          }
        };
        const where = Object.assign(
          whereAct,
          role === "master" ? { klient_id: clientId } : { user_id }
        );

        Aktywnosci.findAll({
          include: [
            { model: User, attributes: ["name", "surname", "id"] },
            { model: RodzajAktywnosci, attributes: ["name"] },
            // { model: City, attributes: ["nazwa"] }
            { model: Place, attributes: ["name"] }
          ],
          where
        })
          .then(result => res.json(result))
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
      case "planerRaporty":
        Raporty.findAll({
          include: [
            { model: User, attributes: ["name", "surname", "id"] },
            { model: RodzajAktywnosci, attributes: ["name"] },
            // { model: City, attributes: ["nazwa"] },
            { model: Place, attributes: ["name"] },
            {
              model: PlanerKlienci,
              attributes: ["id", "name", "adr_Kod", "adr_Miejscowosc"]
            }
          ],
          where: {
            user_id,
            start: {
              [Op.gte]: startDate
            },
            stop: {
              [Op.lte]: stopDate
            }
          }
        })
          .then(result => res.json(result))
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
      case "costs":
        const foo = async () => {
          const fetchuj = await Cost.findAll({
            include: [{ model: Category }, { model: Group }],
            where: {
              clientId,
              data_wystawienia: {
                [Op.gte]: startDate,
                [Op.lte]: stopDate
              }
            }
          })
            .then(result => {
              res.json(result);
            })
            .catch(err => {
              console.log(err);
              res.sendStatus(500);
            });
        };
        foo();
        break;
      default:
        res.sendStatus(500);
    }
  });

  app.get("/api/item/channels/:name", (req, res) => {
    // console.log("asdf", Item);
    const month = req.params.month;
    const name = req.params.name;
    console.log(`/api/item/channels/${name}`);
    if (!req.user) {
      return res.redirect("/");
    }
    // const clientId = 2;
    const { clientId, role, id: user_id } = req.user;
    Item.find({ where: { clientId, name } })
      .then(result => res.json(result))
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.get("/api/config/channels/:month/:name", (req, res) => {
    // console.log("asdf", Item);
    const month = req.params.month;
    const name = req.params.name;
    // console.log(`/api/config/channels/${month}/${name}`);
    if (!req.user) {
      return res.redirect("/");
    }
    // const clientId = 2;
    const { clientId, role, id: user_id } = req.user;
    ChannelsConfig.find({ where: { clientId, month, name } })
      .then(result => res.json(result))
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.get("/api/channels/items/:channel", (req, res) => {
    const channelId = req.params.channel;
    console.log(
      `get channels items "/api/channels/items/${channelId}/`,
      req.user
    );
    if (!req.user) {
      return res.redirect("/");
    }
    // const clientId = 2;
    const { clientId, role, id: user_id } = req.user;
    Item.findAll({ where: { clientId, channelId } })
      .then(result => {
        // console.log(result);
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.get("/api/promoitems/month/:day/", (req, res) => {
    const day = req.params.day;
    console.log(`/api/config/month_channel/${day}/`);
    if (!req.user) {
      return res.redirect("/");
    }
    // const clientId = 2;
    const { clientId, role, id: user_id } = req.user;
    ChannelsConfig.findAll({
      where: {
        clientId,
        [Op.or]: [
          {
            from: {
              // [Op.lt]: new Date(day),
              [Op.gt]: new Date(day)
            },
            to: {
              [Op.lt]: new Date(day)
              // [Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
            }
          }
        ]
      }
    })
      .then(result => {
        console.log("result", result);
        return res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.get("/api/channel_config/item/id/:id/", async (req, res) => {
    const itemId = req.params.id;
    // if (!req.user) res.redirect("/");
    const { clientId, role, id: user_id } = req.user;
    const [err, result] = await to(
      ChannelsConfig.findAll({ where: { clientId, itemId } })
    );

    if (!result) {
      res.sendStatus(500);
    } else {
      // res.json(result);
      res.json(
        result.map(x => {
          const suffix = x.get().suffix;
          const bonus = x.get().bonus;
          return Object.assign(x.get(), {
            bonus: suffix === "%" ? `${bonus * 100}` : `${bonus}`
          });
          // console.log(x);
        })
      );
    }
  });

  app.get("/api/table/:table", (req, res) => {
    const table = req.params;
    // if (!req.user) {
    //   return res.redirect("/");
    // }
    console.log("table", req.user);
    const { clientId, role, id: user_id } = req.user;
    console.log("table", clientId, role, user_id);
    switch (table.table) {
      case "category":
        Category.findAll({ where: { clientId } })
          .then(result => res.json(result))
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
      case "group":
        Group.findAll({ where: { clientId } })
          .then(result => {
            console.log("result", result);
            res.json(result);
          })
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
      case "rodzajAktywnosci":
        RodzajAktywnosci.findAll({ where: { clientId } })
          .then(result => res.json(result))
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
      case "dniDoRaportu":
        Aktywnosci.findAll({ where: { user_id, wyslano: 1 } })
          .then(result => {
            const datyDoRaportu = result.map(x => x.get().kiedy);
            const unique = datyDoRaportu.filter(onlyUnique);
            return res.json(
              unique.map((x, i) => Object.assign({}, { id: i, name: x }))
            );
          })
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
      default:
        res.sendStatus(500);
    }
  });

  app.get("/api/users", (req, res) => {
    console.log("api/users");
    if (!req.user) {
      return res.redirect("/");
    }
    const { clientId, role, id: user_id } = req.user;
    switch (role) {
      case "master":
        User.findAll()
          .then(result => res.json(result))
          .catch(err => res.end());
        break;
      case "admin":
        User.findAll({ where: { clientId } })
          .then(result => {
            const cenzura = result.map(jeden => {
              const wynik = { email: jeden.email };
              return wynik;
            });
            return res.json(cenzura);
          })
          .catch(err => res.end());
        break;
      case "pracownik":
        User.findAll({ where: { clientId, id: user_id } })
          .then(result => res.json(result))
          .catch(err => res.end());
        break;
      default:
        res.redirect("/");
    }
  });
};
