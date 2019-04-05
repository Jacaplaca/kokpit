const express = require("express");
// const router = express.Router()
// const mongoose = require('mongoose');
const cookieSession = require("cookie-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const { YMtoMonthYear } = require("./client/src/common/functions");
// const { check, validationResult } = require('express-validator/check');
var session = require("express-session");
var flash = require("connect-flash");
var morgan = require("morgan");
// const seql = require('./seql');
require("./sms/sms");

// const User = require('./models/user');
// const Client = require('./models/client');
const db = require("./models/index");
const User = db.users;
const Client = db.clients;

// var Article = require('./models/article');
var MySQLStore = require("express-mysql-session")(session);
const keys = require("./config/keys");
// require('./models/users');
// require('./models/survey');

require("./services/passport");
// console.log(models.Article);
// mongoose.connect(keys.mongoURI);
const app = express();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
require("dotenv").config();
app.use(morgan("short"));
console.log("datazmienia", YMtoMonthYear(201905));
// console.log(db);

// Client.findAll({
//   include: [{ model: User }]
// }).then(result => result.forEach(one => console.log(one)));

// User.findAll({
//   // where: { id: 3 },
//   // attributes: ['email'],
//   include: [
//     {
//       model: Client
//       // where: { name: 'Salana' }
//     }
//   ]
// }).then(
//   results => results.forEach(one => one.isAdmin(one.client))
//   // console.log(`${results[4].dataValues.email} ${results[4].client.name}`)
// );

// User.findAll({
//   limit: 100,
//   attributes: ['email'],
//   include: [
//     {
//       model: Client,
//       where: { name: 'Dako' },
//       attributes: ['name']
//     }
//   ]
// }).then(users => {
//   console.log(users.map(user => user.dataValues));
// });

// User.create({
//   email: 'asddfas@addsdkfja.com',
//   password: ':ASDF_23=4XCV#$%4567',
//   status: 'active'
// });

// Article.update({ title: 'a very different title now' }, { where: { id: 210 } })
//   .then(result => console.log(result))
//   .catch(err => console.log(err));
// seql
//   .authenticate()
//   .then(() => {
// Article.create({
//   title: 'demo2',
//   body: 'adfas'
// });
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

// var options = {
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME
// };
// var sessionStore = new MySQLStore(options);

app.use(jsonParser);
app.use(urlencodedParser);
// app.use(
//   session({
//     secret: 'kl345#@$%345l[]ase*(&jck34}{fds32sd":d',
//     resave: false,
//     saveUninitialized: true,
//     store: sessionStore
//     // cookie: { secure: true }
//   })
// );
// app.use(check);
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    // keys: [keys.cookieKey]
    keys: [process.env.COOKIE_KEY]
  })
);
app.use(flash());
// passport.use(
//   'local-login',
//   new LocalStrategy(function(username, password, done) {
//     console.log('passport local');
//     console.log(username);
//     console.log(password);
//     return done(null, 'sfadfsssdd');
//   })
// );
app.use(passport.initialize());
app.use(passport.session());

// app.use(function(req, res, next) {
//   res.locals.user = req.user || null;
//   next();
// });

require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);
require("./routes/otherRoutes")(app);
require("./routes/smsRoutes")(app);
require("./routes/transactionsRoutes")(app);
require("./routes/emailRoutes")(app);
require("./routes/channelRoutes")(app);
require("./routes/invoicesRoutes")(app);
require("./routes/channelConfigRoutes")(app);
require("./routes/customerDetailsRoutes")(app);
require("./routes/channelUsersRoutes")(app);
// require('./routes/surveyRoutes')(app);

if (process.env.NODE_ENV === "online") {
  // express will serve up production assets lie our main.js or main.class
  app.use(express.static("client/build"));
  //express will server up index.html if it doesn't recognize the route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// passport.serializeUser((user, done) => {
//   console.log('serializeUser');
//   console.log(user);
//   done(null, user.id);
// });
//
// passport.deserializeUser((id, done) => {
//   console.log('deserializeUser');
//   console.log(id);
//   done(null, user);
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT);
