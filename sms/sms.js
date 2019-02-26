require("dotenv").config();
//process.env.TZ = 'Europe/Amsterdam'
var SMSAPI = require("smsapi"),
  smsapi = new SMSAPI();
var schedule = require("node-schedule");

const db = require("../models/index");
const Invoices4SMS = db.invoices4sms_intf;
const Invoices4SMSsent = db.invoices4sms_sent;
const User = db.users;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

let hourRandom = 7;
let minuteRandom = 20;
//let randomizeTime;

console.log(`Now is ${today()} ${time()}`);

var rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [1, 3, 5];
// rule.dayOfWeek = [new schedule.Range(1, 5)];
rule.hour = 7;
rule.minute = 30;
rule.second = 0;

//let addon = 0;
var randomizeSendingTime = schedule.scheduleJob(rule, function() {
  console.log("Randomizing");
  // var data = new Date();
  // var h = data.getHours();
  // var m = data.getMinutes();
  //randomTime(7, 37, 8, 26);
  randomTime(9, 10, 9, 50);
});

// fetchInvoices();

var runFetching = schedule.scheduleJob(
  {
    hour: hourRandom,
    minute: minuteRandom,
    second: 15,
    dayOfWeek: [new schedule.Range(1, 5)]
  },
  function() {
    console.log("Lecimy z smsami!");
    fetchInvoices();
  }
);

function changeSchedule() {
  runFetching.reschedule({
    hour: hourRandom,
    minute: minuteRandom,
    second: 30,
    dayOfWeek: [new schedule.Range(1, 5)]
  });
}

function randomTime(hourStart, minuteStart, hourStop, minuteStop) {
  hourRandom = randomIntFromInterval(hourStart, hourStop);
  minuteRandom = minutes();
  function minutes() {
    if (hourStart === hourStop) {
      return randomIntFromInterval(minuteStart, minuteStop);
    } else {
      if (hourRandom === hourStart) {
        return randomIntFromInterval(minuteStart, 59);
      } else if (hourRandom === hourStop) {
        return randomIntFromInterval(0, minuteStop);
      } else {
        return randomIntFromInterval(0, 59);
      }
    }
  }
  console.log(`${today()} ${time()}: random: ${hourRandom}:${minuteRandom}`);
  changeSchedule();
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function fetchInvoices() {
  console.log(`fetch invoices ${today()} ${time()}`);
  Invoices4SMSsent.findAll({
    raw: true,
    attributes: ["nr_document"]
  })
    .then(result => result.map(invoice => invoice.nr_document))
    .then(sentNumbers => {
      // console.log("sentNumbers", sentNumbers);
      Invoices4SMS.findAll({
        where: {
          nr_pelny: { [Op.not]: sentNumbers }
        },
        raw: true
      }).then(sentInvoices => {
        console.log("sentInvoices", sentInvoices.length);
        fetchUsers(
          sentInvoices.sort(dynamicSort("termin_platnosci")).reverse()
        );
      });
    });
}

function fetchUsers(invoices) {
  // console.log("fetchUsers");
  User.findAll({
    attributes: ["clientId", "id", "nr_telefonu", "id_client_soft"],
    raw: true
  }).then(users => {
    // console.log("users", users);
    compareAddPhone(invoices, users);
  });
}

function compareAddPhone(invoices, users) {
  let id = 0;
  //let invoicesWithPhone = []
  // console.log("invoices", invoices);
  const notSentWithNumber = invoices.map(inv => {
    // console.log("inv id_client", inv.id_client, inv.id_pracownik);
    const userData = users.filter(
      user =>
        inv.id_client === user.clientId &&
        inv.id_pracownik === user.id_client_soft
    );
    // console.log("userData", userData);
    const {
      nr_pelny,
      data_wystawienia,
      termin_platnosci,
      id_pracownik,
      imie_pracownika,
      nazwisko_pracownika,
      klient,
      wartosc_brutto,
      status_platnosci,
      pozostalo_do_zaplacenia,
      id_client
    } = inv;
    id = id_client;
    return {
      id_client_soft: id_pracownik,
      id_soft_odUsera: userData.length > 0 ? userData[0].id_client_soft : null,
      phone: userData.length > 0 ? userData[0].nr_telefonu : null,
      nr_document: nr_pelny,
      date_issue: data_wystawienia,
      id_client,
      deadline: termin_platnosci,
      name_emp: imie_pracownika,
      surname_emp: nazwisko_pracownika,
      debtor: klient,
      amount: wartosc_brutto,
      remained: pozostalo_do_zaplacenia,
      status: status_platnosci
    };
  });
  // console.log("notSentWithNumber", notSentWithNumber);
  // console.log("compare", notSentWithNumber.filter(x => x.phone !== null));
  Invoices4SMS.findAll({
    where: {
      id_client: id
    },
    raw: true
  }).then(res => {
    sendSMS(
      short(
        notSentWithNumber.filter(x => x.phone !== null),
        "id_client_soft",
        3
      ),
      res
    );
  });
}

function sendSMS(result, all) {
  // console.log(all);
  const allByUser = podzielUnikalnymi(all, "id_pracownik");

  let bigestInvoices = [];

  for (let user of allByUser) {
    // const userSortedInvoices = {}
    // console.log("user", Object.keys(user), user.id_pracownik);
    const invoices = user.values;
    // console.log("invoices", invoices.length);
    invoices.map(x =>
      Object.assign(x, { pozostaloInt: Math.trunc(x.pozostalo_do_zaplacenia) })
    );
    invoices.sort(dynamicSort("pozostaloInt")).reverse();
    const invoicesForUser = {
      user: user.id_pracownik,
      invoices: invoices.slice(0, 3)
    };
    bigestInvoices.push(invoicesForUser);
  }

  // console.log("bigestInvoices", bigestInvoices);

  // allByUser.map(x =>
  //   x.values
  //     .map(y => Object.assign(y, { remainedInt: Math.trunc(y.remained) }))
  //     .sort(dynamicSort("remainedInt"))
  // );
  // // .reverse();
  // console.log("allByUser", allByUser.map(x => x.values));

  const byUsers = podzielUnikalnymi(result, "id_client_soft");
  //console.log(byUsers);
  byUsers.map(user => {
    //console.log(user.values);
    const tel = user.values[0].phone;
    const idSoft = user.values[0].id_client_soft;
    let message = "Nowe zaleglosci: ";
    Invoices4SMS.findAll({
      where: {
        id_pracownik: idSoft
      },
      raw: true
    })
      .then(invoices => {
        // console.log("invoices", invoices);
        const howManyInvoices = invoices.length;
        const remainedSum = invoices.reduce(
          (cnt, invoice) => cnt + Math.trunc(invoice.pozostalo_do_zaplacenia),
          0
        );
        message = `Odzyskaj ${Math.floor(
          remainedSum
        )}zl z ${howManyInvoices}fv. Ost: `;
        return { howManyInvoices, remainedSum };
      })
      .then(wholeSummary => {
        user["values"].map(invoice => {
          // return;
          // console.log("invoice", invoice);
          // const monthIssue = invoice.date_issue.slice(0, 10).split("-")[1];
          // const dayIssue = invoice.date_issue.slice(0, 10).split("-")[2];
          // const monthDeadline = invoice.deadline.slice(0, 10).split("-")[1];
          // const dayDeadline = invoice.deadline.slice(0, 10).split("-")[2];
          // const naKwote =
          //   invoice.amount !== invoice.remained
          //     ? ` na kwote: ${Math.floor(invoice.amount)}zl `
          //     : "";
          const remain = invoice.amount !== invoice.remained ? `` : "";
          message = `${message}${invoice.debtor} ${remain}${Math.floor(
            invoice.remained
          )}zl, `;
        });
        // console.log("idSoft", idSoft);
        const bigestFilteredByUser = bigestInvoices.filter(
          x => x.user === idSoft
        );
        const bigest = bigestFilteredByUser[0].invoices;
        // console.log("bigestInvoices filter", bigest);
        let topMessage = `Top:`;
        let tops = "";
        for (let invoice of bigest) {
          tops = `${tops}${
            invoice.klient
          } ${invoice.pozostalo_do_zaplacenia.slice(0, -3)}zl, `;
        }

        const sms = {
          tel,
          idSoft,
          sms: `${message.slice(0, -2)}, ${topMessage} ${tops.slice(0, -2)}`
        };
        // console.log("senduje", sms);
        send(result, sms);
      });
  });
  // send(result, sms);
  // console.log(sms);
}

function months(number) {
  switch (number) {
    case 1:
      return "sty";
    case 2:
      return "lut";
    case 3:
      return "marz";
    case 4:
      return "kwi";
    case 5:
      return "maj";
    case 6:
      return "cze";
    case 7:
      return "lip";
    case 8:
      return "sie";
    case 9:
      return "wrz";
    case 10:
      return "paz";
    case 11:
      return "lis";
    case 12:
      return "gru";
    default:
      return "blad";
  }
}

function send(invoices, sms) {
  console.log("sms");
  console.log(sms);
  smsapi.authentication
    .login(process.env.SMS_LOGIN, process.env.SMS_PASSWORD)
    .then(sendMessage)
    .then(displayResult)
    .catch(displayError);

  function sendMessage() {
    return smsapi.message
      .sms()
      .from("ECO")
      .to(sms.tel)
      .message(sms.sms)
      .normalize()
      .execute(); // return Promise
  }
  // updateToSent(invoices.filter(invoice => invoice.phone === "48502413498"));
  function displayResult(result) {
    console.log(result);
    const nr_telefonu = result.list[0].number;
    updateToSent(invoices.filter(invoice => invoice.phone === nr_telefonu));
    //updateToSent(invoices.filter(invoice => invoice.phone === sms.tel));
  }

  function displayError(err) {
    console.error(err);
    //const nr_telefonu = "48507478971";
    //updateToSent(invoices.filter(invoice => invoice.phone === nr_telefonu));
  }
}

function updateToSent(invoices) {
  const promises = [];
  invoices.map(invoice => {
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
      .then(
        message => console.log(`${nr_document} saved in Invoices4SMSsent`)
        // {
        //   Invoices4SMS.destroy({ where: { nr_document } })
        //     .then(x => console.log("destroyed"))
        //     .catch(err => console.log(err));
        // }
      )
      .catch(err => {
        console.log(err);
      });
  });
}

function short(arr, key, len) {
  let shorter = [];
  let shorterWithHelp = [];
  arr.map(x => {
    shorter.push(x);
    const ile = shorter.filter(y => y[key] === x[key]).length;
    shorterWithHelp.push(Object.assign(x, { help: ile }));
  });
  return shorterWithHelp.filter(x => x.help <= len);
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

function dynamicSort(property) {
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function(a, b) {
    const result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
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
