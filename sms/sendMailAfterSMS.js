("use strict");
require("dotenv").config();
var moment = require("moment");
require("moment/locale/pl");
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main(text, raport, time, date) {
  console.log("main", raport);
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let account = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.RAPORTMAILSMTP,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.RAPORTMAIL, // generated ethereal user
      pass: process.env.RAPORTMAILPASS // generated ethereal password
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: `"Świadoma Firma 📈 Raporty" ${process.env.RAPORTMAIL}`, // sender address
    to: "dziewanowski@gmail.com", // list of receivers
    subject: `✉️ Raport SMS z dnia ${date}`, // Subject line
    text: text, // plain text body
    html: raport // html body
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// ;

const sendingMailAfterSms = sms => {
  const data = new Date();
  const timeFormated = moment(data).format("H:mm");
  const formatedDay = moment(data).format("DD MMMM YYYY");
  // console.log(formatedDay, timeFormated);
  let html = `<h3>Raport wysyłki smsów z dnia ${formatedDay}</h3>`;
  const raport = sms.map(x => {
    const line = `<p>${x.name} ${
      x.surname
    } otrzymał dziś o godzinie ${timeFormated} na nr tel.: ${
      x.tel
    } sms o treści: "${x.sms}".</p>`;
    html = `${html} ${line}`;
  });

  let text = `Raport wysyłki smsów z dnia ${formatedDay}`;
  sms.map(x => {
    const line = `${x.name} ${
      x.surname
    } otrzymał dziś o godzinie ${timeFormated} na nr tel.: ${
      x.tel
    } sms o treści: "${x.sms}".`;
    text = `${text} ${line}`;
  });
  console.log("raport", html);
  main(text, html, timeFormated, formatedDay).catch(console.error);
};

module.exports = sendingMailAfterSms;
