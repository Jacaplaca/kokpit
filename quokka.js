const costs = [
  {
    id: 1,
    nr_dokumentu: 'FV-6756',
    data_wystawienia: '2018-06-12',
    nazwa_pozycji: 'Zszywacz',
    kwota_netto: 42.33,
    categoryId: 5,
    groupId: 14,
    category: {
      id: 5,
      name: 'Samochód'
    },
    group: {
      id: 14,
      name: 'Przemek'
    }
  },
  {
    id: 2,
    nr_dokumentu: 'FV-232-234',
    data_wystawienia: '2018-06-06',
    nazwa_pozycji: 'Kawa',
    kwota_netto: 32.23,
    categoryId: 2,
    groupId: 2,
    category: {
      id: 2,
      name: 'Kierowcy'
    },
    group: {
      id: 2,
      name: 'Przemek'
    }
  },
  {
    id: 3,
    nr_dokumentu: 'FV 9238439',
    data_wystawienia: '2018-08-20',
    nazwa_pozycji: 'Woda',
    kwota_netto: 265.44,
    categoryId: 2,
    category: {
      id: 2,
      name: 'Samochód'
    },
    group: {
      id: 7,
      name: 'Sklep N'
    }
  },
  {
    id: 4,
    nr_dokumentu: 'FV 93279342',
    data_wystawienia: '2018-08-10',
    nazwa_pozycji: 'Długopis',
    kwota_netto: 1.45,
    categoryId: 4,
    groupId: 6,
    category: {
      id: 4,
      name: 'Kierowcy'
    },
    group: {
      id: 6,
      name: 'Sklep L'
    }
  },
  {
    id: 5,
    nr_dokumentu: 'Paragon 2-445-59603',
    data_wystawienia: '2018-08-15',
    nazwa_pozycji: 'Kabel',
    kwota_netto: 6.54,
    categoryId: 3,
    groupId: 3,
    category: {
      id: 3,
      name: 'Telefon'
    },
    group: {
      id: 3,
      name: 'Arek'
    }
  },
  {
    id: 6,
    nr_dokumentu: 'FV 029834',
    data_wystawienia: '2018-08-17',
    nazwa_pozycji: 'Ryza papieru',
    kwota_netto: 13.56,
    categoryId: 1,
    groupId: 10,
    category: {
      id: 1,
      name: 'Biurowe'
    },
    group: {
      id: 10,
      name: 'Inne'
    }
  },
  {
    id: 7,
    nr_dokumentu: 'FV 09345',
    data_wystawienia: '2018-08-01',
    nazwa_pozycji: 'Olej',
    kwota_netto: 55.54,
    categoryId: 1,
    groupId: 10,
    category: {
      id: 1,
      name: 'Biurowe'
    },
    group: {
      id: 10,
      name: 'Przemek'
    }
  }
];
// costs
// const valid = costs[0].kwota_netto.indexOf(42.33);
// valid

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
      if (filterType === 'TEXT') {
        // filterType
        if (comparator === 'LIKE') {
          valid =
            row[dataField]
              .toString()
              .toLowerCase()
              .indexOf(filterVal.toLowerCase()) > -1;
        } else {
          valid = row[dataField] === filterVal.toLowerCase();
        }
      } else if (filterType === 'MULTISELECT') {
        // filterType
        // for (const i in filterVal) {
        // console.log('filterValueSingle');
        // console.log(filterVal[i]);
        const pierwszy = dataField.split('.')[0];
        const drugi = dataField.split('.')[1];
        if (comparator === 'LIKE') {
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
    'category.name': {
      filterVal: ['Samochody', 'Kierowcy'],
      filterType: 'MULTISELECT',
      comparator: 'LIKE',
      caseSensitive: false
    },
    'group.name': {
      filterVal: ['Przemek'],
      filterType: 'MULTISELECT',
      comparator: 'LIKE',
      caseSensitive: false
    }
  }
};

// console.log(handleTableChange('filter', filters));

const dynamicSort = property => {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function(a, b) {
    const result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
};

var arr = [
  { kolor: 'czerwony', wieklosc: 'maly', value: 1 },
  { kolor: 'bialy', wieklosc: 'duzy', value: 5 },
  { kolor: 'niebieski', wieklosc: 'sredni', value: 2 },
  { kolor: 'zielony', wieklosc: 'maly', value: 3 },
  { kolor: 'czerwony', wieklosc: 'duzy', value: 4 }
];
const noweDoWyboru = arr.sort(dynamicSort('kolor'));

// const noweDoWyboru = arr.sort((a, b) => b.kolor - a.kolor);
noweDoWyboru;
arr;

const cechy = ['kolor', 'wielkosc'];
const zmienna = 'kolor';
const compare_set_kolor = ['bialy', 'niebieski']; // here we can set the numbers we want to use to filter the rows, only for educational purposes, i suppose you will extract them from another place.
const compare_set_wielkosc = ['duzy', 'maly']; // here we can set the numbers we want to use to filter the rows, only for educational purposes, i suppose you will extract them from another place.

const result = arr.filter(o => {
  // o;
  // compare_set.includes(o[0]);
  return (
    compare_set_kolor.includes(o.kolor) &&
    compare_set_wielkosc.includes(o.wieklosc)
  );
});
console.log(result);

var data = [
  { id: 1, term_id: 5, type: 'car' },
  { id: 2, term_id: 3, type: 'bike' },
  { id: 3, term_id: 6, type: 'car' }
];

var result1 = data.filter(function(e) {
  return [5, 7].includes(e.term_id);
});

console.log(result1);

const szukane = ['Samochód', 'Telefon', 'Biurowe'];
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
console.log(filtruj.length);

const adres = 'category.name';
const pierwszy = adres.split('.')[0];
const drugi = adres.split('.')[1];
pierwszy;
drugi;

const cm = costs.map(row => row[pierwszy][drugi]);
cm;

onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

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
console.log(chmurkaGrup());

const dupObj = [
  { id: 1, value: 'a' },
  { id: 2, value: 'b' },
  { id: 1, value: 'c' }
];
const uniKeys = [...new Set(dupObj.map(({ id }) => id))];
uniKeys;
