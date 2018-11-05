import React from "react";
import PropTypes from "prop-types";
import FormControl from "@material-ui/core/FormControl";
import InputMask from "react-input-mask";
import { withStyles } from "@material-ui/core/styles";
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
    classes,
    inputRef = () => {},
    //inputRef,
    ref,
    fullWidth,
    kwota,
    ...other
  } = props;

  return (
    <FormControl
      className={classes.formControl}
      aria-describedby="name-helper-text"
    >
      <InputMask mask={mask} value={value} onChange={edytuj} {...other}>
        {() => (
          <InputSelectTextField
            // onClick={() => {
            //   console.log("InputComponent");
            //   console.log(props);
            // }}
            //refy={props.refy}
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
            kwota={kwota}
            fullWidth={fullWidth}
          />
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
