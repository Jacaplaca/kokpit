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
    minWidth: 120,
    width: "100%"
  }
});

class InputData extends React.Component {
  state = {
    input: ""
  };

  // handleChange = event => {
  //   // this.setState({ [event.target.name]: event.target.value });
  //   this.props.edytuj(event.target.value);
  // };

  render() {
    const { classes, label, edytuj, value } = this.props;

    return (
      <FormControl
        className={classes.formControl}
        aria-describedby="name-helper-text"
      >
        {/* <InputLabel htmlFor="name-helper">Name</InputLabel> */}
        <TextField
          name="input"
          id="input"
          label={label}
          type="date"
          // defaultValue="2017-05-24"
          // value={this.state.input}
          value={value}
          // className={classes.textField}
          // onChange={this.handleChange}
          onChange={event => edytuj(event.target.value)}
          InputLabelProps={{
            shrink: true
          }}
          // margin="normal"
        />
        {/* <FormHelperText id="name-helper-text">
          Some important helper text
        </FormHelperText> */}
      </FormControl>
    );
  }
}

InputData.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InputData);
