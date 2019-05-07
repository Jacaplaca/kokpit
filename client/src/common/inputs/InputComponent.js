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

import ButtonIconCircle from "../ButtonIconCircle";
import KeyboardArrowUp from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDown from "@material-ui/icons/KeyboardArrowDown";

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

  _focus() {
    this.textInput.focus();
  }

  operation = direction => {
    const { value, edytuj } = this.props;
    const nowa = parseFloat(value.replace(",", "."));
    let mod = nowa % 1;
    mod = parseFloat(mod.toFixed(2));
    let mod2 = mod * 10;
    mod2 = parseFloat(mod2.toFixed(2));
    let dec = mod2 % 1;
    dec = parseFloat(dec.toFixed(2));
    let addon = 0;
    let fixed = 0;
    console.log(value, nowa, mod, mod2, dec, addon);
    if (mod === 0) {
      addon = 1;
    } else if (mod !== 0 && dec === 0) {
      addon = 0.1;
      fixed = 2;
    } else if (mod !== 0 && mod2 !== 0 && dec !== 0) {
      addon = 0.01;
      fixed = 2;
    }

    if (direction === "more") {
      const sum = nowa + addon;
      edytuj(sum < 0 ? "0" : `${sum.toFixed(fixed)}`.replace(".", ","));
    } else if (direction === "less") {
      const sum = nowa - addon;
      edytuj(sum < 0 ? "0" : `${sum.toFixed(fixed)}`.replace(".", ","));
    }
    // console.log("number", direction, value, number);
  };

  getAlert = () => {
    console.log("getAler()");
  };

  componentDidUpdate() {
    // this.props.name === this.props.autoFocus && this._focus();
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
    // console.log("thisprops", this.props.onRef(this));
    // this.props.name === this.props.autoFocus && this._focus();
  }
  componentWillUnmount() {
    // console.log("unmount");
    this.props.onRef && this.props.onRef(null);
  }

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
    const { decimals, inputRef, onChange, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={inputRef}
        onValueChange={values => {
          // console.log("simpleNumberFormat", values, props, this.props.decima);
          this.setState({ width: 10 + values.value.length * 8 });
          // console.log("values in input", values);
          onChange({
            target: {
              // value: values.value
              value: values.formattedValue.replace(/ /g, "").replace("-", "")
            }
          });
        }}
        decimalSeparator=","
        thousandSeparator=" "
        decimalScale={this.props.decimals}
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
      prefix,
      decimals,
      format
    } = this.props;

    const { width } = this.state;
    // console.log(
    //   "inputComponent value label, state decimals",
    //   value,
    //   label,
    //   this.state,
    //   decimals
    // );
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
            decimals={decimals}
          />
        ) : (
          <TextField
            // disableUnderline={true}
            inputRef={input => {
              this.textInput = input;
            }}
            decimals={decimals}
            disabled={disabled}
            helperText={helperText}
            error={error}
            label={label}
            name="input"
            id="name-helper"
            value={value}
            onChange={event => edytuj(event.target.value)}
            // type={this.state.showPassword ? "text" : "password"}
            // type="number"
            // step="1"
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
                <InputAdornment position="end">
                  {suffix}
                  {format === "number" && !disabled && (
                    <MoreLess
                      up={() => this.operation("more")}
                      down={() => this.operation("less")}
                    />
                  )}
                </InputAdornment>
              )
            }}
          />
        )}
      </FormControl>
    );
  }
}

const MoreLess = ({ up, down }) => (
  <div
    style={{
      display: "grid",
      gridTemplateRows: "1fr 1fr",
      paddingBottom: 10,
      paddingLeft: 5
    }}
  >
    <ButtonIconCircle small title="Edytuj" akcja={up}>
      <KeyboardArrowUp style={{ fontSize: 20 }} />
    </ButtonIconCircle>
    <ButtonIconCircle small title="Edytuj" akcja={down}>
      <KeyboardArrowDown style={{ fontSize: 20 }} />
    </ButtonIconCircle>
  </div>
);

InputComponent.defaultProps = {
  error: false,
  helperText: "",
  number: false,
  format: "standard",
  disabled: false,
  prefix: "",
  suffix: "",
  decimals: 2
};

InputComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string
};

export default withStyles(styles)(InputComponent);
