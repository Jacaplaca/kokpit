import React from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import InputMask from "react-input-mask";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import IconCancel from "@material-ui/icons/Clear";
import CircularProgress from "@material-ui/core/CircularProgress";

import InputSelectTextField from "../inputs/InputSelectTextField";

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

const InputComponent = props => {
  const {
    passwordVisibility,
    label,
    type,
    name,
    edytuj,
    value,
    //kwota,
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
  } = props;

  const clearButton = () => {
    if (value !== "" && isLoading) {
      return (
        <CircularProgress size={23} color="red" style={{ marginBottom: 10 }} />
      );
    } else if (value !== "" && !isLoading) {
      return (
        <IconButton
          onClick={() => edytuj({ target: { name: name, value: "" } })}
        >
          <IconCancel />
        </IconButton>
      );
    } else {
      <div />;
    }
  };

  const endAdornment = () => {
    if (value.length > 0 && !passwordVisibility) {
      return <InputAdornment position="end">{clearButton()}</InputAdornment>;
    } else if (value.length > 0 && passwordVisibility) {
      return (
        <InputAdornment position="end">
          <IconButton
            aria-label="Toggle password visibility"
            onClick={passwordVisibility}
          >
            {password ? <VisibilityOff /> : <Visibility />}
          </IconButton>
          {clearButton()}
        </InputAdornment>
      );
    } else {
      return <div />;
    }
  };

  return (
    <FormControl
      className={classes.formControl}
      aria-describedby="name-helper-text"
    >
      <InputMask
        mask={mask}
        value={value}
        onChange={edytuj}
        InputProps={{
          inputRef: node => {
            ref(node);
            inputRef(node);
          }
          // classes: {
          //   input: classes.input
          // }
        }}
        // className={classes.textField}
      >
        {() => (
          <InputSelectTextField
            helperText={helperText}
            error={error}
            label={label}
            name={name}
            id="name-helper"
            value={value}
            onChange={edytuj}
            type={password ? "password" : type}
            InputLabelProps={{
              shrink: type === "date" || value !== "" ? true : false
            }}
            // InputProps={{
            //   inputComponent: kwota && NumberFormatCustom,
            //   // endAdornment: endAdornment()
            //   endAdornment: <InputAdornment position="end">asdf</InputAdornment>
            // }}
            {...other}
          />
          // <TextField
          //   fullWidth
          //   helperText={helperText}
          //   error={error}
          //   label={label}
          //   name={name}
          //   id="name-helper"
          //   value={value}
          //   //onChange={event => edytuj(event.target.value)}
          //   onChange={edytuj}
          //   //type={this.state.showPassword ? type : "password"}
          //   type={password ? "password" : type}
          //   InputLabelProps={{
          //     shrink: type === "date" || value !== "" ? true : false
          //   }}
          //   InputProps={{
          //     inputComponent: kwota && NumberFormatCustom,
          //     // inputComponent: kwota && NumberFormatCustom,
          //     endAdornment: endAdornment()
          //     // inputRef: node => {
          //     //   //ref(node);
          //     //   inputRef(node);
          //     // },
          //     // classes: {
          //     //   input: classes.input
          //     // }
          //   }}
          // />
        )}
      </InputMask>
    </FormControl>
  );
};

InputComponent.defaultProps = {
  error: false,
  helperText: "",
  type: "string",
  value: ""
  //email: "",
  //password: ""
};

InputComponent.propTypes = {
  classes: PropTypes.object.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  type: PropTypes.string
};

//export default InputComponent;
export default withStyles(styles)(InputComponent);
