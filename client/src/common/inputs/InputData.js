import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import { withStyles } from "@material-ui/core/styles";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import "moment/locale/pl";
moment.locale("pl");
// https://codepen.io/moroshko/pen/KVaGJE debounceing loading

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    marginBottom: theme.spacing.unit,
    minWidth: 120,
    width: "100%"
  }
});

class InputData extends React.Component {
  state = {
    input: ""
  };

  render() {
    const {
      classes,
      label,
      edytuj,
      value,
      error,
      disabled,
      helperText,
      max
    } = this.props;

    return (
      <FormControl
        className={classes.formControl}
        aria-describedby="name-helper-text"
      >
        <TextField
          disabled={disabled ? true : false}
          error={error}
          name="input"
          id="input"
          label={label}
          type="date"
          value={value}
          onChange={event => edytuj(event.target.value)}
          InputLabelProps={{
            shrink: true
          }}
          InputProps={{ inputProps: { max: max ? max : "2099-01-01" } }}
          helperText={helperText}
        />
      </FormControl>
    );
  }
}

InputData.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InputData);
