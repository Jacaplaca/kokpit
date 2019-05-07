import {
  addDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek
} from "date-fns";

import axios from "axios";
import moment from "moment";
import _ from "lodash";

var {
  startOfQuarter,
  endOfQuarter,
  addQuarters,
  getYear,
  startOfYear
} = require("date-fns");
export const validateRegister = async ({
  email,
  password,
  password2,
  originalEmail
}) => {
  // console.log("validateRegister()", email, password, password2, originalEmail);
  const goodEmail = "Podaj prawidłowy adres email";
  const wrongEmail = "Podany email jest już wykorzystany";
  const badPass = `Hasło powinno mieć conajmniej 6 znaków. Brakuje: ${6 -
    password.length}`;
  const goodPass = "Im dłuższe i bardziej skomplikowane hasło tym lepiej";
  const badPass2 = "Hasła nie mogą się różnić";
  const goodPass2 = "Hasła są identyczne";
  let validates = [];
  let freeEmail = false;
  const validEmail = originalEmail === email || validateEmail(email);
  let emailHelper = goodEmail;
  let passwordHelper = badPass;
  let passwordHelper2 = badPass2;
  if (validEmail) {
    freeEmail = originalEmail === email || (await emailFree(email));
    freeEmail ? (emailHelper = goodEmail) : (emailHelper = wrongEmail);
  }
  const passwordValid = password.length > 5;
  const password2Valid = password === password2;
  passwordValid ? (passwordHelper = goodPass) : (passwordHelper = badPass);
  passwordValid && password2Valid
    ? (passwordHelper2 = goodPass2)
    : (passwordHelper2 = badPass2);
  validates.push(freeEmail);
  validates.push(passwordValid);
  validates.push(password2Valid);
  // console.log(
  //   "validatesregister",
  //   validates,
  //   originalEmail === email,
  //   originalEmail,
  //   email
  // );
  const disableSubmit = validates.includes(false);

  return { disableSubmit, emailHelper, passwordHelper, passwordHelper2 };
};

export const durationLabel = range => {
  const { startDate, endDate } = range[0];
  const startDateString = new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "long",
    day: "2-digit"
  }).format(startDate);
  const endDateString = new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "long",
    day: "2-digit"
  }).format(endDate);

  return `${startDateString} - ${endDateString}`;
};

export const sum = (arr, key) => {
  return arr.reduce((a, b) => a + (b[key] || 0), 0);
};

export const emailFree = async email => {
  // const body = { email };
  const result = await axios.get(`/auth/email/${email}`);
  return result.data.free;
};

export const validateEmail = email => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const escapeRegexCharacters = str => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const shallowEqual = (objA, objB) => {
  if (objA === objB) {
    return true;
  }

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  var bHasOwnProperty = hasOwnProperty.bind(objB);
  for (var i = 0; i < keysA.length; i++) {
    if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
      return false;
    }
  }

  return true;
};

export const getSuggestions = (fetchowane, value, names) => {
  console.log("getSuggestions()", fetchowane, value, names);
  const regex = new RegExp(
    value ? escapeRegexCharacters(value).toLowerCase() : ""
  );
  let filtered = [];

  for (let field of names) {
    // console.log("field", field);
    // const main = field.split("[")[0];
    // const subs = field.split("[")[1] && field.split("[")[1].slice(0, -1);
    // const subsArr = subs && subs.split(",");
    let main;
    let subsArr;
    if (typeof field === "object") {
      for (var variable in field) {
        if (field.hasOwnProperty(variable)) {
          main = variable;
          subsArr = field[variable];
        }
      }
    }
    // console.log("type field main subsArr", typeof field, field, main, subsArr);
    filtered.push(
      ...fetchowane.filter(suggestion => {
        if (typeof field !== "object") {
          return regex.test(
            suggestion[field] ? suggestion[field].toString().toLowerCase() : ""
          );
        } else {
          const subsValues = [];
          for (let sub of subsArr) {
            subsValues.push(
              suggestion[main] ? `${suggestion[main][sub]} ` : ""
            );
          }
          return regex.test(subsValues.toString().toLowerCase());
        }
      })
    );
  }
  return filtered.reduce((x, y) => (x.includes(y) ? x : [...x, y]), []);
};

// export const dynamicSort = property => {
//   let sortOrder = 1;
//   if (property[0] === "-") {
//     sortOrder = -1;
//     property = property.substr(1);
//   }
//   return function(a, b) {
//     const result =
//       a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
//     return result * sortOrder;
//   };
// };

export const addRank = (array, property) => {
  let onlyProperties = [];
  for (let elem of array) {
    onlyProperties.push(elem[property]);
  }
  const sortedProperties = onlyProperties.sort(sortNumber).reverse();
  const sorted = _.sortedUniqBy(sortedProperties);

  const rankedArray = array.map(x => {
    let rank = 0;
    for (var i = 0; i < sorted.length; i++) {
      if (sorted[i] === x[property]) {
        rank = i + 1;
      }
    }
    return Object.assign(x, { rank });
  });

  return rankedArray;
};

export const simpleSortUpDown = (array, what, how) => {
  let rows = [];
  // console.log("simpleSortUpDown", array, what, how);
  rows = array.sort(dynamicSort(what));
  if (how === "desc") {
    rows = rows.reverse();
  }
  return rows;
};

export const dynamicSort = property => {
  // console.log("dynamicSort", property);
  let sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function(a, b) {
    if (typeof a[property] === "string") {
      const aPL = a[property]
        .toLowerCase()
        .replace(/[ąęśćółńżź]/g, function(s) {
          return (
            (s == "ą"
              ? "a"
              : s == "ę"
              ? "e"
              : s == "ś"
              ? "s"
              : s == "ć"
              ? "c"
              : s == "ó"
              ? "o"
              : s == "ł"
              ? "l"
              : s == "ń"
              ? "n"
              : s == "ż"
              ? "z"
              : "zż") + "ż"
          );
        });

      const bPL =
        typeof b[property] !== "string"
          ? ""
          : b[property].toLowerCase().replace(/[ąęśćółńżź]/g, function(s) {
              return (
                (s == "ą"
                  ? "a"
                  : s == "ę"
                  ? "e"
                  : s == "ś"
                  ? "s"
                  : s == "ć"
                  ? "c"
                  : s == "ó"
                  ? "o"
                  : s == "ł"
                  ? "l"
                  : s == "ń"
                  ? "n"
                  : s == "ż"
                  ? "z"
                  : "zż") + "ż"
              );
            });

      const result = aPL < bPL ? -1 : aPL > bPL ? 1 : 0;
      // console.log(result);
      // console.log(sortOrder);
      return result * sortOrder;
    } else {
      const aPL = a[property];
      const bPL = b[property];
      const result = aPL < bPL ? -1 : aPL > bPL ? 1 : 0;
      // console.log(result);
      // console.log(sortOrder);
      return result * sortOrder;
    }
  };
};

export const sortNumber = (a, b) => {
  return a - b;
};

export const formatNumber = (n, suffix) => {
  let number = Number(n);
  if (suffix === "%") {
    number = Number(n) * 100;
  }
  // console.log("formatNumber()", number);
  if (number % 1 !== 0) {
    return number
      .toFixed(2)
      .toString()
      .replace(".", ",");
  } else if (n === "") {
    return "";
  } else {
    // console.log("formatNumber()", n, number, "second");
    return number.toString().replace(".", ",");
  }
};

export const dateToYM = date => {
  const dateObj = moment(date).toObject();
  let month;
  if (dateObj.months + 1 < 10) {
    month = `0${dateObj.months + 1}`;
  } else {
    month = dateObj.months + 1;
  }
  return `${dateObj.years}${month}`;
};

export const YMtoDate = yearMonth => {
  // let afterConv
  let ym;
  if (yearMonth) {
    ym = yearMonth;
    return new Date(
      `${ym.toString().slice(0, 4)}-${ym.toString().slice(4)}-01`
    );
  } else {
    return new Date();
  }
};

export const YMtoMonthYear = number => {
  const date = YMtoDate(number);
  return moment(date).format("MMMM, YYYY");
};

export const cleanNumber = value => {
  const type = typeof value;
  if (type === "string") {
    const parsed = parseFloat(value.replace(/,/g, "."));
    // console.log("cleanNumber", parsed, typeof parsed);
    return parsed;
  } else if (type === "number") {
    return value;
  } else {
    return 0;
  }
};

export const dataToString = element => {
  const data = new Date(element);
  const dzien =
    data.getDate() > 10 ? `${data.getDate()}` : `0${data.getDate()}`;
  const miesiac =
    data.getMonth() + 1 > 10
      ? `${data.getMonth() + 1}`
      : `0${data.getMonth() + 1}`;
  return `${data.getFullYear()}-${miesiac}-${dzien}`;
};

export const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

export const podzielUnikalnymiPlaner = array => {
  // const users = array.map(el => el.user.id).filter(onlyUnique);
  // const days = array.map(el => el.kiedy).filter(onlyUnique);
  // console.log(users, days);
  const byUser = podzielUnikalnymi(array, "user_id");
  console.log(byUser);
  let partedBig = [];
  for (let user of byUser) {
    // let parted = [];
    let newObj = { user_id: user, kiedy: "", values: [] };
    let byDay = podzielUnikalnymi(user.values, "kiedy");
    const parted = byDay.map(x => {
      return { user_id: user.user_id, kiedy: x.kiedy, values: x.values };
    });
    // console.log(parted);
    partedBig.push(...parted);
  }
  // const byDay = byUser.map(x => podzielUnikalnymi(x.values, "kiedy"));
  return partedBig;
};

export const podzielUnikalnymi = (array, key) => {
  const notUnique = array.map(el => el[key]);
  const unique = notUnique.filter(onlyUnique);
  const podzielone = unique.map(element => {
    return {
      [key]: element,
      //expanded: element === expanded ? true : false,
      values: []
    };
  });
  array.map(element => {
    const ktoryIndex = podzielone => podzielone[key] === element[key];
    const gdzieKlucz = podzielone.findIndex(ktoryIndex);
    podzielone[gdzieKlucz].values.push(element);
  });
  return podzielone;
};

export const timeDiff = (start, stop) => {
  const date1 = new Date(start);
  const date2 = new Date(stop);
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  const diffMinutes = Math.ceil(timeDiff / 1000 / 60);
  return diffMinutes;
};

export const sumaCzasow = czasy => {
  let suma = 0;
  czasy.map(x => {
    suma = timeDiff(x.start, x.stop) + suma;
  });
  return suma;
};

export const wezGodzine = czas => {
  const data = new Date(czas);
  let godzina = data.getHours();
  let minuty = data.getMinutes();
  godzina = godzina < 10 ? `0${godzina}` : godzina;
  minuty = minuty < 10 ? `0${minuty}` : minuty;
  return `${godzina}:${minuty}`;
};

export const minutes2hours = minutes => {
  let godziny = Math.trunc(minutes / 60);
  let minuty = minutes % 60;
  godziny = godziny < 10 ? `0${godziny}` : godziny;
  minuty = minuty < 10 ? `0${minuty}` : minuty;
  return `${godziny}:${minuty}`;
};

export const defineds = {
  startOfWeek: startOfWeek(new Date()),
  endOfWeek: endOfWeek(new Date()),
  startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
  endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
  startOfToday: startOfDay(new Date()),
  endOfToday: endOfDay(new Date()),
  startOfYesterday: startOfDay(addDays(new Date(), -1)),
  endOfYesterday: endOfDay(addDays(new Date(), -1)),
  startOfMonth: startOfMonth(new Date()),
  endOfMonth: endOfMonth(new Date()),
  startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
  endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
  startOfNextMonth: startOfMonth(addMonths(new Date(), 1)),
  endOfNextMonth: endOfMonth(addMonths(new Date(), 1)),
  startFirstQuarter: startOfQuarter(new Date(startOfYear(new Date()))),
  endFirstQuarter: endOfQuarter(new Date(startOfYear(new Date()))),
  startSecondQuarter: startOfQuarter(
    addQuarters(new Date(startOfYear(new Date())), 1)
  ),
  endSecondQuarter: endOfQuarter(
    addQuarters(new Date(startOfYear(new Date())), 1)
  ),
  startThirdQuarter: startOfQuarter(
    addQuarters(new Date(startOfYear(new Date())), 2)
  ),
  endThirdQuarter: endOfQuarter(
    addQuarters(new Date(startOfYear(new Date())), 2)
  ),
  startFourthQuarter: startOfQuarter(
    addQuarters(new Date(startOfYear(new Date())), 3)
  ),
  endFourthQuarter: endOfQuarter(
    addQuarters(new Date(startOfYear(new Date())), 3)
  ),
  thisYear: getYear(new Date())
};

// function formatTimezone(date: Date): Date {
//   const offset = date.getTimezoneOffset();
//
//   return Math.sign(offset) !== -1
//     ? addMinutes(date, offset)
//     : subMinutes(date, Math.abs(offset));
// }

export const shortPlace = str => {
  const arr = str.split(" ");
  const [first, ...remaining] = arr;
  const len = remaining.join(" ").length;
  return len > 18
    ? `${remaining.join(" ").slice(0, 15)}...`
    : `${remaining.join(" ").slice(0, 18)}`;
};

export const shorting = (str, characters) => {
  if (str.length > characters) {
    return `${str.slice(0, characters - 3)}...`;
  } else {
    return str;
  }
};
