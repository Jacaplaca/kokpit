const permit = require('../services/permission');
// import permit from '../services/permission';

const db = require('../models/index');
const User = db.users;
const Group = db.groups;
const Category = db.categories;
const Cost = db.costs;
// const User = require('../models/user');
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;

module.exports = app => {
  app.get('/api/message', (req, res) => {
    const message = req.flash('info');
    res.send(message);
  });

  app.post('/api/cost/edit/:id', (req, res, next) => {
    console.log('edytuje cost api');
    const id = req.params.id;
    if (!req.user) {
      return res.redirect('/');
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
        kwota_netto: kwota_netto.replace(',', '.'),
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

  app.post('/api/cost/remove/:id', (req, res, next) => {
    console.log('remove cost api');
    const id = req.params.id;
    if (!req.user) {
      return res.redirect('/');
    }
    const { user_id, clientId } = req.user;
    Cost.destroy({ where: { clientId, id } })
      .then(() => res.end())
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });

  app.get('/api/cost/:id', (req, res, next) => {
    console.log('get api/cost/');
    const id = req.params.id;
    const { user_id, clientId } = req.user;
    if (!req.user) {
      return res.redirect('/');
    }
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

  app.post('/api/cost/', (req, res, next) => {
    console.log('api/cost/');
    console.log(req.body);
    if (!req.user) {
      return res.redirect('/');
    }
    const {
      nr_dokumentu,
      data_wystawienia,
      nazwa_pozycji,
      kwota_netto,
      categoryId,
      groupId
    } = req.body;
    const { user_id, clientId } = req.user;
    Cost.create({
      nr_dokumentu,
      data_wystawienia,
      nazwa_pozycji,
      kwota_netto: kwota_netto.replace(',', '.'),
      categoryId,
      groupId,
      clientId,
      userId: user_id
    })
      .then(() => res.end())
      // .then(result => next())
      // .then(result => res.redirect('/costs'))
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
    // res.end();
  });

  app.get('/api/table/:table', (req, res) => {
    const table = req.params;
    if (!req.user) {
      return res.redirect('/');
    }
    console.log(table);
    const { clientId, role, user_id } = req.user;
    console.log(clientId);
    switch (table.table) {
      case 'category':
        console.log('jestem w category');
        Category.findAll({ where: { clientId } })
          .then(result => res.json(result))
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
      case 'group':
        Group.findAll({ where: { clientId } })
          .then(result => res.json(result))
          .catch(err => {
            console.log(err);
            res.sendStatus(500);
          });
        break;
      case 'costs':
        Cost.findAll({
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
        break;
      default:
        res.sendStatus(500);
    }
  });
  // api.get("/account", permit('owner', 'employee'), (req, res) => req.json({currentUser: request.user}));

  app.get('/api/users', (req, res) => {
    console.log('api/users');
    if (!req.user) {
      return res.redirect('/');
    }
    const { clientId, role, user_id } = req.user;
    switch (role) {
      case 'master':
        User.findAll()
          .then(result => res.json(result))
          .catch(err => res.end());
        break;
      case 'admin':
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
      case 'pracownik':
        User.findAll({ where: { clientId, id: user_id } })
          .then(result => res.json(result))
          .catch(err => res.end());
        break;
      default:
        res.redirect('/');
    }
  });
};
