import React, { Component } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { connect } from "react-redux";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import classNames from "classnames";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ButtonMy from "../common/ButtonMy";
import Send from "@material-ui/icons/Send";
import Edit from "@material-ui/icons/Edit";
import Cancel from "@material-ui/icons/Clear";

import * as actions from "../actions";
import DoneIcon from "@material-ui/icons/Done";

import CitySearch from "./CitiesSearch";
import InputWyborBaza from "../common/inputs/InputWyborBaza";
import InputSelectBaza from "../common/inputs/InputSelectBaza";
import InputTime from "../common/inputs/InputTime";
import InputData from "../common/inputs/InputData";
import InputComponent from "../common/inputs/InputComponent";

import KlienciSearch from "./KlienciSearch";

import {
  wezGodzine,
  dynamicSort,
  dataToString,
  shortPlace
} from "../common/functions";

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
    miejsceLabel_temp: "",

    datesToReport: [],
    customer: { id: 0, name: "", kod: "", miejscowosc: "" },
    rodo: { short: "rodo", tick: false }
  };

  componentWillMount() {
    if (!this.props.addToDay) {
      this.state.id !== this.props.editedId &&
        this.handleEdit(this.props.editedId);
      this.fetchDatesToReport();
      this.props.fetchCustomersWithDetails();
    }
  }

  fetchDatesToReport = () => {
    axios.get(`/api/table/dniDoRaportu`).then(result => {
      this.setState({ datesToReport: result.data });
    });
  };

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

  // //dla daty pobieranych z zaplanowanych aktywnosci
  //   validateKiedy = data => {
  //     //return this.props.modal && true;
  //     if (this.props.modal) {
  //       return true;
  //     }
  //     const nalezy =
  //       this.state.datesToReport.filter(x => x.name === data).length === 1
  //         ? true
  //         : false;
  //     const pelnaData = data.length === 10 ? true : false;
  //     console.log(nalezy, data, data.length, pelnaData);
  //
  //     if (pelnaData) {
  //       if (nalezy) {
  //         this.setState({ errorKiedy: false });
  //         return true;
  //       }
  //       this.setState({ errorKiedy: true });
  //       return false;
  //     }
  //     this.setState({ errorKiedy: false });
  //     return false;
  //   };
  validateKiedy = data => {
    return true;
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
      //kiedy: kiedy_prevState,
      start: start_prevState,
      stop: stop_prevState,
      aktywnosc_id: aktywnosc_id_prevState,
      miejsce_id: miejsce_id_prevState,
      inna: inna_prevState
      //uwagi: uwagi_prevState,
      //dataWybrana: dataWybrana_prevState
    } = prevState;
    const { kiedy: kiedy_prevState } = prevProps;
    const {
      //kiedy,
      start,
      stop,
      aktywnosc_id,
      miejsce_id,
      inna
      //dataWybrana
    } = this.state;
    const { kiedy } = this.props;

    // if (dataWybrana_prevState !== dataWybrana) {
    //   this.fetchujDate(dataWybrana);
    // }

    if (start !== start_prevState || stop !== stop_prevState) {
      this.validateTime(start, "Start");
      this.validateTime(stop, "Stop");
      this.validateDuration(start, stop);
    }

    if (kiedy !== kiedy_prevState) {
      this.validateKiedy(kiedy);
    }

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
      (kiedy !== kiedy_prevState ||
        start !== start_prevState ||
        stop !== stop_prevState ||
        aktywnosc_id !== aktywnosc_id_prevState ||
        miejsce_id !== miejsce_id_prevState ||
        inna !== inna_prevState) &&
      // kiedy.length >= 10
      (this.validateKiedy(kiedy) &&
        this.validateTime(start, "Start") &&
        this.validateTime(stop, "Stop") &&
        this.validateDuration(start, stop) &&
        aktywnosc_id !== "" &&
        this.sprawdzPola())
    ) {
      this.setState({ submitIsDisable: false });
    } else if (
      (kiedy !== kiedy_prevState ||
        start !== start_prevState ||
        stop !== stop_prevState ||
        aktywnosc_id !== aktywnosc_id_prevState ||
        inna !== inna_prevState ||
        miejsce_id !== miejsce_id_prevState) &&
      // kiedy === ""
      (!this.validateKiedy(kiedy) ||
        !this.validateTime(start, "Start") ||
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

  fetchujDate = async data => {
    this.props.loading(true);
    const result = await axios.get(`/api/kiedy/akt/${data}`);
    await this.setState({ aktyDaty: result.data });
    await this.props.loading(false);
  };

  fetchujAktywnosc = id => {
    this.props.loading(true);
    axios.get(`/api/id/akt/${id}`).then(result => {
      //console.log(result.data);
      const {
        //kiedy,
        start,
        stop,
        aktywnosc_id,
        miejsce_id,
        inna,
        uwagi,
        //gus_simc,
        place
      } = result.data;
      const { kiedy } = this.props;
      this.setState({
        start: wezGodzine(start),
        stop: wezGodzine(stop),
        aktywnosc_id,
        miejsce_id,
        inna,
        uwagi,
        miejsceLabel: place ? place.name : ""
        //edited: true
      });
      this.props.edytuj(kiedy);
      this.props.loading(false);
    });
  };

  // componentWillReceiveProps(nextProps) {
  //   this.state.id !== nextProps.editedId && this.handleEdit(nextProps.editedId);
  // }

  czyWypelniony = () => {
    const {
      //kiedy,
      start,
      stop,
      miejsce_id,
      aktywnosc_id,
      planer_klienci_id,
      uwagi,
      inna
    } = this.state;
    const { kiedy } = this.props;
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
      //kiedy: "",
      start: "",
      stop: "",
      miejsce_id: "",
      planer_klienci_id: "",
      aktywnosc_id: "",
      uwagi: "",
      inna: "",
      edited: false,
      nawozy: false,
      nowyKlient: false,
      sprzedaz: false,
      zamowienie: false,
      zboza: false,
      customer: { id: 0, name: "", kod: "", miejscowosc: "" }
    });
    this.props.edytuj("");
    this.props.modal && this.props.closeModal();
    // this.props.clearForm;
  };

  renderSelect = select => {
    //const none = { label: "Brak", value: "" };
    const doWyboru = select.map((elem, i) => ({
      label: elem.name,
      value: elem.id
    }));
    return doWyboru.sort(dynamicSort("label"));
  };

  handleEdit = id => {
    this.props.loading(true);
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
        //gus_simc,
        miejsca,
        planer_klienci
      } = result.data;
      console.log(
        "handleedit",
        result.data
        // CustomerFlag.filter(x => x.flags_customers.flag_id === 1)
      );
      this.props.edytuj(kiedy);
      this.setState({
        //kiedy,
        start: wezGodzine(start),
        stop: wezGodzine(stop),
        aktywnosc_id,
        miejsce_id,
        inna,
        uwagi,
        //miejsceLabel: gus_simc ? gus_simc.nazwa : "",
        miejsceLabel: miejsca ? miejsca.name : "",
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
        zboza,
        customer: {
          id: planer_klienci_id,
          name: planer_klienci ? planer_klienci.name : "",
          kod: planer_klienci ? planer_klienci.adr_Kod : "",
          miejscowosc: planer_klienci ? planer_klienci.adr_Miejscowosc : ""
        },
        rodo: this.checkRodo(planer_klienci ? planer_klienci.CustomerFlag : [])
      });
      this.fetchujDate(kiedy);
      this.props.loading(false);
    });
  };

  onEdit = () => {
    this.props.submit(true);
    const {
      //kiedy,
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
      customer,
      rodo
    } = this.state;
    const { kiedy } = this.props;
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
        planer_klienci_id: customer.id,
        inna: aktywnosc_id === 5 ? inna : "",
        uwagi,
        nawozy,
        nowyKlient,
        sprzedaz,
        zamowienie,
        zboza,
        rodo
      })
    })
      .then(() => {
        // this.fetchCosts();
        this.props.expanded(dataToString(kiedy));
        this.props.fetchuj();
      })
      .then(() => {
        this.clearForm();
        this.props.submit(false);
      });
  };

  handleSubmit = e => {
    this.props.submit(true);
    //const { user_id, clientId } = this.props.auth;
    e.preventDefault();
    const {
      //kiedy,
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
      customer,
      rodo
    } = this.state;
    const { kiedy } = this.props;
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
        planer_klienci_id: customer.id,
        miejsce_id: aktywnosc_id === 1 ? miejsce_id : "",
        inna: aktywnosc_id === 5 ? inna : "",
        uwagi,
        nawozy,
        nowyKlient,
        sprzedaz,
        zamowienie,
        zboza,
        rodo
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
        this.props.submit(false);
      });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeCustomer = (field, value, flags) => {
    this.setState({ [field]: value, rodo: this.checkRodo(flags) });
  };

  checkRodo = (flags = []) => {
    const rodo = flags.filter(x => x.short === "rodo");
    console.log("flags", flags);
    return rodo.length > 0
      ? { short: "rodo", tick: true }
      : { short: "rodo", tick: false };
  };

  handleSelect = ranges => {
    this.setState({
      ...ranges
    });
  };

  renderAktywnosci = () => {
    const { classes } = this.props;
    // console.log(this.state);
    return this.state.aktyDaty.map(day => {
      const {
        id,
        //kiedy,
        start,
        stop,
        aktywnosc_id,
        //miejsce_id,
        inna,
        //gus_simc,
        place,
        planer_akt_rodz
      } = day;
      // console.log(day);
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
            // } ${gus_simc !== null ? gus_simc.nazwa.slice(0, 20) : ""}`}
          } ${place !== null ? shortPlace(place.name) : ""}`}
        </Button>
      );
    });
  };

  chipClick = akcja => {
    console.log("on chipClick()");
    this.setState({ [akcja]: !this.state[akcja] });
  };

  clearCustomer = () => {
    this.setState({
      customer: { id: 0, name: "", kod: "", miejscowosc: "" },
      rodo: { short: "rodo", tick: false }
    });
  };

  handleClick = event => {
    console.log("PlanerRaportyForm() click", event);
    this.setState({ rodo: { short: "rodo", tick: !this.state.rodo.tick } });
  };

  render() {
    const {
      classes,
      modal,
      edytuj,
      kiedy,
      submitCheck,
      custWithDets
    } = this.props;
    const { datesToReport, customer, miejsceLabel, rodo } = this.state;
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
                <InputData
                  disabled={modal ? true : false}
                  label="Kiedy"
                  error={this.state.errorKiedy}
                  //label="Kiedy"
                  type="date"
                  //edytuj={kiedy => this.setState({ kiedy })}
                  edytuj={kiedy => edytuj(kiedy)}
                  value={kiedy}
                  max={dataToString(new Date())}
                  //value={this.state.kiedy}
                />

                // <InputSelectBaza
                //   daty={datyDoRaportu => this.setState({ datyDoRaportu })}
                //   error={this.state.errorKiedy}
                //   miejsceLabel={miejsceLabel}
                //   // miejsceLabel="lublin"
                //   // edytujValue={kiedy => {
                //   //   this.setState({ kiedy });
                //   //   this.fetchujDate(kiedy);
                //   // }}
                //   wybrano={wybrano => {
                //     wybrano && this.fetchujDate(wybrano.name);
                //     // this.setState({})
                //   }}
                //   // edytuj={kiedy => {
                //   //   this.setState({ kiedy });
                //   // }}
                //   edytuj={kiedy => {
                //     edytuj(kiedy);
                //   }}
                //   //czysc={() => this.setState({ kiedy: "" })}
                //   czysc={() => edytuj("")}
                //   //value={this.state.kiedy}
                //   value={kiedy}
                //   //cancelLabel={() => this.setState({ miejsceLabel: "" })}
                //   label="Kiedy"
                //   placeholder="Dzień"
                //   przeszukuje={datesToReport}
                //   reverse
                // />
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
                    // edytuj={kiedy => edytuj(kiedy)}
                    // value={kiedy}
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
                    miejsceLabel={miejsceLabel}
                    edytuj={miejsce_id => this.setState({ miejsce_id })}
                    value={this.state.miejsce_id}
                    cancelLabel={() => this.setState({ miejsceLabel: "" })}
                    wybranoLabel={wybranoLabel =>
                      this.setState({ miejsceLabel: wybranoLabel })
                    }
                    label="Kod lub miejscowość"
                    places
                  />
                  <Grid container spacing={24}>
                    <Grid item xs={8}>
                      <KlienciSearch
                        flags={custWithDets}
                        //miejsceLabel={this.state.miejsceLabel.slice(0, 6)}
                        miejsceLabel={
                          miejsceLabel ? miejsceLabel.split(" ")[1] : ""
                        }
                        klientLabel={""}
                        clearLabel={this.clearCustomer}
                        // miejsceLabel="lublin"
                        edytuj={(id, name, kod, miejscowosc, flags) =>
                          this.handleChangeCustomer(
                            "customer",
                            {
                              id,
                              name,
                              kod,
                              miejscowosc
                            },
                            flags
                          )
                        }
                        value={customer.id}
                        //cancelLabel={() => this.setState({ miejsceLabel: "" })}
                        label="Klient"
                        placeholder="Zacznij wpisywać klienta"
                      />
                    </Grid>
                    {customer.id > 0 && (
                      <Grid item xs={4}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={rodo.tick}
                              onChange={event => this.handleClick(event)}
                              value="rodo"
                            />
                          }
                          label="Zgody RODO?"
                          labelPlacement="start"
                        />
                      </Grid>
                    )}
                  </Grid>
                </div>
              )}
              {/* <InputTime label="Koniec" /> */}
              {/* <Grid item xs={6}> */}
              <InputComponent
                label="Uwagi"
                type="text"
                edytuj={uwagi => this.setState({ uwagi })}
                value={this.state.uwagi}
              />
              {/* </Grid>
              <Grid item xs={6}>
                <Checkbox
                  checked={false}
                  onClick={event => this.handleClick(event)}
                />
              </Grid> */}
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
                <ButtonMy
                  disabled={this.state.submitIsDisable}
                  type="submit"
                  progress
                >
                  Dodaj Raport
                  {!submitCheck && <Send style={{ marginLeft: 10 }} />}
                </ButtonMy>
              ) : (
                <ButtonMy
                  // type="submit"
                  disabled={this.state.submitIsDisable}
                  onClick={() => this.onEdit()}
                  progress
                >
                  Edytuj raport
                  {!submitCheck && <Edit style={{ marginLeft: 10 }} />}
                </ButtonMy>
              )}
              {this.czyWypelniony() && (
                <ButtonMy onClick={this.clearForm} colorMy="gray">
                  Anuluj
                  <Cancel style={{ marginLeft: 10 }} />
                </ButtonMy>
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

function mapStateToProps({
  submit: submitCheck,
  customersWithDetails: custWithDets
}) {
  return { submitCheck, custWithDets };
}

// export default connect(mapStateToProps)(Header);

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    actions
  )(PlanerRaportyForm)
);

// export default withStyles(styles)(Costs);
