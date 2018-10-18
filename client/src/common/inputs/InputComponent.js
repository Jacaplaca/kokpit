import React from "react";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputMask from "react-input-mask";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import IconCancel from "@material-ui/icons/Clear";
import CircularProgress from "@material-ui/core/CircularProgress";

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

function NumberFormatCustom(props) {
  const { inputRef, onChange, name, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.formattedValue.replace(/ /g, ""),
            name: name
          }
        });
      }}
      decimalSeparator=","
      thousandSeparator=" "
      decimalScale={2}
      suffix="  zł"
    />
  );
}

class InputComponent extends React.Component {
  state = {
    input: "",
    showPassword: this.props.password ? false : true
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  clearButton = () => {
    if (this.props.value !== "" && this.props.isLoading) {
      return (
        <CircularProgress size={23} color="red" style={{ marginBottom: 10 }} />
      );
    } else if (this.props.value !== "" && !this.props.isLoading) {
      return (
        <IconButton
          onClick={() =>
            this.props.edytuj({ target: { name: this.props.name, value: "" } })
          }
        >
          <IconCancel />
        </IconButton>
      );
    } else {
      <div />;
    }
  };

  endAdornment = () => {
    if (this.props.value.length > 0 && !this.props.password) {
      return (
        <InputAdornment position="end">{this.clearButton()}</InputAdornment>
      );
    } else if (this.props.value.length > 0 && this.props.password) {
      return (
        <InputAdornment position="end">
          <IconButton
            aria-label="Toggle password visibility"
            onClick={this.handleClickShowPassword}
          >
            {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
          {this.clearButton()}
        </InputAdornment>
      );
    }
  };

  render() {
    // const {
    //   classes,
    //   label,
    //   type,
    //   name,
    //   edytuj,
    //   value,
    //   kwota,
    //   password,
    //   error,
    //   mask,
    //   helperText
    // } = this.props;

    const {
      label,
      type,
      name,
      edytuj,
      value,
      kwota,
      password,
      error,
      mask,
      helperText,
      // disabled,
      clearValue,
      classes,
      inputRef = () => {},
      ref,
      isLoading,
      ...other
    } = this.props;

    return (
      <FormControl
        className={classes.formControl}
        aria-describedby="name-helper-text"
      >
        <InputMask
          mask={mask}
          value={value}
          onChange={edytuj}
          // className={classes.textField}
        >
          {() => (
            <TextField
              fullWidth
              helperText={helperText}
              error={error}
              label={label}
              name={name}
              id="name-helper"
              value={value}
              //onChange={event => edytuj(event.target.value)}
              onChange={edytuj}
              type={this.state.showPassword ? type : "password"}
              InputLabelProps={{
                shrink: type === "date" || value !== "" ? true : false
              }}
              InputProps={{
                inputComponent: kwota && NumberFormatCustom,
                endAdornment: this.endAdornment(),
                inputRef: node => {
                  //ref(node);
                  inputRef(node);
                },
                classes: {
                  input: classes.input
                }
              }}
            />
          )}
        </InputMask>
      </FormControl>
    );
  }
}

// return (
//   <TextField
//     fullWidth
//     InputProps={{
//       endAdornment: (
//         <InputAdornment position="end">{clearButton()}</InputAdornment>
//       ),
//       inputRef: node => {
//         ref(node);
//         inputRef(node);
//       },
//       classes: {
//         input: classes.input
//       }
//     }}
//     {...other}
//   />
// );

InputComponent.defaultProps = {
  error: false,
  helperText: "",
  type: "string"
};

InputComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  type: PropTypes.string
};

export default withStyles(styles)(InputComponent);
