const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const db = require("../models/index");
const PlanerKlienci = db.planer_klienci;
const Flag = db.flags;
const to = require("await-to-js").default;

module.exports = app => {
  app.get("/api/customers/:query", (req, res, next) => {
    const query = req.params.query;

    const { clientId } = req.user;
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
            { name: { [Op.like]: `${query}%` } }
          ],
          clientId
        },
        include: [
          {
            model: Flag,
            as: "CustomerFlag"
          }
        ],
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

  app.get("/api/customer/:id", async (req, res) => {
    const { id } = req.params;
    console.log(`api/customer/${id}`);
    if (!req.user) res.redirect("/");
    const { clientId, role } = req.user;

    const query = {
      where: { clientId, id },
      include: [
        {
          model: Flag,
          as: "CustomerFlag"
        }
      ]
    };
    const [err, items] = await to(PlanerKlienci.find(query));
    if (!items) {
      res.sendStatus(500);
    } else {
      res.json(items);
    }
  });
};
