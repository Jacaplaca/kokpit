import React, { Component } from "react";

import { connect } from "react-redux";
import * as actions from "../actions";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import ButtonMy from "../common/ButtonMy";
import Send from "@material-ui/icons/Send";
import Edit from "@material-ui/icons/Edit";
import Cancel from "@material-ui/icons/Clear";
import InputWyborBaza from "../common/inputs/InputWyborBaza";
import InputSelectBaza from "../common/inputs/InputSelectBaza";
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
    miejsce_idText: "",
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
    isSubmitDisabled: true
  };

  componentWillMount() {
    axios.get(`/api/table/dniDoRaportu`).then(result => {
      const dniWyslane = result.data;
      this.setState({
        dniWyslane
      });
    });

    this.state.id !== this.props.editedId &&
      this.handleEdit(this.props.editedId);
  }

  validateKiedy = data => {
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

  sprawdzPola = () => {
    console.log("sprawdzam pola");
    const { aktywnosc_id, miejsce_id, inna } = this.state;
    switch (aktywnosc_id) {
      case 1:
        console.log("case aktyw");
        console.log(!miejsce_id ? false : true);
        return !miejsce_id ? false : true;
        break;
      case 5:
        console.log("case inna");
        return inna === "" ? false : true;
        break;
      default:
        console.log("case default");
        return true;
    }
  };

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
    this.setState(
      {
        id: "",
        //kiedy: "",
        start: "",
        stop: "",
        miejsce_id: null,
        aktywnosc_id: "",
        uwagi: "",
        inna: "",
        edited: false
      },
      () => this.canSubmit()
    );
    this.props.edytuj("");
    this.props.modal && this.props.closeModal();
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
    const doWyboru = select.map((elem, i) => ({
      label: elem.name,
      value: elem.id
    }));
    return doWyboru.sort(this.dynamicSort("label"));
  };

  handleEdit = id => {
    this.props.loading(true);
    axios
      .get(`/api/id/akt/${id}`)
      .then(result => {
        const {
          kiedy,
          start,
          stop,
          aktywnosc_id,
          miejsce_id,
          inna,
          uwagi,
          //gus_simc,
          miejsca
        } = result.data;
        this.setState(
          {
            start: wezGodzine(start),
            stop: wezGodzine(stop),
            aktywnosc_id,
            miejsce_id,
            inna,
            uwagi,
            miejsce_idText: miejsca ? miejsca.name : "",
            edited: true
          },
          () => this.canSubmit()
        );
        this.props.edytuj(kiedy);
      })
      .then(() => {
        this.canSubmit();
        this.props.loading(false);
      });
  };

  onEdit = async () => {
    this.props.submit(true);
    const { start, stop, aktywnosc_id, miejsce_id, inna, uwagi } = this.state;
    const { kiedy } = this.props;
    const url = `/api/akt/edit/${this.props.editedId}`;

    await fetch(url, {
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
    });
    // this.fetchCosts();
    await this.props.expanded(dataToString(kiedy));
    await this.props.fetchuj();
    await this.clearForm();
    await this.props.submit(false);
  };

  handleSubmit = async e => {
    this.props.submit(true);
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

    const result = await fetch(url, {
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
    });
    const data = await result.json();
    await this.props.expanded(dataToString(data.kiedy));
    await this.props.fetchuj();
    await this.clearForm();
    await this.props.submit(false);
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

  handleChange = async event => {
    const { name, value, type, text } = event.target;
    const label = `${name}Text`;

    if (name === "kiedy") {
      await this.props.edytuj(value);
      await this.canSubmit();
    } else {
      if (type === "inputSelectBaza" && typeof value === "string") {
        this.setState({ [name]: "", [label]: value }, () => {
          this.canSubmit();
        });
      } else if (type === "inputSelectBaza" && typeof value === "number") {
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
    const porownanie = [
      this.props.kiedy,
      this.state.start,
      this.state.stop,
      this.state.aktywnosc_id
    ];

    this.validateTime(this.state.start, "Start");
    this.validateTime(this.state.stop, "Stop");
    this.validateDuration(this.state.start, this.state.stop);
    //this.sprawdzPola();

    if (
      porownanie.every(x => x !== "") &&
      (this.validateKiedy(this.props.kiedy) &&
        this.validateTime(this.state.start, "Start") &&
        this.validateTime(this.state.stop, "Stop") &&
        this.validateDuration(this.state.start, this.state.stop) &&
        this.state.aktywnosc_id !== "" &&
        this.sprawdzPola())
    ) {
      console.log("warunek 1 otwieram");
      this.setState({ isSubmitDisabled: false });
    } else if (
      porownanie.some(x => x === "") &&
      (!this.validateKiedy(this.props.kiedy) ||
        !this.validateTime(this.state.start, "Start") ||
        !this.validateTime(this.state.stop, "Stop") ||
        !this.validateDuration(this.state.start, this.state.stop) ||
        this.state.aktywnosc_id === "" ||
        !this.sprawdzPola())
    ) {
      console.log("warunek zamykam");
      this.setState({ isSubmitDisabled: true });
    } else {
      console.log("return");
      this.setState({ isSubmitDisabled: true });
    }
  };

  render() {
    const { classes, modal, edytuj, kiedy, submitCheck } = this.props;

    const timesInputs = (label, bigVar, smallVar) => {
      const error = `error${bigVar}`;
      return (
        <InputComponent
          label={this.state[error] ? "Wpisz poprawną godzinę" : label}
          mask="99 : 99"
          error={this.state[error]}
          edytuj={this.handleChange}
          value={this.state[smallVar]}
          name={smallVar}
        />
      );
    };

    return (
      <Paper style={{ padding: 20 }}>
        <form onSubmit={e => this.handleSubmit(e)}>
          <Grid container spacing={24}>
            <Grid item xs={3}>
              <InputComponent
                disabled={modal ? true : false}
                label={
                  this.state.errorKiedy ? "Data wysłana do raportu" : "Kiedy"
                }
                error={this.state.errorKiedy}
                type="date"
                edytuj={this.handleChange}
                value={kiedy}
                name="kiedy"
              />

              {timesInputs("Początek", "Start", "start")}
              {timesInputs("Koniec", "Stop", "stop")}
            </Grid>
            <Grid item xs={9}>
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
                <InputSelectBaza
                  name="miejsce_id"
                  wybrano={this.handleChange}
                  value={this.state.miejsce_idText}
                  label="Miejscowość"
                  placeholder="Wpisz miejscowość..."
                  baza="city"
                  startAfter={2}
                />
              )}
              <InputComponent
                label="Uwagi"
                type="text"
                name="uwagi"
                edytuj={this.handleChange}
                value={this.state.uwagi}
              />
            </Grid>

            <div style={{ width: "100%", display: "block" }}>
              {!this.state.edited ? (
                <ButtonMy
                  type="submit"
                  disabled={this.state.isSubmitDisabled}
                  progress
                >
                  Zaplanuj aktywność
                  {!submitCheck && <Send style={{ marginLeft: 10 }} />}
                </ButtonMy>
              ) : (
                <ButtonMy
                  // type="submit"
                  disabled={this.state.isSubmitDisabled}
                  onClick={() => this.onEdit()}
                  progress
                >
                  Edytuj aktywność
                  {!submitCheck && <Edit style={{ marginLeft: 10 }} />}
                </ButtonMy>
              )}
              {this.czyWypelniony() && (
                <ButtonMy colorMy="gray" onClick={() => this.clearForm()}>
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

PlanerAktywnosciForm.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ submit: submitCheck }) {
  return { submitCheck };
}

// export default connect(mapStateToProps)(Header);

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    actions
  )(PlanerAktywnosciForm)
);

// export default withStyles(styles)(Costs);
