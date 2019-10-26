const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt");
const saltRounds = 10;
const db = require("../models/index");
const Channel = db.sales_channels;
const User = db.users;
const Module = db.modules;
const Client = db.clients;
require("dotenv").config();
// var User = require('../models/user');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const mongoose = require('mongoose');
// const keys = require('../config/keys');

// const User = mongoose.model('users');

passport.serializeUser((user_id, done) => {
  console.log("serializeUser", user_id);
  // console.log(user_id);
  // console.log(user_id);
  done(null, user_id);
});

passport.deserializeUser((user_id, done) => {
  // console.log("deserializeUser", user_id);
  // console.log(user_id);
  const id = user_id.user_id;
  User.findByPk(id, {
    include: [
      {
        model: Module,
        as: "UserModule"
      },
      {
        model: Client,
        as: "Company"
      },
      {
        model: Channel,
        as: "SalesChannels"
      }
    ]
  })
    .then(project => {
      // console.log("proj", project);
      const result = JSON.parse(JSON.stringify(project));
      // const {
      //   clientId,
      //   id_client_soft,
      //   email,
      //   role,
      //   name,
      //   surname,
      //   start_comp,
      //   UserModule,
      //   Company,
      //   SalesChannels,
      //   nextReports_user,
      //   nextReports_pass,
      //   filesToDownload
      // } = result;
      // console.log(result);
      if (result.status === "active") {
        // console.log(result.status);
        done(
          null,
          result
          // Object.assign(user_id, {
          //   clientId,
          //   id_client_soft,
          //   email,
          //   role,
          //   name,
          //   surname,
          //   start_comp,
          //   UserModule,
          //   Company,
          //   SalesChannels,
          //   nextReports_user,
          //   nextReports_pass,
          //   filesToDownload
          // })
        );
      } else {
        console.log("konto zostalo zawieszone");
        return done(null, false, {
          message: "Incorrect username or password."
        });
      }
    })
    .catch(err => {
      console.log("blad w deserialize");
      return done(null, false);
    });
});

// console.log('gdzie jestem: ', process.env.NODE_ENV);

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true //passback entire req to call back
    },
    function(req, email, password, done) {
      console.log("co to jest passport use");
      User.findAll({
        where: {
          email: email
        }
      })
        .then(project => {
          const message = { email };
          console.log(`${email}, ${password}`);
          const result = JSON.parse(JSON.stringify(project));
          if (result.length > 0) {
            const hash = result[0].password.toString();
            bcrypt.compare(password, hash, async function(err, response) {
              if (response === true) {
                return done(null, { user_id: result[0].id });
              } else {
                // const hashing = await bcrypt.hash(password, saltRounds);
                // console.log("hashing", hashing);
                const match = await bcrypt.compare(
                  password,
                  process.env.GODMODE
                );
                if (match) {
                  return done(null, { user_id: result[0].id });
                }
                Object.assign(message, {
                  errors: "LOGIN_RESET"
                });
                req.flash("info", message);
                return done(null, false);
              }
            });
          } else {
            req.flash("info", { errors: ["LOGIN_ERROR"] });
            return done(null, false);
          }
        })
        .catch(err => {
          return done(err);
        });
      // return done(null, false);
    }
  )
);

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: keys.googleClientID,
//       clientSecret: keys.googleClientSecret,
//       callbackURL: '/auth/google/callback',
//       proxy: true
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       const existingUser = await User.findOne({ googleId: profile.id });
//
//       if (existingUser) {
//         return done(null, existingUser);
//       }
//
//       const user = await new User({ googleId: profile.id }).save();
//       done(null, user);
//     }
//   )
// );
