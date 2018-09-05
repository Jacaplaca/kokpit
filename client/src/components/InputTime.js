import React from "react";
import PropTypes from "prop-types";
import InputMask from "react-input-mask";
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
    //marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    // margin: 0,
    minWidth: 120,
    width: "100%"
  },
  textField: {
    marginBottom: theme.spacing.unit
  }
});

class InputTime extends React.Component {
  state = {
    input: ""
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes, label, value, edytuj } = this.props;

    return (
      <FormControl
        className={classes.formControl}
        aria-describedby="name-helper-text"
      >
        <InputMask
          mask="99 : 99"
          value={value}
          onChange={event => edytuj(event.target.value)}
          // className={classes.textField}
        >
          {() => (
            <TextField
              id="input"
              label={label}
              name="input"
              // className={classes.textField}
              // margin="normal"
              type="text"
            />
          )}
        </InputMask>
      </FormControl>
    );
  }
}

InputTime.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InputTime);
