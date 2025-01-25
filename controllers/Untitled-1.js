
const myDate = new Date("2023-11-01 16:00");
console.log(myDate.getDate())
const nextDayOfMonth = myDate.getDate() + 7;
console.log(nextDayOfMonth)
myDate.setDate(nextDayOfMonth);
console.log(myDate)
const newDate = myDate.toLocaleString();
console.log(myDate)
console.log(newDate)

const msSinceEpoch = (new Date()).getTime();
const seventeenHoursLater = new Date(msSinceEpoch + 10 * 60 * 1000);
console.log(seventeenHoursLater)

function pad(n) {
  return n<10 ? '0'+n : n;
}
const hassanDate = new Date("2023-11-01 16:00");
console.log(hassanDate.getHours())
console.log(pad(hassanDate.getMinutes()))
console.log(hassanDate.get)
const msSinceEpochhassan = hassanDate.getTime();
const seventeenHoursLaterhassan = new Date(msSinceEpochhassan + 10 * 60 * 1000);
console.log(seventeenHoursLaterhassan)

//******************************* */
const m = moment('1402/10/02 13:20', 'jYYYY/jM/jD HH:mm') // Parse a Jalaali date
console.log(m.format("YYYY/MM/DD HH:mm"))
m.add(10, 'minute')
console.log(m.format("YYYY/MM/DD HH:mm"))
console.log(m.format("jYYYY/jMM/jDD HH:mm"))
console.log(m.format("HH:mm"))
m.add(1,'day');//nextday
console.log(m.format("jYYYY/jMM/jDD HH:mm"))