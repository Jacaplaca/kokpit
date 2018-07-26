const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { check, validationResult } = require('express-validator/check');
var bcrypt = require('bcrypt');
var async = require('async');
var nodemailer = require('nodemailer');
require('dotenv').config();
var crypto = require('crypto');
const saltRounds = 10;
const db = require('../db');
const User = require('../models/user');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// let email = '';
// let errorsy = [];
let formularz;
const validatorsRegister = [
  // username must be an email
  check(
    'email',
    'The email you entered is invalid, please try again.'
  ).isEmail(),
  // password must be at least 5 chars long
  check('password', 'Hasło musi mieć conajmniej 5 znaków.').isLength({ min: 2 })
  // check('email', 'Email must be at least 5 characters long.').isLength({
  //   min: 5
  // })
];

module.exports = app => {
  // app.get('/auth/register', (req, res) => {
  //   res.send('req.user');
  // });

  app.post(
    '/auth/login',
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureFlash: 'Invalid username or password.'
    })
  );

  app.post('/auth/register', validatorsRegister, (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const { email, password } = req.body;
    const message = { email };
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsString = errors.array();
      const errorsy = errorsString.map(error => error.msg);
      Object.assign(message, { errors: errorsy });
      req.flash('info', message);
      res.redirect('/register');
    } else {
      User.findAll({
        where: {
          email: email
        }
      })
        .then(result => {
          console.log(result);
          if (result.length > 0) {
            console.log('juz jest konto ');
            req.flash('info', {
              errors: 'Konto o podanym adresie email już istnieje'
            });
            res.redirect('/register');
          } else {
            console.log('zakladamkonto');
            console.log(email);
            bcrypt.hash(password, saltRounds, function(err, hash) {
              User.create({
                email: email,
                password: hash,
                status: 'active'
              })
                .then(results => {
                  const user_id = JSON.parse(JSON.stringify(results));
                  req.login({ user_id: user_id.id }, function(err) {
                    res.redirect('/');
                  });
                })
                .catch(err => {
                  console.log('zapisuje');
                  console.log(err);
                  res.redirect('/register');
                });
            });
          }
        })
        .catch(err => {
          console.log('szuka tego samego maila');
          console.log(err);
          res.redirect('/register');
        });
      // bcrypt.hash(password, saltRounds, function(err, hash) {
      //   db.query(
      //     'INSERT INTO users (email, password) VALUES (?, ?)',
      //     [email, hash],
      //     (error, results, fields) => {
      //       // if (error) throw error;
      //       if (error) {
      //         console.log(error);
      //         // Object.assign(message, { errors: "Konto o podanym adresie email już istnieje" });
      //         req.flash('info', {
      //           errors: 'Konto o podanym adresie email już istnieje'
      //         });
      //         res.redirect('/register');
      //       } else {
      //         db.query('SELECT LAST_INSERT_ID() as user_id', function(
      //           error,
      //           results,
      //           fields
      //         ) {
      //           if (error) throw error;
      //           // if (error) {
      //           //   console.log(error);
      //           // }
      //           const user_id = results[0];
      //           req.login(user_id, function(err) {
      //             res.redirect('/');
      //           });
      //         });
      //       }
      //     }
      //   );
      // });
    }
  });

  // app.post('/auth/register', (req, res, next) => {
  //   const { email, password } = req.body;
  //   // res.render('index', { title: 'Reg Comp' });
  //   db.query(
  //     'INSERT INTO users (email, password) VALUES (?, ?)',
  //     [email, password],
  //     (error, results, fields) => {
  //       if (error) throw error;
  //       res.redirect('/');
  //     }
  //   );
  //   // res.send({ hiaa: '3' });
  // });

  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get(
    '/auth/google/callback',
    passport.authenticate('google'),
    (req, res) => {
      res.redirect('/surveys');
    }
  );

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/current_user', (req, res) => {
    console.log(req.user);
    res.send(req.user);
    // res.sendStatus(req.user);
    // res.send({ errors: 'asdb', email: 'asdf@asdf.com' });
  });

  app.get('/api/message', (req, res) => {
    const message = req.flash('info');
    console.log(message);
    res.send(message);
  });

  app.post('/auth/reset', (req, res, next) => {
    const email = req.body.email;
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          console.log(token);
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ where: { email } })
          .then(user => {
            console.log('resetuje i szukam uzytkownika zeby zapisac tokeny');
            // console.log(user);
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 36000000;

            user
              .save()
              .then(() => {
                console.log('mailujemy');
                var smtpTransport = nodemailer.createTransport({
                  service: 'Gmail',
                  auth: {
                    user: 'bikerhill@gmail.com',
                    pass: process.env.GMAILPW
                  }
                });
                const mailOptions = {
                  // to: user.email,
                  to: 'dziewanowski@gmail.com',
                  from: 'bikerhill@gmail.com',
                  subject: 'Password Reset',
                  text: `http://${req.headers.host}/reset/token/${token}`
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                  console.log('mail sent');
                });
                done(token, user);
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      }
    ]);
    req.flash('info', {
      errors: 'Wiadomość wysłana'
    });
    res.redirect('/login');
  });

  app.get('/reset/token/:token', function(req, res, done) {
    console.log('szukamy tokena');
    console.log(req.params.token);
    User.findOne({
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    }).then(wynik => {
      if (!wynik) {
        req.flash('info', {
          errors: ['Password reset token is invalid or has expired.']
        });
        return res.redirect('/login');
      }
      req.flash('info', { token: req.params.token });
      return res.redirect('/reset');
      // res.send('POST request to the homepage');
      // res.end();
    });
  });

  app.post(
    '/reset/token/:token',
    [
      check('password1', 'Hasło musi mieć conajmniej 5 znaków.').isLength({
        min: 2
      })
    ],
    (req, res, done) => {
      const { password1, password2 } = req.body;
      const validatorsErrors = validationResult(req);
      const valErrStr = validatorsErrors.array();
      if (!validatorsErrors.isEmpty()) {
        const validacyjneBledyArray = valErrStr.map(error => error.msg);
        console.log(validacyjneBledyArray);
        req.flash('info', {
          token: req.params.token,
          errors: validacyjneBledyArray
        });
        return res.redirect(`/reset/token/${req.params.token}`);
      }
      User.findOne({
        where: {
          resetPasswordToken: req.params.token,
          resetPasswordExpires: { [Op.gt]: Date.now() }
        }
      })
        .then(user => {
          if (!user) {
            req.flash('info', {
              errors: ['Token wygasł lub jest nieprawidłowy.']
            });
            return res.redirect('/login');
          } else {
            if (password1 === password2) {
              console.log('pasuja hasla');
              bcrypt.hash(password1, saltRounds, function(err, hash) {
                user.resetPasswordToken = 111;
                user.resetPasswordExpires = 1632560851436;
                user.password = hash;
                user
                  .save()
                  .then(results => {
                    console.log('zapisuje nowe haslo');
                    const user_id = JSON.parse(JSON.stringify(results));
                    req.login({ user_id: user_id.id }, function(err) {
                      res.redirect('/');
                    });
                  })
                  .catch(err => console.log(err));
              });
            } else {
              req.flash('info', {
                token: req.params.token,
                errors: ['Hasła nie pasują do siebie.']
              });
              return res.redirect(`/reset/token/${req.params.token}`);
            }
          }
        })
        .catch(err => console.log(err));
    }
  );

  // app.get('/api/form', (req, res) => {
  //   // console.log('api form');
  //   // const message = req.flash('info');
  //   // console.log(message);
  //
  //   // console.log('api/form');
  //   // console.log(req.isAuthenticated());
  //   // res.send(req.user);
  //   // res.send({ message: ['asdfdfd', 'asdf'] });
  //   // res.send({ message: message });
  //   res.send(formularz);
  // });

  // passport.serializeUser((user_id, done) => {
  //   console.log('serializeUser');
  //   console.log(user_id);
  //   done(null, user_id);
  // });
  //
  // passport.deserializeUser((user_id, done) => {
  //   console.log('deserializeUser');
  //   console.log(user_id);
  //   done(null, user_id);
  // });

  // passport.use(
  //   'local-login',
  //   new LocalStrategy(function(email, password, done) {
  //     console.log('passport local');
  //     console.log(email);
  //     console.log(password);
  //     return done(null, false);
  //   })
  // );

  // function authenticationMiddleware() {
  //   return (req, res, next) => {
  //     console.log(
  //       `req.session.passport.user: ${JSON.stringify(req.session.passport)}`
  //     );
  //
  //     if (req.isAuthenticated()) return next();
  //     res.redirect('/login');
  //   };
  // }
};
