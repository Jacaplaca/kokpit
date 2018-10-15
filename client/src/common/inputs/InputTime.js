import React from "react";
import PropTypes from "prop-types";
import InputMask from "react-input-mask";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
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
    const { classes, label, value, edytuj, error } = this.props;

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
              error={error}
              id="input"
              label={label}
              name="input"
              // className={classes.textField}
              // margin="normal"
              type="text"
            />
          )}
        </InputMask>
        {/* <FormHelperText id="name-helper-text">
          Some important helper text
        </FormHelperText> */}
      </FormControl>
    );
  }
}

InputTime.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InputTime);
