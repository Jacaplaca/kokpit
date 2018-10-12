var schedule = require("node-schedule");

schedule.scheduleJob(
  { hour: 12, minute: 14, datOfWeek: [1, 2, 3, 4, 5] },
  function() {
    console.log("Time for tea!");
  }
);

//j.schedule();

function startTime() {
  var today = new Date(),
    h = today.getHours(),
    m = today.getMinutes(),
    s = today.getSeconds();
  console.log(h + ":" + m + ":" + s);
  console.log(today);
}

startTime();

console.log("hej tu sms");
