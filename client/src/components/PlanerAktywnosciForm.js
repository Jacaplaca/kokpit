import React, { Component } from "react";

import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Send from "@material-ui/icons/Send";
import Edit from "@material-ui/icons/Edit";
import Cancel from "@material-ui/icons/Clear";

import CitySearch from "./CitiesSearch";

import InputWyborBaza from "../common/inputs/InputWyborBaza";
import InputTime from "../common/inputs/InputTime";
import InputData from "../common/inputs/InputData";
import InputComponent from "../common/inputs/InputComponent";

import { wezGodzine, dataToString } from "../common/functions";

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
  }
});

class PlanerAktywnosciForm extends Component {
  state = {
    id: "",

    kiedy: "",
    start: "",
    stop: "",
    miejsce_id: null,
    aktywnosc_id: "",
    inna: "",
    uwagi: "",
    wyslano: "",

    miejsceLabel: "",

    errorStart: false,
    errorStop: false,
    errorKiedy: false,
    //errorTimeMessage: "",

    dniWyslane: [],
    activities: [],
    edited: false,
    submitIsDisable: true,

    miejsce_id_temp: ""
  };

  componentWillMount() {
    console.log("form zostal zamountowany");
    axios.get(`/api/table/dniDoRaportu`).then(result => {
      const dniWyslane = result.data;
      this.setState({
        //isLoading: false,
        dniWyslane
      });
    });
    console.log(this.props.editedId);
    console.log(this.props.modal);
    this.state.id !== this.props.editedId &&
      this.handleEdit(this.props.editedId);
    // this.props.modal && (
    //
    // )
  }

  validateKiedy = data => {
    console.log(this.state.dniWyslane);
    console.log(data);
    const nalezy =
      this.state.dniWyslane.filter(x => x.name === data).length === 1
        ? false
        : true;
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

  validateTime = (time, pole) => {
    const nazwaPola = `error${pole}`;
    const hours = Math.trunc(time.split(":")[0]);
    const minutes = Math.trunc(time.split(":")[1]);
    if (hours < 0 || hours > 23 || (minutes < 0 || minutes > 59)) {
      this.setState({ [nazwaPola]: true });
    }
    if (hours >= 0 && hours <= 23 && (minutes >= 0 && minutes <= 59)) {
      this.setState({ [nazwaPola]: false });
      return true;
    } else {
      if (hours && minutes) {
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

  // errorTime = () => {
  //
  // }

  sprawdzPola = () => {
    const { aktywnosc_id, miejsce_id, inna } = this.state;
    switch (aktywnosc_id) {
      case 1:
        return !miejsce_id ? false : true;
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
      // kiedy: kiedy_prevState,
      start: start_prevState,
      stop: stop_prevState,
      aktywnosc_id: aktywnosc_id_prevState,
      miejsce_id: miejsce_id_prevState,
      inna: inna_prevState,
      uwagi: uwagi_prevState
    } = prevState;
    const { kiedy: kiedy_prevState } = prevProps;
    const { start, stop, aktywnosc_id, miejsce_id, inna } = this.state;
    const { kiedy } = this.props;

    if (start !== start_prevState || stop !== stop_prevState) {
      this.validateTime(start, "Start");
      this.validateTime(stop, "Stop");
      this.validateDuration(start, stop);
    }
    if (kiedy !== kiedy_prevState) {
      this.validateKiedy(kiedy);
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

  // componentWillReceiveProps(nextProps) {
  //   this.state.id !== nextProps.editedId && this.handleEdit(nextProps.editedId);
  // }

  czyWypelniony = () => {
    const { start, stop, miejsce_id, aktywnosc_id, uwagi, inna } = this.state;
    const { kiedy } = this.props;
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
      //kiedy: "",
      start: "",
      stop: "",
      miejsce_id: null,
      aktywnosc_id: "",
      uwagi: "",
      inna: "",
      edited: false
    });
    this.props.edytuj("");
    this.props.modal && this.props.closeModal();
    // this.props.clearForm;
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
        //kiedy,
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
      this.props.edytuj(kiedy);
    });
  };

  onEdit = () => {
    console.log("on edit");
    const {
      //kiedy,
      start,
      stop,
      aktywnosc_id,
      miejsce_id,
      inna,
      uwagi
    } = this.state;
    const { kiedy } = this.props;
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
        miejsce_id: aktywnosc_id === 1 ? miejsce_id : null,
        inna: aktywnosc_id === 5 ? inna : "",
        uwagi
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
    const { user_id, clientId } = this.props.auth;
    e.preventDefault();
    const {
      //kiedy,
      start,
      stop,
      aktywnosc_id,
      miejsce_id,
      inna,
      uwagi
    } = this.state;
    const { kiedy } = this.props;
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
        miejsce_id: aktywnosc_id === 1 ? miejsce_id : null,
        inna: aktywnosc_id === 5 ? inna : "",
        uwagi
      })
    })
      .then(resp => resp.json())
      // .then(data => this.props.changeRange(data))
      .then(data => {
        this.props.expanded(dataToString(data.kiedy));
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

  handleChangeKwota = name => event => {
    this.setState({
      [name]: event.target.value
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

  render() {
    const { classes, modal, edytuj, kiedy } = this.props;

    return (
      <Paper style={{ padding: 20 }}>
        <form onSubmit={e => this.handleSubmit(e)}>
          <Grid container spacing={24}>
            <Grid item xs={3}>
              <InputData
                disabled={modal ? true : false}
                label={
                  this.state.errorKiedy ? "Data wysłana do raportu" : "Kiedy"
                }
                error={this.state.errorKiedy}
                //label="Kiedy"
                type="date"
                //edytuj={kiedy => this.setState({ kiedy })}
                edytuj={kiedy => edytuj(kiedy)}
                value={kiedy}
                //value={this.state.kiedy}
              />
              <InputTime
                label={
                  this.state.errorStart ? "Wpisz poprawną godzinę" : "Początek"
                }
                error={this.state.errorStart}
                edytuj={start => this.setState({ start })}
                value={this.state.start}
              />
              <InputTime
                label={
                  this.state.errorStop ? "Wpisz poprawną godzinę" : "Koniec"
                }
                error={this.state.errorStop}
                edytuj={stop => this.setState({ stop })}
                value={this.state.stop}
              />
              {/* <InputComponent label="Uwagi" type="text" /> */}
              {/* <InputComponent label="Uwagi" type="text" /> */}
            </Grid>
            <Grid item xs={9}>
              <Grid container spacing={24}>
                <Grid item xs={6}>
                  <InputWyborBaza
                    table="rodzajAktywnosci"
                    label="Aktywność"
                    edytuj={aktywnosc_id => this.setState({ aktywnosc_id })}
                    value={this.state.aktywnosc_id}
                  />
                </Grid>
                <Grid item xs={6}>
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
                <CitySearch
                  test={miejsce_id =>
                    this.setState({ miejsce_id_temp: miejsce_id })
                  }
                  miejsceLabel={this.state.miejsceLabel}
                  edytuj={miejsce_id => this.setState({ miejsce_id })}
                  value={this.state.miejsce_id}
                  cancelLabel={() => this.setState({ miejsceLabel: "" })}
                  wybranoLabel={wybranoLabel =>
                    this.setState({ miejsceLabel: wybranoLabel })
                  }
                />
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
                  Zaplanuj aktywność
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
                  Edytuj aktywność
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
