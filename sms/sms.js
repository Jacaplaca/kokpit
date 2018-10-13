require("dotenv").config();
var SMSAPI = require("smsapi"),
  smsapi = new SMSAPI();
var schedule = require("node-schedule");

const db = require("../models/index");
const Invoices4SMS = db.invoices4sms;
const Invoices4SMSsent = db.invoices4sms_sent;
const User = db.users;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

let hour = 7;
let minutes = 45;
//let randomizeTime;

console.log(`Now is ${today()} ${time()}`);

var startRandomizer = schedule.scheduleJob(
  {
    hour: 3,
    minute: 40,
    second: 0,
    datOfWeek: [1, 2, 3, 4, 5, 6, 7]
  },
  function() {
    //console.log("start!");
    //setInterval(randomTime, 0.1 * 60000);
    //randomizeTime = setInterval(randomTime, 0.1 * 60000);
    randomTime(7, 37, 8, 25);
  }
);

// setInterval(function() {
// }, 0.1 * 60000);
// var stopRandomizer = schedule.scheduleJob(
//   {
//     hour: 21,
//     minute: 51,
//     second: 0,
//     datOfWeek: [1, 2, 3, 4, 5, 6, 7]
//   },
//   function() {
//     //console.log("stop!");
//     //clearInterval(randomizeTime);
//     //startRandomizer.cancel();
//     //setInterval(randomTime, 1 * 60000);
//   }
// );

function randomTime(hourStart, minuteStart, hourStop, minuteStop) {
  hour = randomIntFromInterval(hourStart, hourStop);
  minutes = function() {
    if (hour === hourStart) {
      return randomIntFromInterval(minuteStart, 59);
    } else if (hour === hourStop) {
      return randomIntFromInterval(0, minuteStop);
    } else {
      return randomIntFromInterval(0, 59);
    }
  };
  console.log(`${today()} ${time()}: random: ${hour}:${minutes()}`);
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

//sobota i niedziela testowo
var runFetching = schedule.scheduleJob(
  {
    hour: hour,
    minute: minutes,
    second: 30,
    datOfWeek: [1, 2, 3, 4, 5, 6, 7]
  },
  function() {
    console.log("Time for tea!");
    fetchInvoices();
  }
);

function fetchInvoices() {
  const promises = [];
  let notSent;
  const phoneNumbers = [];
  const notSentWithNumber = [];
  Invoices4SMSsent.findAll({ raw: true })
    .then(result => result.map(invoice => invoice.nr_document))
    .then(sentNumbers => {
      Invoices4SMS.findAll({
        where: {
          nr_document: { [Op.not]: sentNumbers }
        },
        raw: true
      }).then(notSentInvoices => {
        notSent = notSentInvoices;
        notSentInvoices.map(invoice => {
          const prom = User.find({
            attributes: ["nr_telefonu"],
            raw: true,
            where: {
              clientId: invoice.id_client,
              id_client_soft: invoice.id_client_soft
            }
          }).then(user => {
            user
              ? phoneNumbers.push(user.nr_telefonu)
              : phoneNumbers.push(null);
          });
          promises.push(prom);
        });
        Promise.all(promises).then(x => {
          notSent.map((invoice, i) => {
            const object = Object.assign(invoice, { phone: phoneNumbers[i] });
            notSentWithNumber.push(object);
          });
          sendSMS(notSentWithNumber.filter(x => x.phone !== null));
        });
      });
    });
}

function sendSMS(result) {
  console.log(result.length);
  const byUsers = podzielUnikalnymi(result, "id_client_soft");
  const sms = byUsers.map(user => {
    const tel = user.values[0].phone;
    let message = "Nowe zaleglosci: ";
    user["values"].map(
      invoice =>
        (message = `${message}${
          invoice.nr_document
        } z dnia ${invoice.date_issue.slice(0, 10)} dla ${
          invoice.debtor
        } na ${Math.floor(invoice.remained)}zl, `)
    );
    return { tel, sms: message };
  });
  send(result, sms);
}

function send(invoices, sms) {
  sms.map(message => {
    smsapi.authentication
      .login(process.env.SMS_LOGIN, process.env.SMS_PASSWORD)
      .then(sendMessage)
      .then(displayResult)
      .catch(displayError);

    function sendMessage() {
      return smsapi.message
        .sms()
        .from("ECO")
        .to(message.tel)
        .message(message.sms.slice(0, -2))
        .execute(); // return Promise
    }

    function displayResult(result) {
      console.log(result);
      const nr_telefonu = result.list[0].number;
      updateToSent(invoices.filter(invoice => invoice.phone === nr_telefonu));
    }

    function displayError(err) {
      console.error(err);
      //const nr_telefonu = "48507478971";
      //updateToSent(invoices.filter(invoice => invoice.phone === nr_telefonu));
    }
  });
}

function updateToSent(invoices) {
  const promises = [];
  invoices.map((invoice, i) => {
    const {
      id_client,
      nr_document,
      date_issue,
      deadline,
      id_client_soft,
      name_emp,
      surname_emp,
      debtor,
      amount,
      status,
      remained
    } = invoice;

    Invoices4SMSsent.create({
      id_client,
      nr_document,
      date_issue,
      deadline,
      id_client_soft,
      name_emp,
      surname_emp,
      debtor,
      amount,
      status,
      remained
    })
      .then(() => {
        Invoices4SMS.destroy({ where: { nr_document } })
          .then(x => console.log("destroyed"))
          .catch(err => console.log(err));
      })
      .catch(err => {
        console.log(err);
      });
  });
}

function today() {
  var data = new Date();
  var year = data.getUTCFullYear();
  var month = data.getMonth() + 1;
  var day = data.getDate();
  return `${year}-${month}-${day}`;
}

function time() {
  var data = new Date();
  var hour = data.getHours();
  var minute = data.getMinutes();
  var second = data.getSeconds();
  return `${hour}:${minute}:${second}`;
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function podzielUnikalnymi(array, key) {
  const notUnique = array.map(el => el[key]);
  const unique = notUnique.filter(onlyUnique);
  const podzielone = unique.map(element => {
    return {
      [key]: element,
      values: []
    };
  });
  array.map(element => {
    const ktoryIndex = podzielone => {
      return podzielone[key] === element[key];
    };
    const gdzieKlucz = podzielone.findIndex(ktoryIndex);
    podzielone[gdzieKlucz].values.push(element);
  });
  return podzielone;
}

// const afterSend = {
//   count: 1,
//   list: [
//     {
//       id: "5BC0B93A3738301AA9C743EC",
//       points: 0.09,
//       number: "48507478971",
//       date_sent: 1539356986,
//       submitted_number: "507478971",
//       status: "QUEUE",
//       error: null,
//       idx: null
//     }
//   ]
// };
