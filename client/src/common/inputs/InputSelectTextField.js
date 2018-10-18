import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import IconCancel from "@material-ui/icons/Clear";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import NumberFormat from "react-number-format";
import CircularProgress from "@material-ui/core/CircularProgress";

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

const InputSelectTextField = props => {
  const {
    // //value
    // // disabled,
    // clearValue,
    // kwota,
    // //error,
    // classes,
    // inputRef = () => {},
    // ref,
    // isLoading,
    ...other
  } = props;

  // const clearButton = () => {
  //   if (inputProps.value !== "" && isLoading) {
  //     return (
  //       <CircularProgress size={23} color="red" style={{ marginBottom: 10 }} />
  //     );
  //   } else if (inputProps.value !== "" && !isLoading) {
  //     return (
  //       <IconButton onClick={() => clearValue()}>
  //         <IconCancel />
  //       </IconButton>
  //     );
  //   } else {
  //     <div />;
  //   }
  // };

  const clearButton = () => {
    if (props.value !== "" && props.isLoading) {
      return (
        <CircularProgress size={23} color="red" style={{ marginBottom: 10 }} />
      );
    } else if (props.value !== "" && !props.isLoading) {
      return (
        <IconButton
          onClick={() =>
            props.onChange({ target: { name: props.name, value: "" } })
          }
        >
          <IconCancel />
        </IconButton>
      );
    } else {
      <div />;
    }
  };

  const endAdornment = () => {
    if (props.value.length > 0 && !props.passwordVisibility) {
      return <InputAdornment position="end">{clearButton()}</InputAdornment>;
    } else if (props.value.length > 0 && props.passwordVisibility) {
      return (
        <InputAdornment position="end">
          <IconButton
            aria-label="Toggle password visibility"
            onClick={props.passwordVisibility}
          >
            {props.password ? <VisibilityOff /> : <Visibility />}
          </IconButton>
          {clearButton()}
        </InputAdornment>
      );
    } else {
      return <div />;
    }
  };

  return (
    <TextField
      // disabled={disabled ? true : false}
      //error={error ? true : false}
      fullWidth
      InputProps={{
        inputComponent: props.kwota && NumberFormatCustom,
        endAdornment: endAdornment()
        // inputRef: node => {
        //   ref(node);
        //   inputRef(node);
        // }
        // classes: {
        //   input: classes.input
        // }
      }}
      {...other}
    />
  );
};

export default InputSelectTextField;
