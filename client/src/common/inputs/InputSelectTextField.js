import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import NumberFormat from "react-number-format";
import ClearButton from "./ClearButton";

function NumberFormatCustom(props) {
  const { inputRef, onChange, name, ...other } = props;

  return (
    <NumberFormat
      {...other}
      name={name}
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
    // clearvalue,
    // kwota,
    // //error,
    // classes,
    inputRef = () => {},
    ref,
    kwota,
    isloading,
    name,
    // isloading,
    ...other
  } = props;

  const endAdornment = () => {
    const {
      value,
      isloading,
      name,
      onChange,
      password,
      passwordVisibility
    } = props;
    if (value.length > 0 && !passwordVisibility) {
      return (
        <InputAdornment position="end">
          <ClearButton
            value={value}
            isloading={isloading}
            name={name}
            onChange={onChange}
          />
        </InputAdornment>
      );
    } else if (value.length > 0 && passwordVisibility) {
      return (
        <InputAdornment position="end">
          <IconButton
            aria-label="Toggle password visibility"
            onClick={passwordVisibility}
          >
            {password ? <VisibilityOff /> : <Visibility />}
          </IconButton>
          <ClearButton
            value={value}
            isloading={isloading}
            name={name}
            onChange={onChange}
          />
        </InputAdornment>
      );
    } else {
      return <div />;
    }
  };

  const thisCompInputProps = {
    inputComponent: kwota && NumberFormatCustom,
    endAdornment: endAdornment()
  };

  return (
    <TextField
      InputProps={{
        inputRef: node => {
          ref && ref(node);
          inputRef(node);
        },
        ...thisCompInputProps
      }}
      {...other}
      name={name}
    />
  );
};

export default InputSelectTextField;
