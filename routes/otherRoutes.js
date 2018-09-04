const permit = require("../services/permission");
// import permit from '../services/permission';

const db = require("../models/index");
const User = db.users;
const Group = db.groups;
const Category = db.categories;
const Cost = db.costs;
const City = db.gus_simc;
const Street = db.gus_ulic;
const Terc = db.gus_terc;
const Wojewodztwo = db.gus_terc_woj;
const Powiat = db.gus_terc_pow;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const axios = require("axios");
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
  // app.get("/api/powiat/miel", (req, res, next) => {
  //   const rezultaty = Powiat.findAll()
  //     .then(result => {
  //       var promises = [];
  //
  //       result.map((wynik, i) => {
  //         const { pow_id, woj_id, id } = wynik.get();
  //         console.log(woj_id);
  //         Powiat.update(
  //           {
  //             woj_pow: woj_id + pow_id
  //           },
  //           {
  //             where: { id }
  //           }
  //         )
  //           .then(() => res.end())
  //           .catch(err => {
  //             console.log(err);
  //             res.sendStatus(500);
  //           });
  //       });
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       res.sendStatus(500);
  //     });
  // });

  // app.get("/api/city/miel", (req, res, next) => {
  //   const rezultaty = City.findAll().then(result => {
  //     var promises = [];
  //
  //     result
  //       .map((wynik, i) => {
  //         const { woj, pow, gmi, id } = wynik.get();
  //         // console.log(woj_id);
  //         setTimeout(function() {
  //           City.update(
  //             {
  //               woj_pow: woj + pow,
  //               woj_pow_gmi: woj + pow + gmi
  //             },
  //             {
  //               where: { id }
  //             }
  //           )
  //             .then(() => res.end())
  //             .catch(err => {
  //               console.log(err);
  //               res.sendStatus(500);
  //             });
  //         });
  //       })
  //       .catch(err => {
  //         console.log(err);
  //         res.sendStatus(500);
  //       });
  //   }, 100);
  // });

  app.get("/api/city/:city", (req, res, next) => {
    // console.log("get api/city/");
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

      City.findAll({
        where: {
          nazwa: { [Op.like]: `${city}%` }
          // attributes: {["id", "nazwa", "mz", "woj", "pow", "gmi"]}
        },
        // include: [{ model: Wojewodztwo }],
        include: [
          { model: Wojewodztwo, attributes: ["nazwa"] },
          {
            model: Powiat,
            attributes: ["nazwa"]
            // include: { model: Wojewodztwo, attributes: ["id", "nazwa"] }
            // where: { woj_id: Sequelize.col("City.woj") }
          },
          { model: Terc, attributes: ["nazwa"] }
        ],
        limit: 30
      }).then(result => {
        var promises = [];
        let wojewodztwo;
        let powiat;
        let gmina;
        // const filtrowany = result.filter(x => x.rm !== "95");
        const sortowany = result.sort(dynamicSort("rm"));
        const sortRevSlice = sortowany.reverse().slice(0, 10);
        return res.json(sortRevSlice);

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
      categoryId,
      groupId
    } = req.body;
    console.log(req.body);
    const { user_id, clientId } = req.user;
    console.log(req.params);
    console.log(clientId);
    Cost.update(
      {
        nr_dokumentu,
        data_wystawienia,
        nazwa_pozycji,
        kwota_netto: kwota_netto.replace(",", ".").replace("zł", ""),
        categoryId: categoryId.value,
        groupId: groupId.value
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

  app.get("/api/cost/:id", (req, res, next) => {
    console.log("get api/cost/");
    const id = req.params.id;
    const { user_id, clientId } = req.user;
    console.log(req.user);
    if (!req.user) {
      return res.redirect("/");
    }
    console.log("bedzie sie updatowac czy nie");
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
      categoryId,
      groupId
      // user_id,
      // clientId
    } = req.body;
    Cost.create({
      nr_dokumentu,
      data_wystawienia,
      nazwa_pozycji,
      kwota_netto: kwota_netto.replace(",", ".").replace("zł", ""),
      categoryId: categoryId.value,
      groupId: groupId.value,
      clientId,
      userId: user_id
    })
      .then(results => {
        // console.log(results);
        return res.json(results);
        // return;
      })
      // .then(() => res.end())
      // .then(result => next())
      // .then(result => res.redirect('/costs'))
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
    // res.end();
  });

  //  async() => {
  //     const city1 = await fetch(cityAPI).then(r => r.json());
  //     const city2 = await fetch(cityAPI).then(r => r.json());
  //
  //     console.log(city1.name);
  //     console.log(city2.name);
  // }

  app.get("/api/table/:table", (req, res) => {
    const table = req.params;
    if (!req.user) {
      return res.redirect("/");
    }
    console.log(table);
    const { clientId, role, user_id } = req.user;
    console.log(clientId);
    switch (table.table) {
      case "category":
        console.log("jestem w category");
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
      case "costs":
        const foo = async () => {
          const fetchuj = await Cost.findAll({
            include: [{ model: Category }, { model: Group }],
            where: { clientId }
          })
            .then(result => {
              // console.log(result[1].dataValues);
              res.json(result);
            })
            .catch(err => {
              console.log(err);
              res.sendStatus(500);
            });
        };
        foo();

        // Cost.findAll({
        //   include: [{ model: Category }, { model: Group }],
        //   where: { clientId }
        // })
        // .then(result => {
        //   // console.log(result[1].dataValues);
        //   res.json(result);
        // })
        // .catch(err => {
        //   console.log(err);
        //   res.sendStatus(500);
        // });
        break;
      default:
        res.sendStatus(500);
    }
  });
  // api.get("/account", permit('owner', 'employee'), (req, res) => req.json({currentUser: request.user}));

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