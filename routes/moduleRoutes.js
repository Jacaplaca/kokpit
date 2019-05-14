const db = require("../models/index");
const Module = db.modules;
const Client = db.clients;
const to = require("await-to-js").default;

module.exports = app => {
  app.post("/api/remove/modules/:id", async (req, res, next) => {
    const { id } = req.params;
    const { clientId } = req.user;
    if (!req.user) {
      return res.redirect("/");
    }
    const [errRemoving, remove] = await to(Module.destroy({ where: { id } }));

    if (!remove) {
      res.sendStatus(500);
    } else {
      res.json(remove);
    }
  });

  app.post("/api/modules", (req, res, next) => {
    const { clientId } = req.user;
    if (!req.user) {
      return res.redirect("/");
    }
    Module.create(req.body)
      .then(results => {
        return res.json(results);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.get("/api/modules/", async (req, res) => {
    console.log("api/modules");
    if (!req.user) res.redirect("/");
    const { clientId } = req.user;
    const [err, details] = await to(
      Module.findAll({
        include: [
          {
            model: Client,
            as: "ModuleClient",
            where: { id: clientId },
            attributes: []
          }
        ],
        where: {}
      })
    );
    if (!details) {
      res.sendStatus(500);
    } else {
      res.json(details);
    }
  });
  app.get("/api/allmodules/", async (req, res) => {
    if (!req.user) res.redirect("/");
    const { clientId } = req.user;

    const [err, details] = await to(
      Module.findAll({
        where: {}
      })
    );
    if (!details) {
      res.sendStatus(500);
    } else {
      res.json(details);
    }
  });

  app.get("/api/modulefirst/", async (req, res) => {
    console.log("api/modules");
    if (!req.user) res.redirect("/");
    const { clientId } = req.user;
    console.log("ChannelUsers", clientId);

    const [err, details] = await to(
      Module.findAll({
        where: { id: 1 }
      })
    );
    if (!details) {
      res.sendStatus(500);
    } else {
      res.json(details);
    }
  });
};
