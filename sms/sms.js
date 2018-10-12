require("dotenv").config();
var SMSAPI = require("smsapi"),
  smsapi = new SMSAPI();
var schedule = require("node-schedule");

const db = require("../models/index");
const OverduePayments = db.overdue_payments;
const User = db.users;
const PlanerKlienci = db.planer_klienci;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const axios = require("axios");

let hour = 7;

schedule.scheduleJob(
  {
    hour: 7,
    minute: 20,
    second: 30,
    datOfWeek: [1, 2, 3, 4, 5, 6, 7]
  },
  function() {
    hour = randomIntFromInterval(7, 8);
    //console.log(hour);
  }
);

function randomMinutes() {
  if (hour === 7) {
    return randomIntFromInterval(37, 59);
  } else {
    return randomIntFromInterval(0, 27);
  }
}

console.log(`${hour}:${randomMinutes()}`);

function randomIntFromInterval(
  min,
  max // min and max included
) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
//sobota i niedziela testowo
schedule.scheduleJob(
  {
    hour: hour,
    minute: randomMinutes(),
    second: 30,
    datOfWeek: [1, 2, 3, 4, 5, 6, 7]
  },
  function() {
    console.log("Time for tea!");
  }
);

function fetchOverdueSend() {
  OverduePayments.findAll({
    include: [
      { model: User, attributes: ["nr_telefonu"] },
      { model: PlanerKlienci, attributes: ["nazwa"] }
    ],
    where: {
      // deadline: new Date(today()),
      sent: 0
    },
    raw: true
  })
    .then(result => {
      sendSMS(result);
    })
    .catch(err => {
      console.log(err);
    });
}

function sendSMS(result) {
  const byUsers = podzielUnikalnymi(result, "id_user");
  const sms = byUsers.map(user => {
    const tel = user.values[0]["user.nr_telefonu"];
    let message = "Nowe zaleglosci: ";
    user["values"].map(
      invoice =>
        (message = `${message}${invoice.nr_document} z dnia ${
          invoice.date_of_issue
        } dla ${invoice["planer_klienci.nazwa"]} na ${Math.floor(
          invoice.gross_amount
        )}zl, `)
    );
    return { tel, sms: message };
  });
  send(result, sms);
}

function send(results, sms) {
  sms.map(message => {
    console.log(message.sms.slice(0, -2));
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
        .message(message.sms.slice(0, -2));
      //.execute(); // return Promise
    }

    function displayResult(result) {
      console.log(result);
      updateToSent(results);
    }

    function displayError(err) {
      console.error(err);
      //updateToSent(results);
    }
  });
}

function updateToSent(results) {
  results.map(document => {
    OverduePayments.update(
      {
        sent: 1
      },
      {
        where: { id: document.id }
      }
    )
      .then(() => console.log("po updacie"))
      .catch(err => {
        console.log(err);
      });
  });
}

//j.schedule();

//id, id_user, nr_dokumentu, aktualna_naleznosc_brutto, id_kontrahent, termin_platnosci,
// zamiana ich id na moje id
// to to samo ale czasami zamiast nazwy jest ulica
//dlaczego mam inne id klienta niz jest hurtowni, czy powinienem zrobic aby byla ta sama baza w hurtowni co u mni
// jak czesto zmieniaja sie nr kontrachentow w hurtowni, moze jakas synchornizacja

function today() {
  var data = new Date();
  var year = data.getUTCFullYear();
  var month = data.getMonth() + 1;
  var day = data.getDate();
  return `${year}-${month}-${day}`;
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
