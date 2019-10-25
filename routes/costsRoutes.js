const db = require("../models/index");
const Module = db.modules;
const Client = db.clients;
const User = db.users;
const Cost = db.costs;
const to = require("await-to-js").default;

module.exports = app => {
  app.post("/api/cost/remove/:id", (req, res, next) => {
    console.log("cost remove route", req.params.id);

    const id = req.params.id;
    if (!req.user) {
      console.log("przekierowanie");
      return res.redirect("/");
    }
    const { clientId } = req.user;
    Cost.destroy({ where: { clientId, id } })
      .then(() => res.end())
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.post("/api/cost/", (req, res, next) => {
    console.log("api/cost/");
    console.log(req.body);
    const { clientId, id: user_id } = req.user;
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

  app.post("/api/cost/edit/:id", async (req, res, next) => {
    console.log("edytuje cost api");
    // const id = req.params.id;
    const { id } = req.params;
    if (!req.user) {
      console.log("przekierowanie");
      return res.redirect("/");
    }
    let {
      // kiedy,
      // start,
      // stop,
      // aktywnosc_id,
      // miejsce_id,
      // inna,
      // uwagi
      kwota_netto,
      kwota_brutto
    } = req.body;
    const { id: userId, clientId } = req.user;
    kwota_netto = kwota_netto.replace(",", ".").replace("zł", "");
    kwota_brutto = kwota_brutto.replace(",", ".").replace("zł", "");
    // const modified_form = { ...req.body };
    // console.log(req.body, kwota_netto, kwota_brutto);
    // const a = { q: 1, w: 2 };
    // const b = { r: 2 };
    // const c = { ...a, ...b };

    Cost.update(Object.assign(req.body, { kwota_brutto, kwota_netto }), {
      where: { userId, id }
    })
      .then(() => res.end())
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  // app.post("/api/cost/remove/:id", (req, res, next) => {
  //   console.log('cost remove route');

  //   const { id, table } = req.params;
  //   if (!req.user) {
  //     console.log("przekierowanie");
  //     return res.redirect("/");
  //   }
  //   const { id: user_id, clientId } = req.user;

  //   Aktywnosci.destroy({ where: { user_id, id } })
  //     .then(() => res.end())
  //     .catch(err => {
  //       console.log(err);
  //       res.sendStatus(500);
  //     });
  // });
};
