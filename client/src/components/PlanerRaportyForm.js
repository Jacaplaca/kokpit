import React, { Component } from "react";
// import { DateRange } from 'react-date-range';
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import _ from "lodash";
import currency from "currency.js";
import { connect } from "react-redux";
import { startOfMonth, endOfMonth } from "date-fns";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import classNames from "classnames";
import Paper from "@material-ui/core/Paper";
import Select from "react-select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Send from "@material-ui/icons/Send";
import Edit from "@material-ui/icons/Edit";
import Cancel from "@material-ui/icons/Clear";

import Chip from "@material-ui/core/Chip";
import DoneIcon from "@material-ui/icons/Done";

import CitySearch from "./CitiesSearch";
import InputWyborBaza from "./InputWyborBaza";
import InputSelectBaza from "./InputSelectBaza";
import InputTime from "./InputTime";
import InputData from "./InputData";
import InputComponent from "./InputComponent";
import KlienciSearch from "./KlienciSearch";

import { wezGodzine, dynamicSort, dataToString } from "../common/functions";

const styles = theme => ({
  aktyDoRaportu: {
    // background: `linear-gradient(45deg, ${fade(
    //   theme.palette.secondary.main,
    //   1
    // )} 30%, ${fade(theme.palette.secondary.light, 1)} 90%)`,
    marginTop: 10,
    //background: "lightgray",
    padding: 5
  },
  input: {
    display: "flex",
    padding: 0
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  },
  // accordionClass: {
  //   backgroundColor: fade(theme.palette.primary.main, 0.15)
  //   // borderColor: theme.palette.primary.main,
  //   // color: 'white'
  // },
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
  root: {
    // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    // boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)"
    // background: `linear-gradient(45deg, ${fade(
    //   theme.palette.secondary.main,
    //   1
    // )} 30%, ${fade(theme.palette.secondary.light, 1)} 90%)`,
    //boxShadow: "0 1px 3px 1px rgba(33, 203, 243, .3)",
    background: `${fade(theme.palette.primary.main, 1)}`,
    // background: "white",
    borderRadius: 3,
    //border: 0,
    color: "white",
    height: 50,
    width: "100%",
    padding: "0 5px",
    marginTop: 5,
    // lineHeight: 1
    "&:hover": {
      color: "white",
      background: `${fade(theme.palette.primary.main, 0.5)}`
    }
    // lineHeight: 1
  },
  hover: {},
  label: {
    // textTransform: "capitalize"
    //padding: 0,
    borderColor: "gray",
    textAlign: "left"
  },
  chipsContainer: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  buttonChip: { borderRadius: 30, height: 23, margin: theme.spacing.unit },
  buttonChipYes: {
    background: `${fade(theme.palette.primary.main, 1)}`,
    color: "white",
    "&:hover": {
      background: `${fade(theme.palette.primary.main, 0.85)}`
    }
  },
  buttonChipNo: { background: "lightgray" }
});

class PlanerRaportyForm extends Component {
  state = {
    id: "",
    //datyUnikalne: [],
    dataWybrana: "",
    aktyDaty: [],
    datyDoRaportu: [],

    kiedy: "",
    start: "",
    stop: "",
    miejsce_id: "",
    aktywnosc_id: "",
    planer_klienci_id: "",
    inna: "",
    uwagi: "",
    wyslano: "",

    nawozy: false,
    nowyKlient: false,
    sprzedaz: false,
    zamowienie: false,
    zboza: false,

    miejsceLabel: "",
    klientLabel: "",

    errorStart: false,
    errorStop: false,
    errorKiedy: false,

    activities: [],
    edited: false,
    submitIsDisable: true,
    //editedId: null,

    miejsce_id_temp: "",
    miejsceLabel_temp: ""
  };

  componentWillMount() {
    this.state.id !== this.props.editedId &&
      this.handleEdit(this.props.editedId);
  }

  validateTime = (time, pole) => {
    const nazwaPola = `error${pole}`;
    const hours = Math.trunc(time.split(":")[0]);
    const minutes = Math.trunc(time.split(":")[1]);
    // console.log(`${hours} : ${minutes}`);
    // console.log(hours.length);
    if (hours < 0 || hours > 23 || (minutes < 0 || minutes > 59)) {
      // console.log("zly czas");
      this.setState({ [nazwaPola]: true });
    }
    if (hours >= 0 && hours <= 23 && (minutes >= 0 && minutes <= 59)) {
      this.setState({ [nazwaPola]: false });
      return true;
    } else {
      if (hours && minutes) {
        // this.setState({ [nazwaPola]: true });
        // console.log("sa godizny i minuty");
      }
      return false;
    }
  };

  validateDuration = (start, stop) => {
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
      this.setState({ errorStop: true });
      return false;
    }
    return false;
  };

  validateKiedy = data => {
    const nalezy =
      this.state.datyDoRaportu.filter(x => x.name === data).length === 1
        ? true
        : false;
    const pelnaData = data.length === 10 ? true : false;

    if (pelnaData) {
      if (nalezy) {
        this.setState({ errorKiedy: false });
        return true;
      }
      this.setState({ errorKiedy: true });
      return false;
    }
    this.setState({ errorKiedy: false });
    return false;
  };

  sprawdzPola = () => {
    const { aktywnosc_id, miejsce_id, inna } = this.state;
    switch (aktywnosc_id) {
      case 1:
        return miejsce_id === "" ? false : true;
        break;
      case 5:
        return inna === "" ? false : true;
        break;
      default:
        return true;
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      start: start_prevState,
      stop: stop_prevState,
      aktywnosc_id: aktywnosc_id_prevState,
      miejsce_id: miejsce_id_prevState,
      inna: inna_prevState,
      uwagi: uwagi_prevState,
      dataWybrana: dataWybrana_prevState
    } = prevState;
    const {
      start,
      stop,
      aktywnosc_id,
      miejsce_id,
      inna,
      dataWybrana
    } = this.state;

    // if (dataWybrana_prevState !== dataWybrana) {
    //   this.fetchujDate(dataWybrana);
    // }

    if (start !== start_prevState || stop !== stop_prevState) {
      this.validateTime(start, "Start");
      this.validateTime(stop, "Stop");
      this.validateDuration(start, stop);
    }

    // if (kiedy !== kiedy_prevState) {
    //   this.validateKiedy(kiedy);
    // }

    if (aktywnosc_id !== aktywnosc_id_prevState && aktywnosc_id !== 1) {
      this.setState({
        miejsceLabel: "",
        miejsce_id: "",
        planer_klienci_id: ""
      });
    }

    if (aktywnosc_id !== aktywnosc_id_prevState && aktywnosc_id !== 5) {
      this.setState({ inna: "" });
    }

    // if (aktywnosc_id !== aktywnosc_id_prevState) {
    //   this.setState({ miejsce_id: "", inna: "" });
    // }

    if (
      (start !== start_prevState ||
        stop !== stop_prevState ||
        aktywnosc_id !== aktywnosc_id_prevState ||
        miejsce_id !== miejsce_id_prevState ||
        inna !== inna_prevState) &&
      // kiedy.length >= 10
      (this.validateTime(start, "Start") &&
        this.validateTime(stop, "Stop") &&
        this.validateDuration(start, stop) &&
        aktywnosc_id !== "" &&
        this.sprawdzPola())
    ) {
      this.setState({ submitIsDisable: false });
    } else if (
      (start !== start_prevState ||
        stop !== stop_prevState ||
        aktywnosc_id !== aktywnosc_id_prevState ||
        inna !== inna_prevState ||
        miejsce_id !== miejsce_id_prevState) &&
      // kiedy === ""
      (!this.validateTime(start, "Start") ||
        !this.validateTime(stop, "Stop") ||
        !this.validateDuration(start, stop) ||
        aktywnosc_id === "" ||
        !this.sprawdzPola())
    ) {
      this.setState({ submitIsDisable: true });
    } else {
      return;
    }
  }

  fetchujDate = data => {
    console.log(`/api/kiedy/akt/${data}`);
    axios.get(`/api/kiedy/akt/${data}`).then(result => {
      this.setState({ aktyDaty: result.data });
    });
  };

  fetchujAktywnosc = id => {
    axios.get(`/api/id/akt/${id}`).then(result => {
      console.log(result.data);
      const {
        kiedy,
        start,
        stop,
        aktywnosc_id,
        miejsce_id,
        inna,
        uwagi,
        gus_simc
      } = result.data;
      this.setState({
        kiedy,
        start: wezGodzine(start),
        stop: wezGodzine(stop),
        aktywnosc_id,
        miejsce_id,
        inna,
        uwagi,
        miejsceLabel: gus_simc ? gus_simc.nazwa : ""
        //edited: true
      });
    });
  };

  // componentWillReceiveProps(nextProps) {
  //   this.state.id !== nextProps.editedId && this.handleEdit(nextProps.editedId);
  // }

  czyWypelniony = () => {
    const {
      kiedy,
      start,
      stop,
      miejsce_id,
      aktywnosc_id,
      planer_klienci_id,
      uwagi,
      inna
    } = this.state;
    if (
      kiedy ||
      start ||
      stop ||
      miejsce_id ||
      aktywnosc_id ||
      uwagi ||
      inna ||
      planer_klienci_id
    ) {
      return true;
    } else {
      return false;
    }
  };

  clearForm = () => {
    console.log("clearform");
    this.setState({
      id: "",
      dataWybrana: "",
      miejsceLabel: "",
      klientLabel: "",
      aktyDaty: [],
      kiedy: "",
      start: "",
      stop: "",
      miejsce_id: "",
      planer_klienci_id: "",
      aktywnosc_id: "",
      uwagi: "",
      inna: "",
      edited: false,
      nawozy: "",
      nowyKlient: "",
      sprzedaz: "",
      zamowienie: "",
      zboza: ""
    });
    this.props.modal && this.props.closeModal();
    // this.props.clearForm;
  };

  renderSelect = select => {
    const none = { label: "Brak", value: "" };
    const doWyboru = select.map((elem, i) => ({
      label: elem.name,
      value: elem.id
    }));
    return doWyboru.sort(dynamicSort("label"));
  };

  handleEdit = id => {
    console.log("handluje edita");
    axios.get(`/api/id/planerRaporty/${id}`).then(result => {
      const {
        kiedy,
        start,
        stop,
        aktywnosc_id,
        miejsce_id,
        planer_klienci_id,
        inna,
        uwagi,
        nawozy,
        nowyKlient,
        sprzedaz,
        zamowienie,
        zboza,
        gus_simc,
        planer_klienci
      } = result.data;
      this.setState({
        kiedy,
        start: wezGodzine(start),
        stop: wezGodzine(stop),
        aktywnosc_id,
        miejsce_id,
        inna,
        uwagi,
        miejsceLabel: gus_simc ? gus_simc.nazwa : "",
        // categoryId: { label: category.name, value: category.id },
        // groupId: { label: group.name, value: group.id },
        edited: true,
        miejsce_id_temp: miejsce_id,
        planer_klienci_id,
        klientLabel: planer_klienci ? planer_klienci.nazwa : "",
        nawozy,
        nowyKlient,
        sprzedaz,
        zamowienie,
        zboza
      });
      this.fetchujDate(kiedy);
    });
  };

  onEdit = () => {
    console.log("on edit");
    const {
      kiedy,
      start,
      stop,
      aktywnosc_id,
      miejsce_id,
      planer_klienci_id,
      inna,
      uwagi,
      nawozy,
      nowyKlient,
      sprzedaz,
      zamowienie,
      zboza
    } = this.state;
    const url = `/api/planerRaporty/edit/${this.props.editedId}`;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        kiedy,
        start,
        stop,
        aktywnosc_id,
        miejsce_id: aktywnosc_id === 1 ? miejsce_id : "",
        planer_klienci_id,
        inna: aktywnosc_id === 5 ? inna : "",
        uwagi,
        nawozy,
        nowyKlient,
        sprzedaz,
        zamowienie,
        zboza
      })
    })
      .then(() => {
        // this.fetchCosts();
        this.props.expanded(dataToString(kiedy));
        this.props.fetchuj();
      })
      .then(() => {
        this.clearForm();
      });
  };

  handleSubmit = e => {
    console.log("handluej submita planery raporty");
    //const { user_id, clientId } = this.props.auth;
    e.preventDefault();
    const {
      kiedy,
      start,
      stop,
      aktywnosc_id,
      miejsce_id,
      planer_klienci_id,
      inna,
      uwagi,
      nawozy,
      nowyKlient,
      sprzedaz,
      zamowienie,
      zboza
    } = this.state;
    const url = "/api/planerRaporty";

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        kiedy,
        start,
        stop,
        aktywnosc_id,
        planer_klienci_id,
        miejsce_id: aktywnosc_id === 1 ? miejsce_id : "",
        inna: aktywnosc_id === 5 ? inna : "",
        uwagi,
        nawozy,
        nowyKlient,
        sprzedaz,
        zamowienie,
        zboza
      })
    })
      .then(resp => resp.json())
      // .then(data => this.props.changeRange(data))
      .then(data => {
        //this.fetchCosts();
        //console.log(data);
        this.props.expanded(dataToString(data.kiedy));
        this.props.fetchuj();
      })
      .then(() => {
        this.clearForm();
      });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSelect = ranges => {
    this.setState({
      ...ranges
    });
  };

  renderAktywnosci = () => {
    const { classes } = this.props;
    console.log(this.state);
    return this.state.aktyDaty.map(day => {
      const {
        id,
        kiedy,
        start,
        stop,
        aktywnosc_id,
        miejsce_id,
        inna,
        gus_simc,
        planer_akt_rodz
      } = day;
      // console.log(id);
      return (
        <Button
          key={id}
          onClick={
            () => this.fetchujAktywnosc(id)
            // this.setState({ open: true, kiedy: day.kiedy })
          }
          classes={{
            root: classes.root,
            label: classes.label,
            text: classes.text // class name, e.g. `classes-nesting-label-x`
          }}
        >
          {`${wezGodzine(start)} - ${wezGodzine(stop)} ${
            aktywnosc_id !== 5
              ? planer_akt_rodz.name.slice(0, 20)
              : inna.slice(0, 20)
          } ${gus_simc !== null ? gus_simc.nazwa.slice(0, 20) : ""}`}
        </Button>
      );
    });
  };

  chipClick = akcja => {
    console.log("on chipClick()");
    this.setState({ [akcja]: !this.state[akcja] });
  };

  render() {
    const { classes, modal } = this.props;
    const {
      nawozy,
      nowyKlient,
      sprzedaz,
      zamowienie,
      zboza,
      kiedy
    } = this.state;
    const pola = [
      { pole: "nawozy", nazwa: "Nawozy" },
      { pole: "nowyKlient", nazwa: "Nowy klient" },
      { pole: "sprzedaz", nazwa: "Sprzedaż" },
      { pole: "zamowienie", nazwa: "Zamówienie" },
      { pole: "zboza", nazwa: "Zboża" }
    ];

    return (
      <Paper style={{ padding: 20 }}>
        <form onSubmit={e => this.handleSubmit(e)}>
          <Grid container spacing={24}>
            <Grid item xs={3}>
              {modal ? (
                <p>{kiedy}</p>
              ) : (
                <InputSelectBaza
                  daty={datyDoRaportu => this.setState({ datyDoRaportu })}
                  error={this.state.errorKiedy}
                  miejsceLabel={this.state.miejsceLabel}
                  // miejsceLabel="lublin"
                  edytuj={kiedy => {
                    console.log("input select baza");
                    this.fetchujDate(kiedy);
                    this.setState({ kiedy });
                  }}
                  value={this.state.kiedy}
                  //cancelLabel={() => this.setState({ miejsceLabel: "" })}
                  label="Kiedy"
                  placeholder="Dzień"
                />
              )}
              <div className={classes.aktyDoRaportu}>
                {this.renderAktywnosci()}
              </div>
            </Grid>
            <Grid item xs={9}>
              <Grid container spacing={24}>
                <Grid item xs={6}>
                  <InputTime
                    label={
                      this.state.errorStart
                        ? "Wpisz poprawną godzinę"
                        : "Początek"
                    }
                    error={this.state.errorStart}
                    edytuj={start => this.setState({ start })}
                    value={this.state.start}
                  />
                  <InputWyborBaza
                    table="rodzajAktywnosci"
                    label="Aktywność"
                    edytuj={aktywnosc_id => this.setState({ aktywnosc_id })}
                    value={this.state.aktywnosc_id}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputTime
                    label={
                      this.state.errorStop ? "Wpisz poprawną godzinę" : "Koniec"
                    }
                    error={this.state.errorStop}
                    edytuj={stop => this.setState({ stop })}
                    value={this.state.stop}
                  />
                  {this.state.aktywnosc_id === 5 && (
                    <InputComponent
                      label="Inna"
                      type="text"
                      edytuj={inna => this.setState({ inna })}
                      value={this.state.inna}
                    />
                  )}
                </Grid>
              </Grid>
              {this.state.aktywnosc_id === 1 && (
                <div>
                  <CitySearch
                    // test={miejsce_id =>
                    //   this.setState({ miejsce_id_temp: miejsce_id })
                    // }
                    miejsceLabel={this.state.miejsceLabel}
                    edytuj={miejsce_id => this.setState({ miejsce_id })}
                    value={this.state.miejsce_id}
                    cancelLabel={() => this.setState({ miejsceLabel: "" })}
                    wybranoLabel={wybranoLabel =>
                      this.setState({ miejsceLabel: wybranoLabel })
                    }
                  />
                  <KlienciSearch
                    miejsceLabel={this.state.miejsceLabel}
                    klientLabel={this.state.klientLabel}
                    clearLabel={() => this.setState({ klientLabel: "" })}
                    // miejsceLabel="lublin"
                    edytuj={id => this.setState({ planer_klienci_id: id })}
                    value={this.state.planer_klienci_id}
                    //cancelLabel={() => this.setState({ miejsceLabel: "" })}
                    label="Klient"
                    placeholder="Zacznij wpisywać klienta"
                  />
                </div>
              )}
              {/* <InputTime label="Koniec" /> */}
              <InputComponent
                label="Uwagi"
                type="text"
                edytuj={uwagi => this.setState({ uwagi })}
                value={this.state.uwagi}
              />
              {this.state.aktywnosc_id === 1 && (
                <div className={classes.chipsContainer}>
                  {pola.map((pole, i) => {
                    const co = pole.pole;
                    const nazwa = pole.nazwa;
                    return (
                      <Button
                        key={i}
                        onClick={() => this.chipClick(co)}
                        variant="contained"
                        size="small"
                        className={classNames(
                          classes.buttonChip,
                          this.state[co]
                            ? classes.buttonChipYes
                            : classes.buttonChipNo
                        )}
                      >
                        {nazwa}
                        {this.state[co] ? <DoneIcon /> : <Cancel />}
                      </Button>
                    );
                  })}
                </div>
              )}
            </Grid>

            <div style={{ width: "100%", display: "block" }}>
              {!this.state.edited ? (
                <Button
                  disabled={this.state.submitIsDisable}
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Dodaj Raport
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
                  Edytuj raport
                  <Edit style={{ marginLeft: 10 }} />
                </Button>
              )}
              {this.czyWypelniony() && (
                <Button
                  variant="contained"
                  className={classes.button}
                  onClick={this.clearForm}
                >
                  Anuluj
                  <Cancel style={{ marginLeft: 10 }} />
                </Button>
              )}
            </div>
          </Grid>
        </form>
      </Paper>
    );
  }
}

PlanerRaportyForm.propTypes = {
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
  )(PlanerRaportyForm)
);

// export default withStyles(styles)(Costs);
