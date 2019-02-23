import React from "react";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

// https://codepen.io/moroshko/pen/KVaGJE debounceing loading

let formatField = null;

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
    input: "",
    showPassword: this.props.password ? false : true,
    format: null
  };

  componentWillMount() {
    switch (this.props.format) {
      case "number":
        this.setState({ format: this.simpleNumberFormat });
        // formatField = simpleNumberFormat;
        break;
      case "zl":
        this.setState({ format: this.NumberFormatCustom });
        // formatField = NumberFormatCustom;
        break;
      default:
        this.setState({ format: null });
    }
  }

  simpleNumberFormat = props => {
    const { inputRef, onChange, ...other } = props;
    // console.log(props);

    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
          onChange({
            target: {
              value: values.formattedValue.replace(/ /g, "")
            }
          });
        }}
        decimalSeparator=","
        thousandSeparator=" "
        decimalScale={2}
        // suffix={this.props.suffix ? ` ${this.props.suffix}` : null}
      />
    );
  };

  NumberFormatCustom = props => {
    const { inputRef, onChange, ...other } = props;
    // console.log(props);

    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
          onChange({
            target: {
              value: values.formattedValue.replace(/ /g, "")
            }
          });
        }}
        decimalSeparator=","
        thousandSeparator=" "
        decimalScale={2}
        suffix="  zł"
      />
    );
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  // format = () => {
  //   console.log("format", this.props.format);
  //   switch (this.props.format) {
  //     case "number":
  //       return simpleNumberFormat;
  //     // break;
  //     case "zl":
  //       return NumberFormatCustom;
  //     // break;
  //     default:
  //       return;
  //   }
  // };

  render() {
    const {
      classes,
      label,
      //type,
      edytuj,
      value,
      kwota,
      password,
      error,
      helperText,
      suffix
    } = this.props;

    return (
      <FormControl
        className={classes.formControl}
        aria-describedby="name-helper-text"
      >
        <TextField
          helperText={helperText}
          error={error}
          label={label}
          name="input"
          id="name-helper"
          value={value}
          onChange={event => edytuj(event.target.value)}
          type={this.state.showPassword ? "text" : "password"}
          InputProps={{
            inputComponent: this.state.format,
            // inputComponent: this.format,
            endAdornment: password ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="Toggle password visibility"
                  onClick={this.handleClickShowPassword}
                >
                  {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ) : (
              <InputAdornment position="end">{suffix}</InputAdornment>
            )
          }}
        />
      </FormControl>
    );
  }
}

InputComponent.defaultProps = {
  error: false,
  helperText: "",
  number: false,
  format: "standard"
};

InputComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string
};

export default withStyles(styles)(InputComponent);
