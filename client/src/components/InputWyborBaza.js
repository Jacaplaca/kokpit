import React from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import { DebounceInput } from "react-debounce-input";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Popper from "@material-ui/core/Popper";
import axios from "axios";
import debounce from "lodash.debounce";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";

// https://codepen.io/moroshko/pen/KVaGJE debounceing loading

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    width: "100%",
    //marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  textField: {
    marginBottom: theme.spacing.unit
  }
});

class InputWyborBaza extends React.Component {
  state = {
    wybrany: "",
    selections: []
  };

  componentDidMount() {
    axios.get(`/api/table/${this.props.table}`).then(result => {
      const selections = result.data;
      this.setState({
        selections
      });
    });
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  renderSelect = () => {
    return this.state.selections.map(select => (
      <MenuItem key={select.id} value={select.id}>
        {select.name}
      </MenuItem>
    ));
  };

  render() {
    const { classes, label, value, edytuj } = this.props;

    return (
      <div className={classes.root}>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="age-simple">{label}</InputLabel>
          <Select
            value={value}
            onChange={event => edytuj(event.target.value)}
            // value={this.state.wybrany}
            // onChange={this.handleChange}
            inputProps={{
              name: "wybrany",
              id: "age-simple"
            }}
            // margin="normal"
            // className={classes.textField}
          >
            {" "}
            {this.renderSelect()}
          </Select>
        </FormControl>
      </div>
    );
  }
}

InputWyborBaza.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InputWyborBaza);
