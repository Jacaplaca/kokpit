// key.js - which keys i shoutl commit

if (process.env.NODE_ENV === 'online') {
  // we are in production
  module.exports = require('./prod');
} else {
  // we are in dev
  module.exports = require('./dev');
}
