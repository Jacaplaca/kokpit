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
import InputTime from "./InputTime";
import InputData from "./InputData";
import InputComponent from "./InputComponent";

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

class PlanerAktywnosciForm extends Component {
  state = {
    id: "",

    kiedy: "",
    start: "",
    stop: "",
    miejsce_id: "",
    aktywnosc_id: "",
    inna: "",
    uwagi: "",
    wyslano: "",

    errorStart: false,
    errorStop: false,

    activities: [],
    edited: false,
    submitIsDisable: true
  };

  componentWillMount() {
    console.log("form zostal zamountowany");
    console.log(this.props.editedId);
    console.log(this.props.modal);
    this.state.id !== this.props.editedId &&
      this.handleEdit(this.props.editedId);
    // this.props.modal && (
    //
    // )
  }

  validateTime = (time, pole) => {
    const nazwaPola = `error${pole}`;
    const hours = Math.trunc(time.split(" : ")[0]);
    const minutes = Math.trunc(time.split(" : ")[1]);
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
      uwagi: uwagi_prevState
    } = prevState;
    const { kiedy, start, stop, aktywnosc_id, miejsce_id, inna } = this.state;

    if (start !== start_prevState || stop !== stop_prevState) {
      this.validateTime(start, "Start");
      this.validateTime(stop, "Stop");
    }

    if (aktywnosc_id !== aktywnosc_id_prevState) {
      this.setState({ miejsce_id: "", inna: "" });
    }

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
    axios.get(`/api/akt/${id}`).then(result => {
      const {
        kiedy,
        start,
        stop,
        aktywnosc_id,
        miejsce_id,
        inna,
        uwagi
      } = result.data;
      this.setState({
        kiedy,
        start,
        stop,
        aktywnosc_id,
        miejsce_id,
        inna,
        uwagi,
        // categoryId: { label: category.name, value: category.id },
        // groupId: { label: group.name, value: group.id },
        edited: true
      });
    });
  };

  onEdit = () => {
    console.log("on edit");
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
        miejsce_id,
        inna,
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
    const { classes } = this.props;

    return (
      <Paper style={{ padding: 20 }}>
        <form
          onSubmit={e => this.handleSubmit(e)}
          // method="POST"
          // action="/api/cost/"
        >
          <Grid container spacing={24}>
            <Grid item xs={3}>
              <InputData
                label="Kiedy"
                type="date"
                edytuj={kiedy => this.setState({ kiedy })}
                value={this.state.kiedy}
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
                  edytuj={miejsce_id => this.setState({ miejsce_id })}
                  value={this.state.miejsce_id}
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
