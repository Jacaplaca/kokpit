const express = require('express');
// const router = express.Router()
// const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
// const { check, validationResult } = require('express-validator/check');
var session = require('express-session');
var flash = require('connect-flash');
// const seql = require('./seql');
const User = require('./models/user');
// var Article = require('./models/article');
var MySQLStore = require('express-mysql-session')(session);
const keys = require('./config/keys');
// require('./models/users');
// require('./models/survey');

require('./services/passport');
// console.log(models.Article);
// mongoose.connect(keys.mongoURI);
const app = express();
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
require('dotenv').config();
// User.create({
//   email: 'asdfas@asdkfja.com',
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

var options = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};
var sessionStore = new MySQLStore(options);

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

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
// require('./routes/surveyRoutes')(app);

if (process.env.NODE_ENV === 'online') {
  // express will serve up production assets lie our main.js or main.class
  app.use(express.static('client/build'));
  //express will server up index.html if it doesn't recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
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
