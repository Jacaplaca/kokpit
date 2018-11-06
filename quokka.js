const obarr = [
  { name: "Jack", age: 39, city: "Lubartow", woj: "" },
  { name: "Ben Lubartow", age: 24, city: "Lubartow", woj: "" },
  { name: "Mark", age: 39, city: "Warszawa", woj: "" },
  { name: "Steve Lubartow", age: 24, city: "Lubartow", woj: "" },
  { name: "Adam", age: 39, city: "Zamosc", woj: "luba" }
];

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const sp = arr.splice(5);
sp;
arr;

const names = ["name", "city", "woj"];
const wynik = getSuggestions(obarr, "luba", names);
wynik;

function getSuggestions(fetchowane, value, names) {
  const regex = new RegExp(value.toLowerCase());
  let filtered = [];

  for (let field of names) {
    filtered.push(
      ...fetchowane.filter(suggestion =>
        regex.test(suggestion[field].toLowerCase())
      )
    );
  }
  return filtered.reduce((x, y) => (x.includes(y) ? x : [...x, y]), []);
}
