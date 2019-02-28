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

export const formatNumber = n => {
  if (Number(n) === n && n % 1 !== 0) {
    return n
      .toFixed(2)
      .toString()
      .replace(".", ",");
  } else {
    return n;
  }
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

export const dynamicSort = property => {
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
  endOfLastMonth: endOfMonth(addMonths(new Date(), -1))
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
