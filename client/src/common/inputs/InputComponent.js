import React from "react";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import TextField from "@material-ui/core/TextField";
import Input from "@material-ui/core/Input";

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
    minWidth: 120
    // width: "100%"
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
    format: null,
    width: 100
  };

  componentWillMount() {
    this.setState({ width: 10 + this.props.value.length * 8 });
    switch (this.props.format) {
      case "select":
        this.setState({ format: this.selectFormat });
        // formatField = simpleNumberFormat;
        break;
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

  // componentWillReceiveProps = nextProps => {
  //   // console.log("inputComponent, componentWillReceiveProps", nextProps);
  //   if (this.props.value.length !== nextProps.value.length) {
  //     this.setState({ width: nextProps.value.length * 10 });
  //   }
  // };

  selectFormat = props => {
    const { inputRef, onChange, ...other } = props;

    return <span>sadf</span>;
  };
  simpleNumberFormat = props => {
    const { inputRef, onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
          // console.log("simpleNumberFormat", values);
          this.setState({ width: 10 + values.value.length * 8 });
          console.log("values in input", values);
          onChange({
            target: {
              // value: values.value
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
      suffix,
      disabled,
      simpleInput,
      autoFocus,
      short,
      prefix
    } = this.props;

    const { width } = this.state;
    // console.log("inputComponent value label, state", value, label, this.state);
    return (
      <FormControl
        className={classes.formControl}
        aria-describedby="name-helper-text"
        style={{ width: !short && "100%" }}
      >
        {simpleInput ? (
          <Input
            name="input"
            startAdornment={
              <InputAdornment position="start">{prefix}</InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">{suffix}</InputAdornment>
            }
            // label={value[field.label]}
            // disableUnderline
            autoFocus={autoFocus}
            type="text"
            value={value}
            onChange={event => {
              edytuj(event.target.value);
              // console.log("onChange", event);
            }}
            // onClick={() => {
            //   return;
            // }}
            inputComponent={this.state.format}
            inputProps={{
              style: { textAlign: "end", width }
            }}
          />
        ) : (
          <TextField
            // disableUnderline={true}
            disabled={disabled}
            helperText={helperText}
            error={error}
            label={label}
            name="input"
            id="name-helper"
            value={value}
            onChange={event => edytuj(event.target.value)}
            type={this.state.showPassword ? "text" : "password"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">{prefix}</InputAdornment>
              ),
              inputComponent: this.state.format,
              // inputComponent: this.format,
              endAdornment: password ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Toggle password visibility"
                    onClick={this.handleClickShowPassword}
                  >
                    {this.state.showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ) : (
                <InputAdornment position="end">{suffix}</InputAdornment>
              )
            }}
          />
        )}
      </FormControl>
    );
  }
}

InputComponent.defaultProps = {
  error: false,
  helperText: "",
  number: false,
  format: "standard",
  disabled: false,
  prefix: "",
  suffix: ""
};

InputComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string
};

export default withStyles(styles)(InputComponent);
