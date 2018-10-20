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
import {
  wezGodzine,
  dataToString,
  validateTime,
  validateDuration,
  validateKiedy,
  sprawdzPola
} from "../common/functions";

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
    // dniWyslane: [],
    miejsceLabel: "",
    activities: [],
    edited: false,
    isSubmitDisabled: true
  };

  componentWillMount() {
    // this.fetchSentDate();
    this.state.id !== this.props.editedId &&
      this.handleEdit(this.props.editedId);
  }

  componentDidUpdate(prevProps) {
    prevProps.sentDays !== this.props.sentDays && this.canSubmit();
  }

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
    const { start, stop, aktywnosc_id, miejsce_id, inna } = this.state;
    const { kiedy, sentDays } = this.props;
    const goodTime = validateKiedy(kiedy, sentDays, false);
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
        <form onSubmit={e => this.handleSubmit(e)}>
          <Grid container spacing={24}>
            <Grid item xs={3}>
              <InputComponent
                disabled={modal ? true : false}
                label={
                  this.props.errorKiedy ? "Data wysłana do raportu" : "Kiedy"
                }
                error={this.props.errorKiedy}
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
  )(PlanerAktywnosciForm)
);
