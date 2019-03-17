const passport = require("passport");
const { check, validationResult } = require("express-validator/check");
var bcrypt = require("bcrypt");
var async = require("async");
var nodemailer = require("nodemailer");
require("dotenv").config();
var crypto = require("crypto");
const saltRounds = 10;
// const db = require('../db');
const db = require("../models/index");
const User = db.users;
// const User = require('../models/user');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// let email = '';
// let errorsy = [];
const validatorsRegister = [
  // username must be an email
  check(
    "email",
    "The email you entered is invalid, please try again."
  ).isEmail(),
  // password must be at least 5 chars long
  check("password", "Hasło musi mieć conajmniej 5 znaków.").isLength({ min: 2 })
  // check('email', 'Email must be at least 5 characters long.').isLength({
  //   min: 5
  // })
];

const findMaxClientId = async () => {
  const result = await User.findAll({});
  const clientIds = result.map(x => x.get().clientId);
  return Math.max(...clientIds);
};

module.exports = app => {
  // app.get('/auth/register', (req, res) => {
  //   res.send('req.user');
  // });

  app.get("/auth/email/:email", (req, res) => {
    User.findOne({
      where: { email: req.params.email }
    })
      .then(user => {
        // console.log(res.json(user));
        res.json({ free: user === null });
      })
      .catch(err => {
        console.log(err);
        res.redirect("/register");
      });
  });

  // app.get("/auth/users", async (req, res) => {
  //   const result = await User.findAll({});
  //   res.json(result);
  // });

  app.post(
    "/auth/login",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/login",
      failureFlash: "Invalid username or password."
    })
  );

  app.post("/auth/register", validatorsRegister, async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const { email, password } = req.body;
    console.log("email pass", email, password);
    console.log("req.user", req.user);
    let clientId = 0;
    let users = 0;
    let products = 0;
    let role = "pracownik";
    if (req.user) {
      clientId = req.user.clientId;
    } else {
      clientId = (await findMaxClientId()) + 1;
      role = "master";
      users = 1;
      products = 1;
    }

    const message = { email };
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorsString = errors.array();
      const errorsy = errorsString.map(error => error.msg);
      Object.assign(message, { errors: errorsy });
      req.flash("info", message);
      res.redirect("/register");
    } else {
      User.findAll({
        where: {
          email: email
        }
      })
        .then(result => {
          // console.log(result);
          if (result.length > 0) {
            console.log("juz jest konto ");
            req.flash("info", {
              errors: "Konto o podanym adresie email już istnieje"
            });
            res.redirect("/register");
          } else {
            console.log("zakladamkonto");
            console.log(email);
            bcrypt.hash(password, saltRounds, function(err, hash) {
              User.create({
                email: email,
                password: hash,
                role: role,
                clientId,
                products,
                users,
                status: "active"
              })
                .then(results => {
                  console.log("after register", results.get().id);
                  // res.json({ accountCreated: true });
                  res.json(result);
                  // const user_id = JSON.parse(JSON.stringify(results));
                  // req.login({ user_id: user_id.id }, function(err) {
                  //   res.redirect("/");
                  // });
                })
                .catch(err => {
                  console.log("zapisuje");
                  console.log(err);
                  res.redirect("/register");
                });
            });
          }
        })
        // .then(() => res.redirect("/"))
        .catch(err => {
          console.log("szuka tego samego maila");
          console.log(err);
          res.redirect("/register");
        });
    }
  });

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("/surveys");
    }
  );

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  app.get("/api/current_user", (req, res) => {
    // res.json({ user: 'aaa' });
    res.send(req.user);
  });

  app.post("/auth/reset", (req, res, next) => {
    const email = req.body.email;
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString("hex");
          console.log(token);
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ where: { email } })
          .then(user => {
            console.log("resetuje i szukam uzytkownika zeby zapisac tokeny");
            // console.log(user);
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 36000000;

            user
              .save()
              .then(() => {
                console.log("mailujemy");
                var smtpTransport = nodemailer.createTransport({
                  host: process.env.RESETMAILSMTP,
                  port: 587,
                  secure: false, // true for 465, false for other ports
                  auth: {
                    user: process.env.RESETMAIL, // generated ethereal user
                    pass: process.env.RESETMAILPW // generated ethereal password
                  }
                });
                const mailOptions = {
                  to: user.email,
                  // to: 'dziewanowski@gmail.com',
                  from: process.env.RESETMAIL,
                  subject: "Password Reset ✔",
                  text: `http://${req.headers.host}/reset/token/${token}`
                };
                smtpTransport.sendMail(mailOptions, (error, info) => {
                  if (error) {
                    return console.log(error);
                  }
                  console.log("Message sent: %s", info.messageId);
                  // Preview only available when sending through an Ethereal account
                  console.log(
                    "Preview URL: %s",
                    nodemailer.getTestMessageUrl(info)
                  );

                  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                });
                done(token, user);
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      }
    ]);
    req.flash("info", {
      errors: "Wiadomość wysłana"
    });
    res.redirect("/login");
  });

  app.get("/reset/token/:token", function(req, res, done) {
    // console.log('szukamy tokena');
    // console.log(req.params.token);
    User.findOne({
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    }).then(wynik => {
      if (!wynik) {
        req.flash("info", {
          errors: ["Password reset token is invalid or has expired."]
        });
        return res.redirect("/login");
      }
      req.flash("info", { token: req.params.token });
      return res.redirect("/reset");
      // res.send('POST request to the homepage');
      // res.end();
    });
  });

  app.post(
    "/reset/token/:token",
    [
      check("password1", "Hasło musi mieć conajmniej 5 znaków.").isLength({
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
        req.flash("info", {
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
            req.flash("info", {
              errors: ["Token wygasł lub jest nieprawidłowy."]
            });
            return res.redirect("/login");
          } else {
            if (password1 === password2) {
              console.log("pasuja hasla");
              bcrypt.hash(password1, saltRounds, function(err, hash) {
                user.resetPasswordToken = null;
                user.resetPasswordExpires = null;
                user.password = hash;
                user
                  .save()
                  .then(results => {
                    console.log("zapisuje nowe haslo");
                    const user_id = JSON.parse(JSON.stringify(results));
                    req.login({ user_id: user_id.id }, function(err) {
                      res.redirect("/");
                    });
                  })
                  .catch(err => console.log(err));
              });
            } else {
              req.flash("info", {
                token: req.params.token,
                errors: ["Hasła nie pasują do siebie."]
              });
              return res.redirect(`/reset/token/${req.params.token}`);
            }
          }
        })
        .catch(err => console.log(err));
    }
  );
};
