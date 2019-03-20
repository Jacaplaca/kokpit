("use strict");
require("dotenv").config();
var moment = require("moment");
require("moment/locale/pl");
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
const main = async (text, html, time, date, email, subject) => {
  console.log("main", html);
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
    to: email, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html // html body
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  return {
    email,
    id: info.messageId,
    info: nodemailer.getTestMessageUrl(info)
  };
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

// ;

const sendAccountInfo = async ({ name, surname, email, password, ediadd }) => {
  const data = new Date();
  const timeFormated = moment(data).format("H:mm");
  const formatedDay = moment(data).format("DD MMMM YYYY");
  // console.log(formatedDay, timeFormated);
  let subject;
  let html;
  let text;
  if (ediadd === "adding") {
    subject = `✉️ Nowe konto dla ${email} w serwisie Świadoma Firma 📈`;
    html = `<h3>Dnia ${formatedDay} dla konta ${email} w serwisie Świadoma Firma zostało założone konto.</h3><p>Aby się zalogować prosimy kliknąć w ten link oraz podać następujące dane dostępowe:</p><p>Login: ${email}</p><p>Hasło: ${password}</p>`;
    text = `Dnia ${formatedDay} dla konta ${email} w serwisie Świadoma Firma zostało założone konto. Aby się zalogować prosimy kliknąć w ten link oraz podać następujące dane dostępowe: Login: ${email} Hasło: ${password}`;
  } else if (ediadd === "editing") {
    subject = `✉️ Konto dla ${email} w serwisie Świadoma Firma 📈 zostało zmienione`;
    html = `<h3>Dnia ${formatedDay} dla konta ${email} w serwisie Świadoma Firma zostały zmienione niektóre dane.</h3><p>Aby się zalogować prosimy kliknąć w ten link oraz podać następujące dane dostępowe:</p><p>Login: ${email}</p><p>Hasło: ${password}</p>`;
    text = `Dnia ${formatedDay} dla konta ${email} w serwisie Świadoma Firma zostały zmienione niektóre dane. Aby się zalogować prosimy kliknąć w ten link oraz podać następujące dane dostępowe: Login: ${email} Hasło: ${password}`;
  }
  return main(text, html, timeFormated, formatedDay, email, subject)
    .then(response => {
      console.log("sendAccountInfo()", response);
      return response;
    })
    .catch(console.error);
};

module.exports = sendAccountInfo;
