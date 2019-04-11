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

// const User = require('../models/user');
// const Op = Sequelize.Op;

// dynamicSort = property => {
//   let sortOrder = 1;
//   if (property[0] === "-") {
//     sortOrder = -1;
//     property = property.substr(1);
//   }
//   return function(a, b) {
//     const result =
//       a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
//     return result * sortOrder;
//   };
// };

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
      const { user_id, clientId } = req.user;
      if (!req.user) {
        return res.redirect("/");
      }
      let mods = [];

      // Street.findAll({
      //   where: { nazwa_1: { [Op.like]: `%${city.toLowerCase()}%` } },
      //   limit: 30
      // }).then(result =>
      //   res.json(
      //     result.map(x => {
      //       Object.assign(x.get(), { nazwa: x.get().nazwa_1 });
      //       // console.log(x);
      //     })
      //   )
      // );

      // City.findAll({
      //   where: {
      //     nazwa: { [Op.like]: `${city}%` }
      //   },
      //   include: [
      //     { model: Wojewodztwo, attributes: ["nazwa"] },
      //     {
      //       model: Powiat,
      //       attributes: ["nazwa"]
      //     },
      //     { model: Terc, attributes: ["nazwa"] }
      //   ],
      //   limit: 30
      Miejsca.findAll({
        where: {
          name: { [Op.like]: `%${city}%` }
        },
        limit: 30
      }).then(result => {
        // var promises = [];
        // let wojewodztwo;
        // let powiat;
        // let gmina;
        // const filtrowany = result.filter(x => x.rm !== "95");
        // const sortowany = result.sort(dynamicSort("rm"));
        // const sortRevSlice = sortowany.reverse().slice(0, 10);
        // return res.json(sortRevSlice);
        return res.json(result);

        // sortRevSlice.map((wynik, i) => {
        //   const { woj, pow, gmi } = wynik.get();
        //   var promise_woj = Terc.find({ where: { woj } }).then(x => {
        //     wojewodztwo = x.get().nazwa;
        //   });
        //   var promise_pow = Terc.find({ where: { woj, pow } }).then(x => {
        //     powiat = x.get().nazwa;
        //   });
        //   var promise_gmi = Terc.find({ where: { woj, pow, gmi } }).then(x => {
        //     gmina = x.get().nazwa;
        //     mods.push(
        //       Object.assign(wynik.get(), {
        //         wojewodztwo:
        //           wojewodztwo
        //             // .toLowerCase()
        //             .charAt(0)
        //             .toUpperCase() + wojewodztwo.slice(1),
        //         powiat:
        //           powiat
        //             // .toLowerCase()
        //             .charAt(0)
        //             .toUpperCase() + powiat.slice(1),
        //         gmina:
        //           gmina
        //             // .toLowerCase()
        //             .charAt(0)
        //             .toUpperCase() + gmina.slice(1)
        //       })
        //     );
        //   });
        //   promises.push(promise_woj, promise_pow, promise_gmi);
        // });
        // Promise.all(promises).then(y => {
        //   if (!drugiCzlon) {
        //     res.json(mods);
        //   } else if (drugiCzlon.length > 2) {
        //     const symboleMiast = mods.map(miasto => miasto.sym);
        //     Street.findAll({
        //       where: {
        //         nazwa_1: { [Op.like]: `%${drugiCzlon}%` },
        //         sym: symboleMiast
        //       },
        //       limit: 30
        //     }).then(result => {
        //       const ulice = result.map(b =>
        //         Object.assign(
        //           {},
        //           {
        //             cecha: b.get().cecha,
        //             nazwa_1: b.get().nazwa_1,
        //             nazwa_2: b.get().nazwa_2,
        //             sym: b.get().sym
        //           }
        //         )
        //       );
        //       const uliceImiasta = ulice.map(ulica => {
        //         const miasto = mods.filter(m => m.sym === ulica.sym);
        //         return Object.assign(ulica, miasto[0]);
        //       });
        //       return res.json(uliceImiasta);
        //     });
        //   }
        // });
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
      const { user_id, clientId } = req.user;
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

  app.get("/api/klienci/:query", (req, res, next) => {
    const query = req.params.query;

    const { user_id, clientId } = req.user;
    if (!req.user) {
      return res.redirect("/");
    }
    if (query.length < 3) {
      res.json([]);
    } else {
      PlanerKlienci.findAll({
        // where: {
        //   adr_Miejscowosc: { [Op.like]: `${query}%` },
        //   clientId
        // },
        where: {
          [Op.or]: [
            { adr_Miejscowosc: { [Op.like]: `${query}%` } },
            { adr_Kod: { [Op.like]: `${query}%` } },
            { nazwa: { [Op.like]: `${query}%` } }
          ],
          clientId
        },
        limit: 100
      })
        .then(result => {
          res.json(result);
        })
        .catch(err => {
          console.log(err);
          res.sendStatus(500);
        });
    }
  });

  app.get("/api/klienci", (req, res) => {
    res.json([]);
  });

  app.get("/api/message", (req, res) => {
    const message = req.flash("info");
    res.send(message);
  });

  app.post("/api/:table/edit/:id", (req, res, next) => {
    console.log("edytuje aktywnosc api");
    // const id = req.params.id;
    const { table, id } = req.params;
    if (!req.user) {
      console.log("przekierowanie");
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
    const { user_id, clientId } = req.user;
    const cleanStart = start.replace(" ", "").replace(" ", "");
    const cleanStop = stop.replace(" ", "").replace(" ", "");
    switch (table) {
      case "akt":
        Aktywnosci.update(
          {
            kiedy,
            start: `${kiedy} ${cleanStart.split(":")[0]}:${
              cleanStart.split(":")[1]
            }`,
            stop: `${kiedy} ${cleanStop.split(":")[0]}:${
              cleanStop.split(":")[1]
            }`,
            aktywnosc_id,
            miejsce_id: miejsce_id === "" ? null : miejsce_id,
            inna,
            uwagi
          },
          {
            where: { user_id, id }
          }
        )
          .then(() => res.end())
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
      case "planerRaporty":
        const {
          planer_klienci_id,
          nawozy,
          nowyKlient,
          sprzedaz,
          zamowienie,
          zboza
        } = req.body;
        Raporty.update(
          {
            kiedy,
            start: `${kiedy} ${cleanStart.split(":")[0]}:${
              cleanStart.split(":")[1]
            }`,
            stop: `${kiedy} ${cleanStop.split(":")[0]}:${
              cleanStop.split(":")[1]
            }`,
            aktywnosc_id,
            miejsce_id: miejsce_id === "" ? null : miejsce_id,
            planer_klienci_id:
              planer_klienci_id === "" ? null : planer_klienci_id,
            inna,
            uwagi,
            nawozy,
            nowyKlient,
            sprzedaz,
            zamowienie,
            zboza
          },
          {
            where: { user_id, id }
          }
        )
          .then(() => res.end())
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
      default:
    }
  });

  app.post("/api/cost/remove/:id", (req, res, next) => {
    const id = req.params.id;
    if (!req.user) {
      console.log("przekierowanie");
      return res.redirect("/");
    }
    const { user_id, clientId } = req.user;
    Cost.destroy({ where: { clientId, id } })
      .then(() => res.end())
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.post("/api/:table/remove/:id", (req, res, next) => {
    const { id, table } = req.params;
    if (!req.user) {
      console.log("przekierowanie");
      return res.redirect("/");
    }
    const { user_id, clientId } = req.user;
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
    const { user_id, clientId } = req.user;
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
    const { user_id, clientId } = req.user;
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
      // case "transaction":
      //   Transaction.find({
      //     // include: [{ model: Category }, { model: Group }],
      //     where: { clientId, id }
      //   })
      //     .then(result => {
      //       res.json(result);
      //     })
      //     .catch(err => {
      //       console.log(err);
      //       res.sendStatus(500);
      //     });
      //   break;
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
            { model: Miejsca, attributes: ["name"] }
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
            { model: Miejsca, attributes: ["name"] },
            { model: PlanerKlienci, attributes: ["nazwa"] }
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
    const { user_id, clientId } = req.user;
    if (!req.user) {
      return res.redirect("/");
    }
    Aktywnosci.findAll({
      include: [
        { model: RodzajAktywnosci, attributes: ["name"] },
        // { model: City, attributes: ["nazwa"] }
        { model: Miejsca, attributes: ["name"] }
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

  app.post("/api/cost/", (req, res, next) => {
    console.log("api/cost/");
    console.log(req.body);
    const { clientId, user_id } = req.user;
    if (!req.user) {
      return res.redirect("/");
    }
    const {
      nr_dokumentu,
      data_wystawienia,
      nazwa_pozycji,
      kwota_netto,
      kwota_brutto,
      categoryId,
      groupId
    } = req.body;
    Cost.create({
      nr_dokumentu,
      data_wystawienia,
      nazwa_pozycji,
      kwota_netto: kwota_netto.replace(",", ".").replace("zł", ""),
      kwota_brutto: kwota_brutto.replace(",", ".").replace("zł", ""),
      categoryId: categoryId,
      groupId: groupId,
      clientId,
      userId: user_id
    })
      .then(results => {
        return res.json(results);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.post("/api/aktywnosci/", (req, res, next) => {
    console.log("api/cost/");
    console.log(req.body);
    const { clientId, user_id } = req.user;
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

  app.post("/api/planerRaporty/", (req, res, next) => {
    console.log("/api/planerRaporty/");
    console.log(req.body);
    const { clientId, user_id } = req.user;
    if (!req.user) {
      return res.redirect("/");
    }
    const {
      kiedy,
      start,
      stop,
      aktywnosc_id,
      miejsce_id,
      planer_klienci_id,
      inna,
      uwagi,
      nawozy,
      nowyKlient,
      sprzedaz,
      zamowienie,
      zboza
    } = req.body;
    console.log(miejsce_id);
    const cleanStart = start.replace(" ", "").replace(" ", "");
    const cleanStop = stop.replace(" ", "").replace(" ", "");
    Raporty.create({
      kiedy,
      start: `${kiedy} ${cleanStart.split(":")[0]}:${cleanStart.split(":")[1]}`,
      stop: `${kiedy} ${cleanStop.split(":")[0]}:${cleanStop.split(":")[1]}`,
      aktywnosc_id,
      miejsce_id: miejsce_id === "" ? null : miejsce_id,
      inna,
      uwagi,
      firma_id: clientId,
      planer_klienci_id: planer_klienci_id === "" ? null : planer_klienci_id,
      user_id,
      nawozy,
      nowyKlient,
      sprzedaz,
      zamowienie,
      zboza
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
    const { clientId, role, user_id } = req.user;
    switch (table.table) {
      case "planerAktywnosci":
        Aktywnosci.findAll({
          include: [
            // { model: User },
            { model: RodzajAktywnosci, attributes: ["name"] },
            // { model: City, attributes: ["nazwa"] }
            { model: Miejsca, attributes: ["name"] }
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
      case "planerRaporty":
        Raporty.findAll({
          include: [
            // { model: User },
            { model: RodzajAktywnosci, attributes: ["name"] },
            // { model: City, attributes: ["nazwa"] },
            { model: Miejsca, attributes: ["name"] },
            { model: PlanerKlienci, attributes: ["nazwa"] }
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
    const { clientId, role, user_id } = req.user;
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
    const { clientId, role, user_id } = req.user;
    ChannelsConfig.find({ where: { clientId, month, name } })
      .then(result => res.json(result))
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.get("/api/config/month_channel/:day/:channelId", (req, res) => {
    const { day, channelId } = req.params;
    console.log(`/api/config/day_channel/${day}/${channelId}`);
    if (!req.user) {
      return res.redirect("/");
    }
    // const clientId = 2;
    const { clientId, role, user_id } = req.user;
    ChannelsConfig.findAll({
      attributes: ["id", "bonusType", "bonus", "suffix", "from", "to"],
      where: {
        clientId,
        channelId,
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
      },
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
        }
      ],
      raw: true
    })
      .then(result => {
        console.log("config", result);
        return res.json(result);
      })
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
    const { clientId, role, user_id } = req.user;
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
    const { clientId, role, user_id } = req.user;
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
    const { clientId, role, user_id } = req.user;
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
    const { clientId, role, user_id } = req.user;
    switch (table.table) {
      // case "channels":
      //   Channel.findAll({ where: { clientId } })
      //     .then(result => res.json(result))
      //     .catch(err => {
      //       console.log(err);
      //       res.sendStatus(500);
      //     });
      //   break;
      // case "transactions":
      //   Transaction.findAll({ where: { clientId, userId: user_id } })
      //     .then(result => res.json(result))
      //     .catch(err => {
      //       console.log(err);
      //       res.sendStatus(500);
      //     });
      //   break;
      case "items":
        Item.findAll({ where: { clientId } })
          .then(result => res.json(result))
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
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
          .then(result => res.json(result))
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
          // .then(result => {
          //   console.log(result);
          //   res.json(result);
          // })
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
    const { clientId, role, user_id } = req.user;
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

  // helper route to assign id for config according item Id
  // app.get("/api/modyfikuj/konfiguracje/po/itemsach", async (req, res, next) => {
  //   console.log("po itemsach");
  //   const items = await Item.findAll({ where: { clientId: 2 }, raw: true });
  //   const configs = await ChannelsConfig.findAll({
  //     where: { clientId: 2 },
  //     raw: true
  //   });
  //   const promises = configs.map(config => {
  //     const item = items.filter(item => config.name === item.name);
  //     return ChannelsConfig.update(
  //       { itemId: item[0].id },
  //       { where: { id: config.id } }
  //     );
  //   });
  //   await Promise.all(promises);
  //   console.log("Done!");
  //   res.json(items);
  // });
  //wypelnienie suffixa po bonusType
  // app.get("/api/modyfikuj/konfiguracje/po/itemsach", async (req, res, next) => {
  //   console.log("po itemsach");
  //   // const items = await Item.findAll({ where: { clientId: 2 }, raw: true });
  //   const configs = await ChannelsConfig.findAll({
  //     where: { clientId: 2 },
  //     raw: true
  //   });
  //
  //   const promises = configs.map(config => {
  //     // const item = items.filter(item => config.name === item.name);
  //     let suffix;
  //     if (config.bonusType === "stawka") {
  //       suffix = "zł";
  //     } else if (config.bonusType === "% marży") {
  //       suffix = "%";
  //     }
  //     return ChannelsConfig.update({ suffix }, { where: { id: config.id } });
  //   });
  //   await Promise.all(promises);
  //   console.log("Done!");
  //   res.json(configs);
  // });
  // wypelnienie id_client dla vitala
  // app.get("/api/modyfikuj/invoices4sms/po/client", async (req, res, next) => {
  //   console.log("po itemsach");
  //   const invoices = await Invoices4SMS.findAll({
  //     raw: true
  //   });
  //
  //   const promises = invoices.map(config => {
  //     return Invoices4SMS.update({ id_client: 2 }, { where: {} });
  //   });
  //   await Promise.all(promises);
  //   console.log("Done!");
  //   res.json(invoices);
  // });
};
