const db = require("../models/index");
const Client = db.clients;
const User = db.users;
const DocumentTransaction = db.documents_transactions;
const Customer = db.planer_klienci;
const to = require("await-to-js").default;

module.exports = app => {
  app.get("/api/documentstransactions", (req, res) => {
    console.log("/api/documentstransactions", req.user);
    const { clientId, role, id: user_id } = req.user;

    let where = {};
    if (role === "master") {
      where = { clientId };
    } else {
      where = { clientId, userId: user_id };
    }

    DocumentTransaction.findAll({
      where,
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "name", "surname"]
        },
        {
          model: Customer,
          as: "Customer"
        }
      ]
    })
      .then(result => {
        return res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.post("/api/documentstransactions/", (req, res, next) => {
    console.log("api/documentstransactions/");
    console.log(req.body);
    const { clientId, id: user_id } = req.user;
    if (!req.user) {
      return res.redirect("/");
    }
    const { customer, doc, date, ammount } = req.body;
    DocumentTransaction.create({
      documents_nr: doc,
      date,
      ammount_netto: ammount.replace(",", ".").replace("zł", ""),
      userId: user_id,
      clientId,
      customerId: customer
    })
      .then(results => {
        return res.json(results);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });
  app.post("/api/documentstransactions/:id", (req, res, next) => {
    console.log("api/documentstransactions/");
    const { id } = req.params;
    const { clientId, id: user_id } = req.user;
    console.log("id", id, user_id);
    if (!req.user) {
      return res.redirect("/");
    }
    const { customer, doc, date, ammount } = req.body;
    DocumentTransaction.update(
      {
        documents_nr: doc,
        date,
        ammount_netto: ammount.replace(",", ".").replace("zł", ""),
        userId: user_id,
        clientId,
        customerId: customer
      },
      { where: { id, userId: user_id } }
    )
      .then(results => {
        return res.json(results);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.get("/api/documentstransactions/:id", async (req, res, next) => {
    console.log("api/documentstransactions/id");
    const { id } = req.params;
    const { clientId, id: user_id, role } = req.user;
    console.log(id, clientId, user_id, role);
    if (!req.user) {
      return res.redirect("/");
    }

    const [err, trans] = await to(DocumentTransaction.findByPk(id));
    // console.log("trans", trans);

    let where = { id };
    if (role === "master" && trans.clientId === clientId) {
      where = { id };
    } else {
      where = { userId: user_id, id };
    }

    // const { customer, doc, date, ammount } = req.body;
    DocumentTransaction.find({
      where,
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "name", "surname"]
        },
        {
          model: Customer,
          as: "Customer"
        }
      ]
    })
      .then(result => {
        console.log("result in documentstransactions/id", result);
        return res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.post("/api/documentstransactions/delete/:id", (req, res, next) => {
    // console.log("transaction/delete/id");
    const id = req.params.id;
    if (!req.user) {
      // console.log("przekierowanie");
      return res.redirect("/");
    }
    // let ids;
    // ids.push(id);
    const { id: user_id, clientId } = req.user;
    // console.log("trans remove id", ids.split(","));
    DocumentTransaction.destroy({
      where: { clientId, id: id.split(","), userId: user_id }
    })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });
};
