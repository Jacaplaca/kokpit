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
import ReactHover from "react-hover";
import Collapse from "rc-collapse";
import "rc-collapse/assets/index.css";
// import { pl } from 'date-fns/locale';
// import CurrencyInput from 'react-currency-input';
import NumberFormat from "react-number-format";
import InputMask from "react-input-mask";

import axios from "axios";
import PropTypes from "prop-types";
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
// import NoSsr from '@material-ui/core/NoSsr';
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
// import Select from '@material-ui/core/Select';
import Select from "react-select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Send from "@material-ui/icons/Send";
import Edit from "@material-ui/icons/Edit";
import Cancel from "@material-ui/icons/Clear";

import Chip from "@material-ui/core/Chip";
import { emphasize, fade } from "@material-ui/core/styles/colorManipulator";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import WorkIcon from "@material-ui/icons/Work";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import IconButton from "@material-ui/core/IconButton";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";

import PieChart1 from "./PieChart1";
import CostsTable from "./CostsTable2Remote";

import IntegrationAutosuggest from "./CitiesSearch";
import Example from "./CitiesSearch2";

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

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  // console.log(props);

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.formattedValue.replace(/ /g, "")
          }
        });
      }}
      // removeFormatting={formattedValue => `{}`}
      decimalSeparator=","
      thousandSeparator=" "
      // format="### ### ### ###"
      decimalScale={2}
      // prefix="$"
      suffix="  zł"
    />
  );
}

class Planer extends Component {
  state = {
    // numberformat: '',
    id: "",
    nr_dokumentu: "FV 83929",
    data_wystawienia: "2018-07-05",
    nazwa_pozycji: "Benzyna",
    kwota_netto: "",
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
    this.fetchCosts();
  }

  fetchCosts = () => {
    axios.get("/api/table/costs").then(result => {
      const koszty = result.data;
      console.log(koszty);
      const nieUnikalneGrupy = koszty.map(el => {
        return { groupId: el.groupId, group: el.group.name };
      });
      koszty.map(el => Object.assign(el, { clicked: true }));
      this.setState({
        costs: koszty,
        chmurka_group: this.chmurka(koszty, "group"),
        chmurka_category: this.chmurka(koszty, "category")
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
        this.fetchCosts();
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
        this.fetchCosts();
      })
      .then(() => {
        this.clearForm();
      });
  };

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
        <Paper style={{ padding: 20, marginBottom: 20 }}>
          <form
            onSubmit={e => this.handleSubmit(e)}
            // method="POST"
            // action="/api/cost/"
          >
            <FormControl
              className={classes.formControl}
              aria-describedby="name-helper-text"
            >
              <InputLabel htmlFor="name-helper">Nr dokumentu</InputLabel>
              <Input
                disabled
                name="nr_dokumentu"
                id="name-helper"
                value={this.state.nr_dokumentu}
                onChange={this.handleChange}
              />
              {/* <FormHelperText id="name-helper-text">
            Some important helper text
          </FormHelperText> */}
            </FormControl>
            <FormControl
              className={classes.formControl}
              aria-describedby="name-helper-text"
            >
              {/* <InputLabel htmlFor="name-helper">Name</InputLabel> */}
              <TextField
                disabled
                name="data_wystawienia"
                id="date"
                label="Data wystawienia"
                type="date"
                // defaultValue="2017-05-24"
                value={this.state.data_wystawienia}
                className={classes.textField}
                onChange={this.handleChange}
                InputLabelProps={{
                  shrink: true
                }}
              />
              {/* <FormHelperText id="name-helper-text">
            Some important helper text
          </FormHelperText> */}
            </FormControl>
            <FormControl
              className={classes.formControl}
              aria-describedby="name-helper-text"
            >
              <InputLabel htmlFor="name-helper">Nazwa pozycji</InputLabel>
              <Input
                disabled
                name="nazwa_pozycji"
                id="name-helper"
                value={this.state.nazwa_pozycji}
                onChange={this.handleChange}
                style={{ width: 300 }}
              />
              {/* <FormHelperText id="name-helper-text">
            Some important helper text
          </FormHelperText> */}
            </FormControl>

            <FormControl className={classes.formControl}>
              {/* <InputLabel htmlFor="adornment-password">Kwota netto</InputLabel> */}
              <TextField
                disabled
                className={classes.formControl}
                name="kwota_netto"
                label="Kwota netto"
                value={this.state.kwota_netto.replace(".", ",")}
                // onChange={this.handleChange}
                // value={this.state.kwota_netto}
                onChange={this.handleChangeKwota("kwota_netto")}
                id="formatted-numberformat-input"
                InputProps={{
                  inputComponent: NumberFormatCustom
                }}
                // endAdornment={
                //   <InputAdornment position="end">PLN</InputAdornment>
                // }
              />
              {/* <Input
                name="kwota_netto"
                id="adornment-password"
                // type={this.state.showPassword ? 'text' : 'password'}
                value={this.state.kwota_netto.replace('.', ',')}
                onChange={this.handleChange}
                style={{ width: 150 }}
                endAdornment={
                  <InputAdornment position="end">PLN</InputAdornment>
                }
              /> */}
            </FormControl>
            <div style={{ display: "flex" }}>
              {/* <div style={{ width: 410, marginRight: 22 }}>
                <InputLabel htmlFor="city">Miejscowość</InputLabel>
                <Select
                  placeholder="Wybierz..."
                  components={components}
                  classes={classes}
                  name="city"
                  id="city"
                  value={this.state.city}
                  onChange={this.handleChangeSelect('city')}
                  className={classes.selectEmpty}
                  options={this.renderSelectCity(this.state.city)}
                />
              </div> */}
              <IntegrationAutosuggest />
              {/* <Example /> */}
              {/* <div style={{ width: 305 }}>
                <InputLabel htmlFor="age-required">Grupa</InputLabel>
                <Select
                  placeholder="Wybierz..."
                  name="groupId"
                  components={components}
                  classes={classes}
                  options={this.renderSelect(this.state.groups)}
                  value={this.state.groupId}
                  onChange={this.handleChangeSelect('groupId')}
                />
              </div> */}
            </div>
            {/* <div style={{ display: "flex" }}>
              <span>asdf</span>
              <span style={{ float: "right", fontSize: 12 }}>
                asdfasdfasdfasf
              </span>
            </div> */}
            {!this.state.edited ? (
              <Button
                disabled={this.state.submitIsDisable}
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Dodaj koszt
                <Send style={{ marginLeft: 10 }} />
              </Button>
            ) : (
              <Button
                // type="submit"
                disabled={this.state.submitIsDisable}
                onClick={() => this.onEdit()}
                variant="contained"
                color="primary"
                className={classes.button}
              >
                Edytuj koszt
                <Edit style={{ marginLeft: 10 }} />
              </Button>
            )}
            {this.czyWypelniony() && (
              <Button
                variant="contained"
                className={classes.button}
                onClick={() => this.clearForm()}
              >
                Anuluj
                <Cancel style={{ marginLeft: 10 }} />
              </Button>
            )}
          </form>
        </Paper>
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
        >
          <Collapse
            accordion={true}
            // activeKey="0" defaultActiveKey="0"
          >
            <Panel
              // key="0"
              header={<span style={{ fontWeight: "600" }}>Podsumowanie</span>}
              headerClass={classes.accordionClass}
              style={{ color: "white" }}
            >
              <div>
                <div style={{ width: "100%" }}>
                  <PieChart1
                    dane={this.sumOfKey(this.costs(), "category")}
                    label="Kategorie"
                    // group={this.sumOfKey(this.costs(), 'group')}
                  />
                </div>
                <div style={{ width: "100%" }}>
                  <PieChart1
                    // category={this.sumOfKey(this.costs(), 'category')}
                    dane={this.sumOfKey(this.costs(), "group")}
                    label="Grupy"
                  />
                </div>
              </div>
            </Panel>
          </Collapse>
        </Paper>
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

          {/* <CostsTable
            costs={this.costs()}
            fetch={() => this.fetchCosts()}
            edit={id => this.handleEdit(id)}
            // range={this.state.rangeselection}
          /> */}
        </Paper>
        {/* <div>
          <Paper>
            <List component="nav" dense={true}>
              {this.renderCosts(this.state.costs)}
            </List>
          </Paper>
        </div> */}
        <Accordion>
          <AccordionItem className="accordion-item">
            <h1>Section 1</h1>
            <AccordionItemContent>
              <p>Content for section 1</p>
            </AccordionItemContent>
          </AccordionItem>
          <AccordionItem className="accordion-item">
            <h1>Section 2</h1>
            <AccordionItemContent>
              <p>Content for section 2</p>
            </AccordionItemContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
}

const Accordion = styled.div`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

const AccordionItem = styled.section`
  border-bottom: 1px solid #666;
  padding: 1em;
  color: #eee;
  background-color: hsl(200, 80%, 60%);
  background-image: linear-gradient(
    -90deg,
    hsl(200, 80%, 60%),
    hsl(200, 80%, 45%) 2em,
    hsl(200, 80%, 60%)
  );
  &:hover {
    ${AccordionItemContent} {
      height: auto;
    }
  }
`;

const AccordionItemContent = styled.div`
  height: 0;
  overflow: hidden;
  transition: height 0.25s;
`;

// .accordion:hover .accordion-item:hover .accordion-item-content,
// .accordion .accordion-item--default .accordion-item-content {
//     height: 6em;
// }

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
