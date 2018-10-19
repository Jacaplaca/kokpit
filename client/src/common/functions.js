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

import store from "../store";
import * as actions from "../actions";

export const sprawdzPola = (aktywnosc_id, miejsce_id, inna) => {
  console.log("sprawdzam pola");
  switch (aktywnosc_id) {
    case 1:
      console.log("case aktyw");
      console.log(!miejsce_id ? false : true);
      return !miejsce_id ? false : true;
      break;
    case 5:
      console.log("case inna");
      return inna === "" ? false : true;
      break;
    default:
      console.log("case default");
      return true;
  }
};

export const validateKiedy = (data, sentDays) => {
  console.log("validate kiedy");
  //store.dispatch(actions.errorKiedyAction(true));
  console.log(data);
  console.log(sentDays);
  const nalezy =
    sentDays.filter(x => x.name === data).length === 1 ? false : true;
  const pelnaData = data.length === 10 ? true : false;

  if (pelnaData) {
    if (nalezy) {
      //this.setState({ errorKiedy: false });
      store.dispatch(actions.errorKiedyAction(false));
      return true;
    }
    store.dispatch(actions.errorKiedyAction(true));
    // this.setState({ errorKiedy: true });
    return false;
  }
  // this.setState({ errorKiedy: false });
  store.dispatch(actions.errorKiedyAction(false));
  return false;
};

export const validateTime = (time, pole) => {
  const nazwaPola = `error${pole}Action`;
  const hours = Math.trunc(time.split(":")[0]);
  const minutes = Math.trunc(time.split(":")[1]);
  if (hours < 0 || hours > 23 || (minutes < 0 || minutes > 59)) {
    // this.setState({ [nazwaPola]: true });
    store.dispatch(actions[nazwaPola](true));
  }
  if (hours >= 0 && hours <= 23 && (minutes >= 0 && minutes <= 59)) {
    // this.setState({ [nazwaPola]: false });
    store.dispatch(actions[nazwaPola](false));
    return true;
  } else {
    if (hours && minutes) {
      // console.log("sa godizny i minuty");
    }
    return false;
  }
};

export const validateDuration = (start, stop) => {
  const startHours = Math.trunc(start.split(":")[0]);
  const startMinutes = Math.trunc(start.split(":")[1]);
  const stopHours = Math.trunc(stop.split(":")[0]);
  const stopMinutes = Math.trunc(stop.split(":")[1]);

  const startTotal = startHours * 60 + startMinutes;
  const stopTotal = stopHours * 60 + stopMinutes;
  if (
    !Number.isNaN(startHours) &&
    !Number.isNaN(startMinutes) &&
    !Number.isNaN(stopHours) &&
    !Number.isNaN(stopMinutes)
  ) {
    if (startTotal < stopTotal) {
      return true;
    }
    //this.setState({ errorStop: true });
    store.dispatch(actions.errorStopAction(true));
    return false;
  }
  return false;
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
