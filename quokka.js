const cos = [
  {
    id_client: 2,
    nr_document: "FS 4330/MAG/2018",
    date_issue: "2018-09-04 00:00:00.000",
    deadline: "2018-09-18 00:00:00.000",
    id_client_soft: 5,
    name_emp: "PRZEMYSŁAW",
    surname_emp: "KWARCIANY",
    debtor: "MAŁEK",
    amount: 1550,
    status: "nierozliczone",
    remained: 1550,
    createdAt: null,
    updatedAt: null,
    phone: "ccc",
    help: 1
  },
  {
    id_client: 2,
    nr_document: "FS 4352/MAG/2018",
    date_issue: "2018-09-05 00:00:00.000",
    deadline: "2018-09-19 00:00:00.000",
    id_client_soft: 5,
    name_emp: "PRZEMYSŁAW",
    surname_emp: "KWARCIANY",
    debtor: "GANCARZ",
    amount: 5806,
    status: "nierozliczone",
    remained: 5806,
    createdAt: null,
    updatedAt: null,
    phone: "ccc",
    help: 2
  }
][
  ({
    id_client: 2,
    nr_document: "FS 4332/MAG/2018",
    date_issue: "2018-09-04 00:00:00.000",
    deadline: "2018-09-18 00:00:00.000",
    id_client_soft: 16,
    name_emp: "PIOTR",
    surname_emp: "GŁOWIENKA",
    debtor: "CHARGOT",
    amount: 4787.8,
    status: "nierozliczone",
    remained: 4787.8,
    createdAt: null,
    updatedAt: null,
    phone: "bbb",
    help: 1
  },
  {
    id_client: 2,
    nr_document: "FS 4388/MAG/2018",
    date_issue: "2018-09-07 00:00:00.000",
    deadline: "2018-09-21 00:00:00.000",
    id_client_soft: 16,
    name_emp: "PIOTR",
    surname_emp: "GŁOWIENKA",
    debtor: "BULICZ",
    amount: 1410,
    status: "nierozliczone",
    remained: 1410,
    createdAt: null,
    updatedAt: null,
    phone: "bbb",
    help: 2
  })
][
  ({
    id_client: 2,
    nr_document: "FS 4345/MAG/2018",
    date_issue: "2018-09-04 00:00:00.000",
    deadline: "2018-09-18 00:00:00.000",
    id_client_soft: 8,
    name_emp: "MATEUSZ",
    surname_emp: "RÓJ",
    debtor: "HRYCAJ",
    amount: 2351,
    status: "nierozliczone",
    remained: 2351,
    createdAt: null,
    updatedAt: null,
    phone: "aaa",
    help: 1
  },
  {
    id_client: 2,
    nr_document: "FS 4366/MAG/2018",
    date_issue: "2018-09-06 00:00:00.000",
    deadline: "2018-09-20 00:00:00.000",
    id_client_soft: 8,
    name_emp: "MATEUSZ",
    surname_emp: "RÓJ",
    debtor: "POPIK",
    amount: 906,
    status: "nierozliczone",
    remained: 906,
    createdAt: null,
    updatedAt: null,
    phone: "aaa",
    help: 2
  })
][
  ({
    id_client: 2,
    nr_document: "FS 674/SK/2018",
    date_issue: "2018-09-18 00:00:00.000",
    deadline: "2018-10-02 00:00:00.000",
    id_client_soft: 1,
    name_emp: "KONRAD",
    surname_emp: "GNUTEK",
    debtor: "WOJCIECH SZPONAR",
    amount: 1170,
    status: "nierozliczone",
    remained: 1170,
    createdAt: null,
    updatedAt: null,
    phone: "gn",
    help: 1
  },
  {
    id_client: 2,
    nr_document: "FS 4628/MAG/2018",
    date_issue: "2018-09-21 00:00:00.000",
    deadline: "2018-10-05 00:00:00.000",
    id_client_soft: 1,
    name_emp: "KONRAD",
    surname_emp: "GNUTEK",
    debtor: "DEC SKLEP MIĽCZYN",
    amount: 740.2,
    status: "nierozliczone",
    remained: 740.2,
    createdAt: null,
    updatedAt: null,
    phone: "gn",
    help: 2
  })
][
  {
    id_client: 2,
    nr_document: "FS 4709/MAG/2018",
    date_issue: "2018-09-26 00:00:00.000",
    deadline: "2018-10-10 00:00:00.000",
    id_client_soft: 12,
    name_emp: "AREK",
    surname_emp: "NOWAK",
    debtor: "SAGROL",
    amount: 1311,
    status: "nierozliczone",
    remained: 1311,
    createdAt: null,
    updatedAt: null,
    phone: "ccc",
    help: 1
  }
];

const costs = [
  {
    id: 1,
    nr_dokumentu: "FV-6756",
    data_wystawienia: "2018-06-12",
    nazwa_pozycji: "Zszywacz",
    kwota_netto: 42.33,
    categoryId: 5,
    groupId: 14,
    category: {
      id: 5,
      name: "Samochód"
    },
    group: {
      id: 14,
      name: "Przemek"
    }
  },
  {
    id: 2,
    nr_dokumentu: "FV-232-234",
    data_wystawienia: "2018-06-06",
    nazwa_pozycji: "Kawa",
    kwota_netto: 32.23,
    categoryId: 2,
    groupId: 2,
    category: {
      id: 2,
      name: "Kierowcy"
    },
    group: {
      id: 2,
      name: "Przemek"
    }
  },
  {
    id: 3,
    nr_dokumentu: "FV 9238439",
    data_wystawienia: "2018-08-20",
    nazwa_pozycji: "Woda",
    kwota_netto: 265.44,
    categoryId: 2,
    category: {
      id: 2,
      name: "Samochód"
    },
    group: {
      id: 7,
      name: "Sklep N"
    }
  },
  {
    id: 4,
    nr_dokumentu: "FV 93279342",
    data_wystawienia: "2018-08-10",
    nazwa_pozycji: "Długopis",
    kwota_netto: 1.45,
    categoryId: 4,
    groupId: 6,
    category: {
      id: 4,
      name: "Kierowcy"
    },
    group: {
      id: 6,
      name: "Sklep L"
    }
  },
  {
    id: 5,
    nr_dokumentu: "Paragon 2-445-59603",
    data_wystawienia: "2018-08-15",
    nazwa_pozycji: "Kabel",
    kwota_netto: 6.54,
    categoryId: 3,
    groupId: 3,
    category: {
      id: 3,
      name: "Telefon"
    },
    group: {
      id: 3,
      name: "Arek"
    }
  },
  {
    id: 6,
    nr_dokumentu: "FV 029834",
    data_wystawienia: "2018-08-17",
    nazwa_pozycji: "Ryza papieru",
    kwota_netto: 13.56,
    categoryId: 1,
    groupId: 10,
    category: {
      id: 1,
      name: "Biurowe"
    },
    group: {
      id: 10,
      name: "Inne"
    }
  },
  {
    id: 7,
    nr_dokumentu: "FV 09345",
    data_wystawienia: "2018-08-01",
    nazwa_pozycji: "Olej",
    kwota_netto: 55.54,
    categoryId: 1,
    groupId: 10,
    category: {
      id: 1,
      name: "Biurowe"
    },
    group: {
      id: 10,
      name: "Przemek"
    }
  }
];
// costs
// const valid = costs[0].kwota_netto.indexOf(42.33);
// valid

const pierwsza = 1;
const druga = 2;
const trzeci = 3;
const array = [pierwsza, druga, trzeci];
const liczba_prev = 1;
//const str = "liczba_prev"
const l = "liczba";
const koniec = "prev";
const str = `${l}_${koniec}`;
const some = array.some((x, i) => {
  this.cos = [pierwsza, druga, trzeci];
  console.log(this.cos[1]);
  return x === eval(str);
});
some;

const eve = array.every(x => x < 4);
eve;

const klienci = [
  { client: 1, sam: "audi" },
  { client: 1, sam: "audi" },
  { client: 1, sam: "audi" },
  { client: 1, sam: "audi" },
  { client: 4, sam: "audi" },
  { client: 1, sam: "audi" },
  { client: 4, sam: "audi" },
  { client: 1, sam: "audi" },
  { client: 1, sam: "audi" },
  { client: 2, sam: "audi" },
  { client: 2, sam: "audi" },
  { client: 2, sam: "audi" },
  { client: 1, sam: "audi" },
  { client: 4, sam: "audi" },
  { client: 3, sam: "audi" },
  { client: 3, sam: "audi" },
  { client: 3, sam: "audi" },
  { client: 4, sam: "audi" },
  { client: 3, sam: "audi" },
  { client: 3, sam: "audi" }
];

const short = (arr, key, len) => {
  let shorter = [];
  let shorterWithHelp = [];
  arr.map(x => {
    shorter.push(x);
    const ile = shorter.filter(y => y[key] === x[key]).length;
    shorterWithHelp.push(Object.assign(x, { help: ile }));
  });
  return shorterWithHelp.filter(x => x.help <= len);
};

const wynik = short(klienci, "client", 3);

wynik;

const skroc = str => {
  const arr = str.split(" ");
  const [first, ...remaining] = arr;
  const len = remaining.join(" ").length;
  return len > 18
    ? `${remaining.join(" ").slice(0, 15)}...`
    : `${remaining.join(" ").slice(0, 18)}`;
};

const dlugi = "01-022 Warszawa (Wola)333";
console.log(skroc(dlugi));

const reference = [
  { id: 0, name: "aaa" },
  { id: 0, name: "bbb" },
  { id: 0, name: "ccc" }
];
const szu = "aaaa";
const fu = szu => {
  return reference.filter(x => x.name === szu).length;
};

const i = fu(szu);
i;

const string = "Warszawa Wschodnia ul. Króla Swieczka 22/45";
const skrocStringDo = (string, dlugosc) => {
  return string.slice(0, 20);
};

const sk = skrocStringDo(string, 20);
sk;

const suma = costs.reduce(x => x);
// console.log(suma);

const handleTableChange = (type, { filters }) => {
  // console.log(type);
  // console.log(filters);
  // console.log('handleTableChange setTimeout');
  // let result = [];
  const result = costs.filter(row => {
    let valid = true;
    for (const dataField in filters) {
      // console.log(filters);
      const { filterVal, filterType, comparator } = filters[dataField];
      // filterVal
      // filterType
      // comparator
      if (filterType === "TEXT") {
        // filterType
        if (comparator === "LIKE") {
          valid =
            row[dataField]
              .toString()
              .toLowerCase()
              .indexOf(filterVal.toLowerCase()) > -1;
        } else {
          valid = row[dataField] === filterVal.toLowerCase();
        }
      } else if (filterType === "MULTISELECT") {
        // filterType
        // for (const i in filterVal) {
        // console.log('filterValueSingle');
        // console.log(filterVal[i]);
        const pierwszy = dataField.split(".")[0];
        const drugi = dataField.split(".")[1];
        if (comparator === "LIKE") {
          // comparator
          // filterVal
          // pierwszy
          // drugi
          // console.log(row[pierwszy][drugi])
          valid = filterVal.includes(row[pierwszy][drugi]);
          // valid
          // valid =
          //   row[pierwszy][drugi].toString().indexOf(filterVal[i]) > -1;
        } else {
          return filterVal.includes(row[pierwszy][drugi]);
          // valid = row[pierwszy][drugi] === filterVal[i];
        }
        // }
      }
      if (!valid) break;
    }
    return valid;
  });
  // console.log(result);
  return result;
};

const filters = {
  filters: {
    "category.name": {
      filterVal: ["Samochody", "Kierowcy"],
      filterType: "MULTISELECT",
      comparator: "LIKE",
      caseSensitive: false
    },
    "group.name": {
      filterVal: ["Przemek"],
      filterType: "MULTISELECT",
      comparator: "LIKE",
      caseSensitive: false
    }
  }
};

// console.log(handleTableChange('filter', filters));

const dynamicSort = property => {
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

var array1 = [5, 12, 8, 130, 44];

const objekt = [
  { kolor: "czerwony" },
  { kolor: "bialy" },
  { kolor: "niebieski" },
  { kolor: "zielony" }
];
// const szukaj = objekt.

function findFirstLargeNumber(element) {
  return element.kolor === "niebieski";
}

console.log(objekt.findIndex(findFirstLargeNumber));
// expected output: 3

var arr = [
  { kolor: "czerwony", wieklosc: "maly", value: 1 },
  { kolor: "bialy", wieklosc: "duzy", value: 5 },
  { kolor: "niebieski", wieklosc: "sredni", value: 2 },
  { kolor: "bialy", wieklosc: "sredni", value: 3 },
  { kolor: "zielony", wieklosc: "maly", value: 3 },
  { kolor: "czerwony", wieklosc: "duzy", value: 4 },
  { kolor: "bialy", wieklosc: "duzy", value: 6 }
];

const czas = {
  start: "2018-09-07T09:00:00.000Z",
  stop: "2018-09-07T09:10:00.000Z"
};
const czas2 = {
  start: "2018-09-07T09:00:00.000Z",
  stop: "2018-09-07T09:20:00.000Z"
};
const czasy = [
  {
    start: "2018-09-07T09:00:00.000Z",
    stop: "2018-09-07T09:10:00.000Z"
  },
  {
    start: "2018-09-07T09:00:00.000Z",
    stop: "2018-09-07T09:20:00.000Z"
  }
];

const timeDiff = (start, stop) => {
  const date1 = new Date(start);
  const date2 = new Date(stop);
  const timeDiff = Math.abs(date2.getTime() - date1.getTime());
  const diffMinutes = Math.ceil(timeDiff / 1000 / 60);
  return diffMinutes;
};

const sumaCzasow = czasy => {
  let suma = 0;
  czasy.map(x => {
    suma = timeDiff(x.start, x.stop) + suma;
  });
  return suma;
};

const sumujczasy = sumaCzasow(czasy);
sumujczasy;

// const tylkoUnikalne = (value, index, self) => {
//   return self.indexOf(value) === index;
// };

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const podzielUnikalnymi = (array, key) => {
  const notUnique = array.map((el, i) => el[key]);
  const unique = notUnique.filter(onlyUnique);
  const podzielone = unique.map(element => {
    return { [key]: element, wartosci: [] };
  });
  array.map(element => {
    const ktoryIndex = podzielone => {
      return podzielone[key] === element[key];
    };
    const gdzieKlucz = podzielone.findIndex(ktoryIndex);
    podzielone[gdzieKlucz].wartosci.push(element);
  });
  return podzielone;
};

// const chmurkaKategorii = () => {
//   let mulitSelect = {};
//   const nieUnikalneKategorie = costs.map((el, i) => el.category.name);
//   const unikalne = nieUnikalneKategorie.filter(onlyUnique);
//   unikalne.map((x, i) => Object.assign(mulitSelect, { [i]: x }));
//   return mulitSelect;
// };

const wy = podzielUnikalnymi(arr, "kolor");
wy;

// const nowa = [];
// const redukuj = arr.map(x => nowa.push({ kolor: x.kolor, wartosci: x }));
// const istnieje = nowa.map(x => Object.is(x["kolor"], "czerwony"));
// istnieje;
// nowa;

const filtrowany = arr.filter(x => x.wieklosc === "maly");
// filtrowany

const arrslice = arr.slice(2);
// arrslice

const noweDoWyboru = arr.sort(dynamicSort("kolor"));

// const noweDoWyboru = arr.sort((a, b) => b.kolor - a.kolor);
// noweDoWyboru;
// arr;

// const cechy = ['kolor', 'wielkosc'];
// const zmienna = 'kolor';
const compare_set_kolor = ["bialy", "niebieski"]; // here we can set the numbers we want to use to filter the rows, only for educational purposes, i suppose you will extract them from another place.
const compare_set_wielkosc = ["duzy", "maly"]; // here we can set the numbers we want to use to filter the rows, only for educational purposes, i suppose you will extract them from another place.

const result = arr.filter(o => {
  // o;
  // compare_set.includes(o[0]);
  return compare_set_kolor.includes(o.kolor);
  // compare_set_wielkosc.includes(o.wieklosc)
});
// console.log(result);

var data = [
  { id: 1, term_id: 5, type: "car" },
  { id: 2, term_id: 3, type: "bike" },
  { id: 3, term_id: 6, type: "car" }
];

var result1 = data.filter(function(e) {
  return [5, 7].includes(e.term_id);
});

// console.log(result1);

const szukane = ["Samochód", "Telefon", "Biurowe"];
const filtruj = costs.filter(
  row => szukane.includes(row[0])
  //   {
  //   // let results = []
  //   for (const i in szukane) {
  //     return row['category']['name'] === szukane[i]
  //     // return (
  //     //   row['category']['name'] === szukane[0] ||
  //     //   row['category']['name'] === szukane[1] ||
  //     //   row['category']['name'] === szukane[2]
  //     // );
  //   }
  //   // return results
  // }
);
// console.log(filtruj.length);

const adres = "category.name";
const pierwszy = adres.split(".")[0];
const drugi = adres.split(".")[1];
// pierwszy;
// drugi;

const cm = costs.map(row => row[pierwszy][drugi]);
// cm;

const chmurkaKategorii = () => {
  let mulitSelect = {};
  const nieUnikalneKategorie = costs.map((el, i) => el.category.name);
  const unikalne = nieUnikalneKategorie.filter(onlyUnique);
  unikalne.map((x, i) => Object.assign(mulitSelect, { [i]: x }));
  return mulitSelect;
};
console.log(chmurkaKategorii());

const chmurkaGrup = () => {
  const nieUnikalneGrupy = costs.map(el => {
    return JSON.stringify({ groupId: el.groupId, group: el.group.name });
  });
  const unikalneGrupyString = [...new Set(nieUnikalneGrupy)];
  const unikalneGrupyJson = unikalneGrupyString.map(el => JSON.parse(el));
};

const wyb = costs[0];
// chmurka()
// console.log(chmurkaGrup());

const dupObj = [
  { id: 1, value: "a" },
  { id: 2, value: "b" },
  { id: 1, value: "c" },
  { id: 2, value: "c" }
];
const uniKeys = [...new Set(dupObj.map(({ id }) => id))];
uniKeys;
