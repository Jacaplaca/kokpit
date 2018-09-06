import React, { Component } from "react";
// import { DateRange } from 'react-date-range';
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import {
  DateRangePicker,
  createStaticRanges,
  defaultStaticRanges
} from "react-date-range";
import styled from "styled-components";
import { pl } from "react-date-range/src/locale/index";
import _ from "lodash";
import currency from "currency.js";
import { connect } from "react-redux";
import {
  addDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
  differenceInCalendarDays
} from "date-fns";
import Collapse from "rc-collapse";
import "rc-collapse/assets/index.css";
// import { pl } from 'date-fns/locale';
// import CurrencyInput from 'react-currency-input';

import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
// import NoSsr from '@material-ui/core/NoSsr';
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Send from "@material-ui/icons/Send";
import Edit from "@material-ui/icons/Edit";
import Cancel from "@material-ui/icons/Clear";

import { dataToString } from "../common/functions";

import { emphasize, fade } from "@material-ui/core/styles/colorManipulator";

import PieChart1 from "./PieChart1";

import PlanerAktywnosciForm from "./PlanerAktywnosciForm";
import PlanerAktywnosciLista from "./PlanerAktywnosciLista";

//poprawic wyszukiwanie po miescie bo dziwnie pokazuje lubartow ze jest w powiecie zaganskim, pewnie ma to zwiazek z tym że niektore wyniki pokazuje jako pierwsze

var Panel = Collapse.Panel;

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

const components = {
  // Option,
  Control,
  // NoOptionsMessage,
  Placeholder
  //SingleValue,
  //MultiValue,
  //ValueContainer,
  //Menu,
};

const defineds = {
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

const staticRanges = [
  // ...defaultStaticRanges,
  ...createStaticRanges([
    {
      label: "Dziś",
      range: () => ({
        startDate: defineds.startOfToday,
        endDate: defineds.endOfToday
      })
    },
    {
      label: "Wczoraj",
      range: () => ({
        startDate: defineds.startOfYesterday,
        endDate: defineds.endOfYesterday
      })
    },

    {
      label: "Bieżący tydzień",
      range: () => ({
        startDate: defineds.startOfWeek,
        endDate: defineds.endOfWeek
      })
    },
    {
      label: "Poprzedni tydzień",
      range: () => ({
        startDate: defineds.startOfLastWeek,
        endDate: defineds.endOfLastWeek
      })
    },
    {
      label: "Bieżący miesiąc",
      range: () => ({
        startDate: defineds.startOfMonth,
        endDate: defineds.endOfMonth
      })
    },
    {
      label: "Poprzedni miesiąc",
      range: () => ({
        startDate: defineds.startOfLastMonth,
        endDate: defineds.endOfLastMonth
      })
    }
  ])
];

const styles = theme => ({
  input: {
    display: "flex",
    padding: 0
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  },
  accordionClass: {
    backgroundColor: fade(theme.palette.primary.main, 0.15)
    // borderColor: theme.palette.primary.main,
    // color: 'white'
  },
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  container: {
    width: "100%",
    display: "inline-block",
    flexWrap: "nowrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  formControl: {
    margin: theme.spacing.unit
  },
  mojChipClickedRoot: {
    color: "white",
    margin: theme.spacing.unit / 2,
    backgroundColor: theme.palette.primary.main
  },
  mojChipRoot: {
    margin: theme.spacing.unit / 2,
    backgroundColor: "lightgray"
  },
  mojChipClicked: {
    "&:hover, &:focus": {
      margin: theme.spacing.unit / 2,
      backgroundColor: "lightgray"
    },
    "&:active": {
      color: "white",
      margin: theme.spacing.unit / 2,
      backgroundColor: theme.palette.primary.main
    }
  },
  mojChip: {
    "&:hover, &:focus": {
      color: "white",
      margin: theme.spacing.unit / 2,
      backgroundColor: theme.palette.primary.main
    },
    "&:active": {
      margin: theme.spacing.unit / 2,
      backgroundColor: "lightgray"
    }
  }
});

class Planer extends Component {
  state = {
    // numberformat: '',
    aktywnosci: [],
    id: "",
    nr_dokumentu: "",
    data_wystawienia: "",
    nazwa_pozycji: "",
    kwota_netto: "",

    start: "",
    // categoryId: { label: '', value: '' },
    // groupId: { label: '', value: '' },
    categoryId: "",
    groupId: "",
    groups: [],
    categories: [],
    costs: [],
    edited: false,
    chmurka_group: [],
    chmurka_category: [],
    city: "",
    rangeselection: {
      // startDate: defineds.startOfMonth,
      // endDate: defineds.endOfMonth,
      startDate: defineds.startOfLastMonth,
      endDate: defineds.endOfLastMonth,
      key: "rangeselection"
    },
    submitIsDisable: true
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      nr_dokumentu: nr_dokumentu_prevState,
      data_wystawienia: data_wystawienia_prevState,
      nazwa_pozycji: nazwa_pozycji_prevState,
      kwota_netto: kwota_netto_prevState,
      categoryId: categoryId_prevState,
      groupId: groupId_prevState
    } = prevState;
    const {
      nr_dokumentu,
      data_wystawienia,
      nazwa_pozycji,
      kwota_netto,
      categoryId,
      groupId
    } = this.state;
    if (
      (nr_dokumentu !== nr_dokumentu_prevState ||
        data_wystawienia !== data_wystawienia_prevState ||
        nazwa_pozycji !== nazwa_pozycji_prevState ||
        kwota_netto !== kwota_netto_prevState ||
        categoryId !== categoryId_prevState ||
        groupId !== groupId_prevState) &&
      (nr_dokumentu !== "" &&
        data_wystawienia !== "" &&
        nazwa_pozycji !== "" &&
        kwota_netto !== "" &&
        (categoryId ? categoryId.value !== "" : categoryId !== "") &&
        (groupId ? groupId.value !== "" : groupId !== ""))
      // categoryId.value !== '' &&
      // groupId.value !== ''
    ) {
      this.setState({ submitIsDisable: false });
    } else if (
      (nr_dokumentu !== nr_dokumentu_prevState ||
        data_wystawienia !== data_wystawienia_prevState ||
        nazwa_pozycji !== nazwa_pozycji_prevState ||
        kwota_netto !== kwota_netto_prevState ||
        categoryId !== categoryId_prevState ||
        groupId !== groupId_prevState) &&
      (nr_dokumentu === "" ||
        data_wystawienia === "" ||
        nazwa_pozycji === "" ||
        kwota_netto === "" ||
        (categoryId ? categoryId.value === "" : categoryId === "") ||
        (groupId ? groupId.value === "" : groupId === ""))
    ) {
      this.setState({ submitIsDisable: true });
    } else {
      return;
    }
  }

  czyWypelniony = () => {
    const {
      id,
      nr_dokumentu,
      data_wystawienia,
      nazwa_pozycji,
      kwota_netto,
      categoryId,
      groupId
    } = this.state;
    if (
      id ||
      nr_dokumentu ||
      data_wystawienia ||
      nazwa_pozycji ||
      kwota_netto ||
      categoryId ||
      groupId
    ) {
      return true;
    } else {
      return false;
    }
  };

  clearForm = () => {
    this.setState({
      id: "",
      nr_dokumentu: "",
      data_wystawienia: "",
      nazwa_pozycji: "",
      kwota_netto: "",
      categoryId: "",
      groupId: "",
      edited: false
    });
  };

  componentWillMount() {
    axios
      .get("/api/table/group")
      .then(result => this.setState({ groups: result.data }));
    // .then(result => this.renderSelect(result.data));
    axios
      .get("/api/table/category")
      .then(result => this.setState({ categories: result.data }));
    this.fetchAktywnosci();
  }

  fetchAktywnosci = () => {
    const { startDate, endDate } = this.state.rangeselection;
    axios
      .get(
        `/api/table/planerAktywnosci/${dataToString(startDate)}_${dataToString(
          endDate
        )}`
      )
      .then(result => {
        this.setState({
          aktywnosci: result.data
        });
      });
  };

  chmurka = (data, kolumna) => {
    const nieUnikalneGrupy = data.map(el => {
      return JSON.stringify({
        id: el[`${kolumna}Id`],
        name: el[kolumna].name,
        clicked: true
      });
    });
    const unikalneGrupyString = [...new Set(nieUnikalneGrupy)];
    return unikalneGrupyString.map(el => JSON.parse(el));
  };

  // onlyUnique = (value, index, self) => {
  //   return self.indexOf(value) === index;
  // };

  renderSelectNorm = select => {
    const none = (
      <MenuItem value="">
        <em>Brak</em>
      </MenuItem>
    );
    const doWyboru = select.map(elem => (
      <MenuItem key={select} value={elem.id}>
        {elem.name}
      </MenuItem>
    ));
    return [none, ...doWyboru];
  };

  dynamicSort = property => {
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

  renderSelect = select => {
    const none = { label: "Brak", value: "" };
    const doWyboru = select.map((elem, i) => ({
      label: elem.name,
      value: elem.id
    }));
    return doWyboru.sort(this.dynamicSort("label"));
  };

  renderSelectCity = select => {
    console.log(select);
    // const none = { label: 'Brak', value: '' };
    // const doWyboru = select.map((elem, i) => ({
    //   label: elem.name,
    //   value: elem.id
    // }));
    // return doWyboru.sort(this.dynamicSort('label'));
  };

  handleEdit = id => {
    axios.get(`/api/cost/${id}`).then(result => {
      const {
        nr_dokumentu,
        data_wystawienia,
        nazwa_pozycji,
        kwota_netto,
        category,
        group
      } = result.data;
      this.setState({
        id,
        nr_dokumentu,
        kwota_netto,
        nazwa_pozycji,
        data_wystawienia,
        categoryId: { label: category.name, value: category.id },
        groupId: { label: group.name, value: group.id },
        edited: true
      });
    });
  };

  onEdit = () => {
    const {
      id,
      nr_dokumentu,
      data_wystawienia,
      nazwa_pozycji,
      kwota_netto,
      categoryId,
      groupId
    } = this.state;
    const url = `/api/cost/edit/${id}`;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        nr_dokumentu,
        data_wystawienia,
        nazwa_pozycji,
        kwota_netto,
        categoryId,
        groupId
      })
    })
      .then(() => {
        this.fetchAktywnosci();
      })
      .then(() => {
        this.clearForm();
      });
  };

  handleSubmit = e => {
    const { user_id, clientId } = this.props.auth;
    e.preventDefault();
    const {
      nr_dokumentu,
      data_wystawienia,
      nazwa_pozycji,
      kwota_netto,
      categoryId,
      groupId
    } = this.state;
    const url = "/api/cost";

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        nr_dokumentu,
        data_wystawienia,
        nazwa_pozycji,
        kwota_netto,
        categoryId,
        groupId
      })
    })
      .then(resp => resp.json())
      .then(data => {
        const dataWystawienia = data.data_wystawienia;
        const startDate = startOfMonth(dataWystawienia);
        const endDate = endOfMonth(dataWystawienia);
        const rangeselection = { endDate, startDate, key: "rangeselection" };
        this.setState({ rangeselection });
        // return console.log(startDate);
      })
      .then(() => {
        this.fetchAktywnosci();
      })
      .then(() => {
        this.clearForm();
      });
  };

  // onChange = data => {
  //   this.setState({ phone: data.target.value });
  // };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeKwota = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleChangeSelect = name => value => {
    console.log(name);
    console.log(value);
    this.setState({
      [name]: value
    });
  };

  handleChipClick = (data, kolumna) => () => {
    let koszty;
    let drugaKolumna;
    let porownanie = [];
    let zmodyfikowaneChip = [];
    switch (kolumna) {
      case "category":
        drugaKolumna = "group";
        break;
      case "group":
        drugaKolumna = "category";
        break;
      default:
    }

    this.setState(state => {
      const chipData = [...state[`chmurka_${kolumna}`]];
      const chipToClick = chipData.indexOf(data);
      data.clicked = data.clicked ? false : true;
      chipData[chipToClick] = data;
      return { [`chmurka_${kolumna}`]: chipData };
    });
    this.setState(state => {
      koszty = [...state.costs];
      koszty.map(el => {
        if (el[`${kolumna}Id`] !== data.id) {
          return el;
        } else {
          return Object.assign(el, { clicked: el.clicked ? false : true });
        }
      });
    });
    this.setState(state => {
      const chipData = [...state[`chmurka_${drugaKolumna}`]];
      const drugaKolumnaFalse = koszty.map(el => {
        if (!el.clicked) {
          return el[drugaKolumna].name;
        } else {
          return null;
        }
      });
      const jestTrue = drugaKolumnaFalse.map(el =>
        koszty.filter(x => x[drugaKolumna].name === el && x.clicked === true)
      );
      const porownanie = drugaKolumnaFalse.map((x, i) => {
        const dlugoscJestTrue = jestTrue[i].length;
        return { name: x, powtarza: dlugoscJestTrue };
      });

      porownanie.map(x => {
        if (x.name !== null && x.powtarza === 0) {
          chipData.map(y => {
            if (y.name === x.name) {
              return zmodyfikowaneChip.push({
                id: y.id,
                name: y.name,
                clicked: false
              });
            } else {
              return zmodyfikowaneChip.push({
                id: y.id,
                name: y.name,
                clicked: true
              });
            }
          });
        } else if (x.name !== null && x.powtarza > 0) {
          zmodyfikowaneChip = chipData.map(y => {
            if (y.name === x.name) {
              // console.log(x.name);
              return { id: y.id, name: y.name, clicked: true };
            } else {
              return { id: y.id, name: y.name, clicked: false };
            }
          });
        }
      });
    });
  };

  costs = () => {
    const koszty = this.state.costs;
    const { startDate, endDate } = this.state.rangeselection;
    const kosztyFiltered = koszty.filter(x => {
      const data = new Date(x.data_wystawienia);
      return data >= startDate && data <= endDate;
    });
    const costsInt = kosztyFiltered.map(x =>
      Object.assign(x, {
        kwota_netto: parseFloat(x.kwota_netto)
      })
    );
    return costsInt;
  };

  handleSelect = ranges => {
    this.setState({
      ...ranges
    });
  };

  sumOfKey = (data, key) => {
    let dane;
    let sorting;
    switch (key) {
      case "category":
        dane = _(data)
          .groupBy("category.name")
          .map((v, k) => {
            const suma = _.sumBy(v, "kwota_netto");
            return {
              name: k,
              value: Math.round(suma),
              value_format: `${currency(Math.round(suma), {
                separator: " ",
                decimal: ","
              }).format()}`
            };
          })
          .value();

        sorting = dane.sort(function(a, b) {
          return a.value - b.value;
        });

        return sorting.reverse();

        break;
      case "group":
        dane = _(data)
          .groupBy("group.name")
          .map((v, k) => {
            const suma = _.sumBy(v, "kwota_netto");
            return {
              name: k,
              value: suma,
              value_format: `${currency(Math.round(suma), {
                separator: " ",
                decimal: ","
              }).format()}`
            };
          })
          .value();

        sorting = dane.sort(function(a, b) {
          return a.value - b.value;
        });

        return sorting.reverse();

        break;
      default:
    }
  };

  render() {
    const { classes } = this.props;
    const selectionRange = {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection"
    };

    const { startDate, endDate } = this.state.rangeselection;

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

    return (
      <div className={classes.container}>
        <PlanerAktywnosciForm />
        <Paper
          className={classes.accordionMain}
          // style={{ marginBottom: 10 }}
        >
          <Collapse accordion={true}>
            <Panel
              header={
                <span style={{ fontWeight: "600" }}>
                  Zakres: {startDateString} - {endDateString}
                </span>
              }
              headerClass={classes.accordionClass}
              // style={{ color: 'white' }}
            >
              <DateRangePicker
                // initialFocusedRange={}
                locale={pl}
                // ranges={}
                inputRanges={[]}
                staticRanges={staticRanges}
                showSelectionPreview={true}
                ranges={[this.state.rangeselection]}
                onChange={this.handleSelect}
                moveRangeOnFirstSelection={false}
                months={2}
                direction="horizontal"
                rangeColors={["#303f9f"]}
              />
            </Panel>
          </Collapse>
        </Paper>
        <Paper
          className={classes.accordionMain}
          // style={{
          //   marginBottom: 10,
          //   border: '1px solid #000',
          //   color: 'white'
          // }}
        />
        <Paper>
          <Collapse
            accordion={true}
            activeKey="0"
            defaultActiveKey="0"
            onMouseEnter={() => console.log("Collapse")}
          >
            <Panel
              onMouseOver={e => {
                console.log(e);
              }}
              key="0"
              header={<span style={{ fontWeight: "600" }}>Podsumowanie</span>}
              headerClass={classes.accordionClass}
              style={{ color: "white" }}
            >
              <div>alskdfjl</div>
            </Panel>
            <Panel
              key="1"
              header={<span style={{ fontWeight: "600" }}>Podsumowanie</span>}
              headerClass={classes.accordionClass}
              style={{ color: "white" }}
            >
              <div>alskdfjl</div>
            </Panel>
          </Collapse>
          <Paper>
            <PlanerAktywnosciLista />
          </Paper>

          {/* <CostsTable
            costs={this.costs()}
            fetch={() => this.fetchAktywnosci()}
            edit={id => this.handleEdit(id)}
            // range={this.state.rangeselection}
          /> */}
        </Paper>
      </div>
    );
  }
}

Planer.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth };
}

// export default connect(mapStateToProps)(Header);

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps
    // actions
  )(Planer)
);

// CREATE TABLE `planer_aktywnosci` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `start` datetime(6) NOT NULL,
//   `stop` datetime(6) NOT NULL,
//   `miejsce_id` int(11) DEFAULT NULL,
//   `aktywnosc_id` int(11) DEFAULT NULL,
//   `inna` varchar(150) DEFAULT NULL,
//   `uwagi` varchar(200) DEFAULT NULL,
//   `wyslano` tinyint(1) NOT NULL,
//   `user_id` int(11) NOT NULL DEFAULT "1",
//   `klient_id` int(11) NOT NULL DEFAULT "1",
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=894 DEFAULT CHARSET=utf8

// CREATE TABLE `planer_klienci` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `nazwa` varchar(150) NOT NULL,
//   `adr_Kod` varchar(9) NOT NULL,
//   `adr_Miejscowosc` varchar(60) NOT NULL,
//   `kh_id` varchar(6) NOT NULL,
//   `clientId` int(11) NOT NULL,
//   `createdAt` date DEFAULT NULL,
//   `updatedAt` date DEFAULT NULL,
//   PRIMARY KEY (`id`),
//   KEY `fk_planer_klienci_clients1_idx` (`clientId`),
//   CONSTRAINT `fk_planer_klienci_clients1` FOREIGN KEY (`clientId`) REFERENCES `clients` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
// ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin2
//
// CREATE TABLE `myapp_klienci` (
//   `id` int(11) NOT NULL AUTO_INCREMENT,
//   `nazwa` varchar(150) NOT NULL,
//   `adr_Kod` varchar(9) NOT NULL,
//   `adr_Miejscowosc` varchar(60) NOT NULL,
//   `kh_id` varchar(6) NOT NULL,
//   PRIMARY KEY (`id`)
// ) ENGINE=InnoDB AUTO_INCREMENT=100003 DEFAULT CHARSET=utf8
