const db = require("../models/index");
const PlanerKlienci = db.planer_klienci;
const to = require("await-to-js").default;

module.exports = app => {
  app.get("/api/customer/:id", async (req, res) => {
    const { id } = req.params;
    console.log(`api/customer/${id}`);
    if (!req.user) res.redirect("/");
    const { clientId, role, user_id } = req.user;

    const query = { where: { clientId, id } };
    const [err, items] = await to(PlanerKlienci.find(query));
    if (!items) {
      res.sendStatus(500);
    } else {
      res.json(items);
    }
  });
};
