const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt");
const db = require("../models/index");
const User = db.users;
// var User = require('../models/user');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const mongoose = require('mongoose');
// const keys = require('../config/keys');

// const User = mongoose.model('users');

passport.serializeUser((user_id, done) => {
  // console.log('serializeUser');
  // console.log(user_id);
  // console.log(user_id);
  done(null, user_id);
});

passport.deserializeUser((user_id, done) => {
  // console.log('deserializeUser');
  // console.log(user_id);
  const id = user_id.user_id;
  User.findById(id)
    .then(project => {
      const result = JSON.parse(JSON.stringify(project));
      const {
        clientId,
        email,
        role,
        costs,
        planer,
        raporty,
        nextReports,
        serwis,
        channel_first
      } = result;
      // console.log(result);
      if (result.status === "active") {
        // console.log(result.status);
        done(
          null,
          Object.assign(user_id, {
            clientId,
            email,
            role,
            costs,
            planer,
            raporty,
            nextReports,
            serwis,
            channel_first
          })
        );
      } else {
        console.log("konto zostalo zawieszone");
        return done(null, false, {
          message: "Incorrect username or password."
        });
      }
    })
    // .catch(err =>
    //   done(null, false, {
    //     message: 'Incorrect username or password.'
    //   })
    // );
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
            bcrypt.compare(password, hash, function(err, response) {
              if (response === true) {
                return done(null, { user_id: result[0].id });
              } else {
                Object.assign(message, {
                  errors: "Błędne hasło, czy chcesz je zresetować?"
                });
                req.flash("info", message);
                return done(null, false);
              }
            });
          } else {
            req.flash("info", { errors: ["Niepoprawny email lub hasło."] });
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
