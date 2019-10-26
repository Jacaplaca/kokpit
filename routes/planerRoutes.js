const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../models/index");
const Raporty = db.planer_raporty;
const Aktywnosci = db.planer_aktywnosci;
const PlanerKlienci = db.planer_klienci;
const Flag = db.flags;
const FlagsCustomers = db.flags_customers;
const to = require("await-to-js").default;

const assignFlagToCustomer = async (flags, customer_id) => {
  console.log("assignFlagToCustomer()", flags, customer_id);
  flags.map(async x => {
    const [errFlag, flag] = await to(
      Flag.findAll({ where: { short: x.short }, raw: true })
    );
    if (x.tick) {
      console.log("create", flag[0].id, customer_id);
      const [createErr, create] = await to(
        FlagsCustomers.create({ flag_id: flag[0].id, customer_id })
      );
    } else {
      console.log("destroy", flag[0].id, customer_id);
      const [destroyErr, destroy] = await to(
        FlagsCustomers.destroy({
          where: { flag_id: flag[0].id, customer_id }
        })
      );
    }
  });
};

module.exports = app => {
  app.post("/api/planerRaporty/", async (req, res, next) => {
    console.log("/api/planerRaporty/");
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
      planer_klienci_id,
      inna,
      uwagi,
      nawozy,
      nowyKlient,
      sprzedaz,
      zamowienie,
      zboza,
      rodo
    } = req.body;
    console.log(miejsce_id);
    const cleanStart = start.replace(" ", "").replace(" ", "");
    const cleanStop = stop.replace(" ", "").replace(" ", "");
    let flags = [];
    flags.push(rodo);

    const [err, raports] = await to(
      Raporty.create({
        kiedy,
        start: `${kiedy} ${cleanStart.split(":")[0]}:${
          cleanStart.split(":")[1]
        }`,
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
    );

    if (!raports) {
      console.log(err);
      return res.sendStatus(500);
    } else {
      await assignFlagToCustomer(flags, planer_klienci_id);
      return res.json(raports);
    }
  });

  app.post("/api/akt/edit/:id", async (req, res, next) => {
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
    const { id: user_id, clientId } = req.user;
    const cleanStart = start.replace(" ", "").replace(" ", "");
    const cleanStop = stop.replace(" ", "").replace(" ", "");

    Aktywnosci.update(
      {
        kiedy,
        start: `${kiedy} ${cleanStart.split(":")[0]}:${
          cleanStart.split(":")[1]
        }`,
        stop: `${kiedy} ${cleanStop.split(":")[0]}:${cleanStop.split(":")[1]}`,
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
  });
  app.post("/api/planerRaporty/edit/:id", async (req, res, next) => {
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
    const { id: user_id, clientId } = req.user;
    const cleanStart = start.replace(" ", "").replace(" ", "");
    const cleanStop = stop.replace(" ", "").replace(" ", "");
    const {
      planer_klienci_id,
      nawozy,
      nowyKlient,
      sprzedaz,
      zamowienie,
      zboza,
      rodo
    } = req.body;
    let flags = [];
    flags.push(rodo);

    const [err, raports] = await to(
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
    );

    if (!raports) {
      console.log(err);
      return res.sendStatus(500);
    } else {
      await assignFlagToCustomer(flags, planer_klienci_id);
      return res.end();
      // return res.json(raports);
    }
  });
};
