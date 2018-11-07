import React, { Component } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { connect } from "react-redux";
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

import { clientSuggestion } from "../common/inputs/Suggestions";

import InputWyborBaza from "../common/inputs/InputWyborBaza";
import InputSelectBaza from "../common/inputs/InputSelectBaza";
import InputComponent from "../common/inputs/InputComponent";

import {
  wezGodzine,
  dataToString,
  shortPlace,
  validateTime,
  validateDuration,
  validateKiedy,
  sprawdzPola,
  keyFunction
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

    kiedy: "",

    kiedyId: "",
    kiedyIdText: "",

    start: "",
    stop: "",
    miejsce_id: "",
    miejsce_idText: "",
    aktywnosc_id: "",
    planer_klienci_id: "",
    planer_klienci_idText: "",
    inna: "",
    uwagi: "",
    wyslano: "",

    nawozy: false,
    nowyKlient: false,
    sprzedaz: false,
    zamowienie: false,
    zboza: false,

    klientLabel: "",

    errorStart: false,
    errorStop: false,
    errorKiedy: false,

    activities: [],
    edited: false,
    isSubmitDisabled: true,

    offset: 0
  };

  componentWillMount() {
    // this.fetchSentDate();
    this.state.id !== this.props.editedId &&
      this.handleEdit(this.props.editedId);
  }

  componentDidMount = () => {
    document.addEventListener("keydown", keyFunction, false);
  };

  componentWillUnmount() {
    document.removeEventListener("keydown", keyFunction, false);
  }

  // keyFunction = event => {
  //   console.log(event);
  // };

  fetchujDate = async data => {
    if (data.length === 10) {
      const result = await axios.get(`/api/kiedy/akt/${data}`);
      await this.setState({ aktyDaty: result.data });
    }
  };

  fetchujAktywnosc = id => {
    this.props.loading(true);
    axios.get(`/api/id/akt/${id}`).then(result => {
      const {
        start,
        stop,
        aktywnosc_id,
        miejsce_id,
        inna,
        uwagi,
        miejsca
      } = result.data;
      const { kiedy } = this.props;
      this.setState(
        {
          start: wezGodzine(start),
          stop: wezGodzine(stop),
          aktywnosc_id,
          miejsce_id,
          inna,
          uwagi,
          miejsce_idText: miejsca ? miejsca.name : "",
          planer_klienci_idText: miejsca ? miejsca.name.split(" ")[1] : ""
        },
        () => {
          this.canSubmit();
          this.props.edytuj(kiedy);
          this.props.loading(false);
          //miejsca && this.fetchDB(miejsca.name.split(" ")[1], "miejsce");
        }
      );
    });
  };

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
    this.setState(
      {
        id: "",
        dataWybrana: "",
        miejsce_idText: "",
        planer_klienci_idText: "",
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
        zboza: false
      },
      () => {
        this.canSubmit();
        this.props.edytuj("");
        this.props.modal && this.props.closeModal();
      }
    );
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
      this.props.edytuj(kiedy);
      this.setState(
        {
          //kiedy,
          start: wezGodzine(start),
          stop: wezGodzine(stop),
          aktywnosc_id,
          miejsce_id,
          inna,
          uwagi,
          //miejsceLabel: gus_simc ? gus_simc.nazwa : "",
          miejsce_idText: miejsca ? miejsca.name : "",
          // categoryId: { label: category.name, value: category.id },
          // groupId: { label: group.name, value: group.id },
          edited: true,
          miejsce_id_temp: miejsce_id,
          planer_klienci_id,
          //klientLabel: planer_klienci ? planer_klienci.nazwa : "",
          planer_klienci_idText: planer_klienci ? planer_klienci.name : "",
          nawozy,
          nowyKlient,
          sprzedaz,
          zamowienie,
          zboza
        },
        () => {
          this.canSubmit();
          this.fetchujDate(kiedy);
          this.props.loading(false);
        }
      );
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
      zboza
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
      zboza
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
        this.props.submit(false);
      });
  };

  renderAktywnosci = () => {
    const { classes } = this.props;
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
        miejsca,
        planer_akt_rodz
      } = day;
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
          } ${miejsca !== null ? shortPlace(miejsca.name) : ""}`}
        </Button>
      );
    });
  };

  chipClick = akcja => {
    console.log("on chipClick()");
    this.setState({ [akcja]: !this.state[akcja] });
  };

  handleChange = async event => {
    const { name, value, type, text } = event.target;
    const label = `${name}Text`;

    //console.log(`${name}, ${value}, ${type}, ${text}`);

    if (name === "kiedy") {
      console.log("name kiedy");
      await this.props.edytuj(text);
      await this.canSubmit();
      await this.fetchujDate(text);
    } else {
      if (type === "inputSelectBaza" && typeof value === "string") {
        this.setState({ [name]: "", [label]: value }, () => {
          this.canSubmit();
        });
      } else if (type === "inputSelectBaza" && typeof value === "number") {
        name === "miejsce_id" &&
          this.setState({ planer_klienci_idText: text.split(" ")[1] });
        this.setState({ [name]: value, [label]: text }, () => {
          this.canSubmit();
        });
      } else {
        this.setState({ [name]: value }, () => {
          this.canSubmit();
        });
      }
    }
  };

  canSubmit = () => {
    const { start, stop, aktywnosc_id, miejsce_id, inna } = this.state;
    const { kiedy, sentDays } = this.props;
    const goodTime = validateKiedy(kiedy, sentDays, true);
    const goodStart = validateTime(start, "Start");
    const goodStop = validateTime(stop, "Stop");
    const goodDuration = validateDuration(start, stop);
    const goodFields = sprawdzPola(aktywnosc_id, miejsce_id, inna);

    if (
      goodTime &&
      goodStart &&
      goodStop &&
      goodDuration &&
      aktywnosc_id !== "" &&
      goodFields
    ) {
      this.setState({ isSubmitDisabled: false });
    } else {
      this.setState({ isSubmitDisabled: true });
    }
  };

  render() {
    const { classes, modal, edytuj, kiedy, submitCheck } = this.props;
    const pola = [
      { pole: "nawozy", nazwa: "Nawozy" },
      { pole: "nowyKlient", nazwa: "Nowy klient" },
      { pole: "sprzedaz", nazwa: "Sprzedaż" },
      { pole: "zamowienie", nazwa: "Zamówienie" },
      { pole: "zboza", nazwa: "Zboża" }
    ];
    const timesInputs = (label, bigVar, smallVar) => {
      const error = `error${bigVar}`;
      return (
        <InputComponent
          label={this.props[error] ? "Wpisz poprawną godzinę" : label}
          mask="99 : 99"
          error={this.props[error]}
          edytuj={this.handleChange}
          value={this.state[smallVar]}
          name={smallVar}
        />
      );
    };

    return (
      <Paper style={{ padding: 20 }}>
        <form onSubmit={e => this.handleSubmit(e)} id="mainForm">
          <Grid container spacing={24}>
            <Grid item xs={3}>
              {/* <div ref={this.suggestionsRef}>asdfasdfa</div> */}
              {modal ? (
                <p>{kiedy}</p>
              ) : (
                <InputSelectBaza
                  object={this.props.sentDays}
                  error={this.props.errorKiedy}
                  wybrano={this.handleChange}
                  value={this.props.kiedy}
                  name="kiedy"
                  label="Kiedy"
                  placeholder="Dzień"
                  //baza="dniDoRaportu"
                  reverse
                />
              )}
              <div className={classes.aktyDoRaportu}>
                {this.renderAktywnosci()}
              </div>
            </Grid>
            <Grid item xs={9}>
              <Grid container spacing={24}>
                <Grid item xs={6}>
                  {timesInputs("Początek", "Start", "start")}
                </Grid>
                <Grid item xs={6}>
                  {timesInputs("Koniec", "Stop", "stop")}
                </Grid>
              </Grid>
              <Grid container spacing={24}>
                <Grid item xs={6}>
                  <InputWyborBaza
                    table="rodzajAktywnosci"
                    label="Aktywność"
                    edytuj={this.handleChange}
                    name="aktywnosc_id"
                    value={this.state.aktywnosc_id}
                  />
                </Grid>
                <Grid item xs={6}>
                  {this.state.aktywnosc_id === 5 && (
                    <InputComponent
                      label="Inna"
                      type="text"
                      name="inna"
                      edytuj={this.handleChange}
                      value={this.state.inna}
                    />
                  )}
                </Grid>
              </Grid>
              {this.state.aktywnosc_id === 1 && (
                <div>
                  <InputSelectBaza
                    name="miejsce_id"
                    wybrano={this.handleChange}
                    value={this.state.miejsce_idText}
                    label="Miejscowość"
                    placeholder="Wpisz miejscowość..."
                    startAfter={3}
                    limit={30}
                  />
                  <InputSelectBaza
                    name="planer_klienci_id"
                    wybrano={this.handleChange}
                    value={this.state.planer_klienci_idText}
                    label="Klient"
                    placeholder="Zacznij wpisywać klienta..."
                    startAfter={1}
                    suggestion={clientSuggestion}
                    names={["name", "adr_Kod", "adr_Miejscowosc"]}
                    limit={30}
                  />
                </div>
              )}
              {/* <InputTime label="Koniec" /> */}
              <InputComponent
                label="Uwagi"
                type="text"
                name="uwagi"
                edytuj={this.handleChange}
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
                <ButtonMy
                  id="submit"
                  disabled={this.state.isSubmitDisabled}
                  type="submit"
                  progress
                >
                  Dodaj Raport
                  {!submitCheck && <Send style={{ marginLeft: 10 }} />}
                </ButtonMy>
              ) : (
                <ButtonMy
                  // type="submit"
                  disabled={this.state.isSubmitDisabled}
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
  errorStopAction: errorStop,
  errorStartAction: errorStart,
  errorKiedyAction: errorKiedy,
  sentDays
}) {
  return { submitCheck, errorStop, errorStart, errorKiedy, sentDays };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    actions
  )(PlanerRaportyForm)
);
