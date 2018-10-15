const {
  addDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
  differenceInCalendarDays,
  addMinutes,
  subMinutes,
  addHours
} = require("date-fns");

const data = new Date();
console.log(data);
const nowa = addHours(data, 2);
console.log(nowa);
