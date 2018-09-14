import React from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import { DebounceInput } from "react-debounce-input";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Popper from "@material-ui/core/Popper";
import axios from "axios";
import debounce from "lodash.debounce";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import IconCancel from "@material-ui/icons/Clear";
import { withStyles } from "@material-ui/core/styles";

const InputSelectTextField = inputProps => {
  const {
    clear,
    clearValue,
    error,
    classes,
    inputRef = () => {},
    ref,
    ...other
  } = inputProps;

  return (
    <TextField
      error={error ? true : false}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {clear ? (
              <IconButton onClick={() => clearValue()}>
                <IconCancel />
              </IconButton>
            ) : null}
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
