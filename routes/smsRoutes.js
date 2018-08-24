require('dotenv').config();
var SMSAPI = require('smsapi'),
  smsapi = new SMSAPI();

module.exports = app => {
  app.get('/api/sms/:tel', (req, res) => {
    const tel = req.params.tel;
    console.log(tel);

    smsapi.authentication
      .login(process.env.SMS_LOGIN, process.env.SMS_PASSWORD)
      .then(sendMessage)
      .then(displayResult)
      .catch(displayError);

    function sendMessage() {
      return smsapi.message
        .sms()
        .from('ECO')
        .to(tel)
        .message('My first message!')
        .execute(); // return Promise
    }

    function displayResult(result) {
      console.log(result);
    }

    function displayError(err) {
      console.error(err);
    }

    const message = req.flash('info');
    res.send(message);
  });
};
