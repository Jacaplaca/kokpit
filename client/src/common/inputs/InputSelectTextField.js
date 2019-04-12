import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import IconCancel from "@material-ui/icons/Clear";

const InputSelectTextField = inputProps => {
  const {
    // disabled,
    clearValue,
    error,
    classes,
    inputRef = () => {},
    ref,
    // disabled,
    helperText,
    ...other
  } = inputProps;

  return (
    <TextField
      // disabled={disabled ? true : false}
      error={error ? true : false}
      helperText={helperText}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {inputProps.value !== "" && !inputProps.disabled ? (
              <IconButton onClick={() => clearValue()}>
                <IconCancel />
              </IconButton>
            ) : (
              <div />
            )}
          </InputAdornment>
        ),
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input
        }
      }}
      {...other}
    />
  );
};

export default InputSelectTextField;
