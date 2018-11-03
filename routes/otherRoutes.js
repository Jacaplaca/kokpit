const permit = require("../services/permission");
// import permit from '../services/permission';

const db = require("../models/index");
const User = db.users;
const Group = db.groups;
const Category = db.categories;
const RodzajAktywnosci = db.planer_akt_rodz;
const Cost = db.costs;
const Aktywnosci = db.planer_aktywnosci;
const Raporty = db.planer_raporty;
const Miejsca = db.miejsca;
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

dynamicSort = property => {
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function(a, b) {
    const result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
};

module.exports = app => {
  app.get("/api/byname/:table/:query", (req, res, next) => {
    const query = req.params.query;
    const table = req.params.table;
    const { user_id, clientId } = req.user;
    if (!req.user) {
      return res.redirect("/");
    }
    switch (table) {
      case "category":
        Category.findAll({
          where: { clientId, name: { [Op.like]: `%${query}%` } }
        })
          .then(result => {
            res.json(result);
          })
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
      case "group":
        Group.findAll({
          where: { clientId, name: { [Op.like]: `%${query}%` } }
        })
          .then(result => {
            res.json(result);
          })
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
      case "city":
        Miejsca.findAll({
          where: {
            name: { [Op.like]: `%${query}%` }
          },
          offset: 2
          //limit: 30
        }).then(result => {
          return res.json(result);
        });
        break;
      case "dniDoRaportu":
        Aktywnosci.findAll({
          where: { user_id, wyslano: 1 }
        })
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
      case "planerClient":
        PlanerKlienci.findAll({
          where: {
            [Op.or]: [
              { adr_Miejscowosc: { [Op.like]: `${query}%` } },
              { adr_Kod: { [Op.like]: `${query}%` } },
              { name: { [Op.like]: `${query}%` } }
            ],
            clientId
          }
          //limit: 50
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

  app.get("/api/limit/:table/:value/:offset/:limit", (req, res, next) => {
    const value = req.params.value;
    const table = req.params.table;
    let limit = Math.trunc(req.params.limit);
    limit += 1;
    const offset = Math.trunc(req.params.offset);
    const { user_id, clientId } = req.user;
    console.log(`limit: ${limit}, offset: ${offset}`);
    if (!req.user) {
      return res.redirect("/");
    }
    switch (table) {
      case "miejsce_id":
        Miejsca.findAll({
          where: {
            name: { [Op.like]: `%${value}%` }
          },
          offset,
          limit
        }).then(result => {
          return res.json(result);
        });
        break;
      case "planer_klienci_id":
        PlanerKlienci.findAll({
          where: {
            [Op.or]: [
              { adr_Miejscowosc: { [Op.like]: `${value}%` } },
              { adr_Kod: { [Op.like]: `${value}%` } },
              { name: { [Op.like]: `${value}%` } }
            ],
            clientId
          },
          offset,
          limit
          //limit: 50
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

  app.get("/api/klienci", (req, res) => {
    res.json([]);
  });

  app.get("/api/message", (req, res) => {
    const message = req.flash("info");
    res.send(message);
  });

  app.post("/api/cost/edit/:id", (req, res, next) => {
    console.log("edytuje cost api");
    const id = req.params.id;
    if (!req.user) {
      console.log("przekierowanie");
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
    console.log(req.body);
    const { user_id, clientId } = req.user;
    Cost.update(
      {
        nr_dokumentu,
        data_wystawienia,
        nazwa_pozycji,
        kwota_netto: kwota_netto.replace(",", ".").replace("zł", ""),
        kwota_brutto: kwota_brutto.replace(",", ".").replace("zł", ""),
        categoryId,
        groupId
      },
      {
        where: { clientId, id }
      }
    )
      .then(() => res.end())
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
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
            { model: PlanerKlienci, attributes: ["name"] }
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
            { model: PlanerKlienci, attributes: ["name"] }
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

  app.get("/api/table/:table", (req, res) => {
    const table = req.params;
    if (!req.user) {
      return res.redirect("/");
    }
    const { clientId, role, user_id } = req.user;
    switch (table.table) {
      case "categoryId":
        Category.findAll({ where: { clientId } })
          .then(result => res.json(result))
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
      case "groupId":
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
      case "city":
        Miejsca.findAll({
          //limit: 30
        })
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
      case "planerClient":
        PlanerKlienci.findAll({
          where: { clientId }
          //limit: 50
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
};
