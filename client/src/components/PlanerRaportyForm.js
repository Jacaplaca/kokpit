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

import CitySearch from "./CitiesSearch";
import InputWyborBaza from "./InputWyborBaza";
import InputSelectBaza from "./InputSelectBaza";
import InputTime from "./InputTime";
import InputData from "./InputData";
import InputComponent from "./InputComponent";
import KlienciSearch from "./KlienciSearch";

import { wezGodzine, dynamicSort } from "../common/functions";

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
  }
  // text: {
  //   //padding: "0 1px",
  //   //borderColor: "red",
  //   height: 4
  // }
});

class PlanerAktywnosciForm extends Component {
  state = {
    id: "",
    datyUnikalne: [],
    dataWybrana: "",
    aktyDaty: [],

    kiedy: "",
    start: "",
    stop: "",
    miejsce_id: "",
    aktywnosc_id: "",
    klient_id: "",
    inna: "",
    uwagi: "",
    wyslano: "",

    miejsceLabel: "",

    errorStart: false,
    errorStop: false,

    activities: [],
    edited: false,
    submitIsDisable: true,

    miejsce_id_temp: ""
  };

  componentWillMount() {
    axios.get(`/api/table/dniDoRaportu`).then(result => {
      const datyUnikalne = result.data;
      this.setState({
        datyUnikalne
      });
      // console.log("form zostal zamountowany");
      // console.log(this.props.editedId);
      // console.log(this.props.modal);
      // this.state.id !== this.props.editedId &&
      //   this.handleEdit(this.props.editedId);
    });
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

  // errorTime = () => {
  //
  // }

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
      kiedy: kiedy_prevState,
      start: start_prevState,
      stop: stop_prevState,
      aktywnosc_id: aktywnosc_id_prevState,
      miejsce_id: miejsce_id_prevState,
      inna: inna_prevState,
      uwagi: uwagi_prevState,
      dataWybrana: dataWybrana_prevState
    } = prevState;
    const {
      kiedy,
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
      (kiedy !== "" &&
        this.validateTime(start, "Start") &&
        this.validateTime(stop, "Stop") &&
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
      (kiedy === "" ||
        !this.validateTime(start, "Start") ||
        !this.validateTime(stop, "Stop") ||
        aktywnosc_id === "" ||
        !this.sprawdzPola())
    ) {
      this.setState({ submitIsDisable: true });
    } else {
      return;
    }
  }

  fetchujDate = data => {
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
      uwagi,
      inna
    } = this.state;
    if (kiedy || start || stop || miejsce_id || aktywnosc_id || uwagi || inna) {
      return true;
    } else {
      return false;
    }
  };

  clearForm = () => {
    console.log("clearform");
    this.setState({
      id: "",
      kiedy: "",
      start: "",
      stop: "",
      miejsce_id: "",
      aktywnosc_id: "",
      uwagi: "",
      inna: "",
      edited: false
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
    axios.get(`/api/id/akt/${id}`).then(result => {
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
        miejsceLabel: gus_simc ? gus_simc.nazwa : "",
        // categoryId: { label: category.name, value: category.id },
        // groupId: { label: group.name, value: group.id },
        edited: true,
        miejsce_id_temp: miejsce_id
      });
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
      inna,
      uwagi
    } = this.state;
    const url = `/api/akt/edit/${this.props.editedId}`;

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
        inna: aktywnosc_id === 5 ? inna : "",
        uwagi
      })
    })
      .then(() => {
        // this.fetchCosts();
        this.props.fetchuj();
      })
      .then(() => {
        this.clearForm();
      });
  };

  handleSubmit = e => {
    const { user_id, clientId } = this.props.auth;
    e.preventDefault();
    const {
      kiedy,
      start,
      stop,
      aktywnosc_id,
      miejsce_id,
      inna,
      uwagi
    } = this.state;
    const url = "/api/aktywnosci";

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
        inna: aktywnosc_id === 5 ? inna : "",
        uwagi
      })
    })
      .then(resp => resp.json())
      // .then(data => this.props.changeRange(data))
      .then(() => {
        // this.fetchCosts();
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
      console.log(id);
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

  render() {
    const { classes } = this.props;

    return (
      <Paper style={{ padding: 20 }}>
        <form onSubmit={e => this.handleSubmit(e)}>
          <Grid container spacing={24}>
            <Grid item xs={3}>
              <InputSelectBaza
                array={this.state.datyUnikalne}
                zwracam="label"
                wybrano={dataWybrana => {
                  this.fetchujDate(dataWybrana);
                  this.setState({ kiedy: dataWybrana });
                }}
              />
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
                    // miejsceLabel="lublin"
                    edytuj={id => this.setState({ klient_id: id })}
                    //value={this.state.miejsce_id}
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
            </div>
          </Grid>
        </form>
      </Paper>
    );
  }
}

PlanerAktywnosciForm.propTypes = {
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
  )(PlanerAktywnosciForm)
);

// export default withStyles(styles)(Costs);
