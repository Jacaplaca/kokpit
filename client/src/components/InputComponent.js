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
import Input from "@material-ui/core/Input";
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
    minWidth: 120,
    width: "100%"
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  },
  textField: {
    marginBottom: theme.spacing.unit
  }
});

class InputComponent extends React.Component {
  state = {
    input: ""
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes, label, type, edytuj, value } = this.props;

    return (
      <FormControl
        className={classes.formControl}
        aria-describedby="name-helper-text"
      >
        {/* <InputLabel htmlFor="name-helper">{label}</InputLabel> */}
        {/* <Input
          name="uwagi"
          id="name-helper"
          value={this.state.uwagi}
          onChange={this.handleChange}
          type={type}
          className={classes.textField}
        /> */}
        <TextField
          label={label}
          name="input"
          id="name-helper"
          value={value}
          onChange={event => edytuj(event.target.value)}
          // value={this.state.input}
          // onChange={this.handleChange}
          type={type}
          // margin="normal"
          // className={classes.textField}
        />
        {/* <FormHelperText id="name-helper-text">
          Some important helper text
        </FormHelperText> */}
      </FormControl>
    );
  }
}

InputComponent.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InputComponent);
