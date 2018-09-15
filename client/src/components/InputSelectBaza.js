import React from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";

import InputSelectTextField from "./InputSelectTextField";

// https://codepen.io/moroshko/pen/KVaGJE debounceing loading

//
function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div style={{ display: "block", width: "100%" }}>
        <span>
          {parts.map((part, index) => {
            return part.highlight ? (
              <span key={String(index)} style={{ fontWeight: 500 }}>
                {part.text}
              </span>
            ) : (
              <strong key={String(index)} style={{ fontWeight: 300 }}>
                {part.text}
              </strong>
            );
          })}
        </span>
      </div>
      {/* <span>{gmina}</span> */}
    </MenuItem>
  );
}

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSuggestions(fetchowane, value) {
  // const sugestie = [...suggestions];
  const escapedValue = escapeRegexCharacters(value.trim());
  //const regex = new RegExp("^" + escapedValue, "i");
  const regex = new RegExp(value);

  return fetchowane.filter(suggestion => regex.test(suggestion.name));
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function shouldRenderSuggestions() {
  return true;
}

const styles = theme => ({
  root: {
    // height: 250,
    width: "100%",
    // flexGrow: 1,
    marginBottom: theme.spacing.unit / 2
  },
  container: {
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
    maxHeight: 300,
    overflowY: "auto"
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  divider: {
    height: theme.spacing.unit * 1
  }
  // input: {
  //   margin: 44
  // }
});

class InputSelectBaza extends React.Component {
  state = {
    //error: "Wpisz poprawną datę",
    value: "",
    single: "",
    popper: "",
    suggestions: [],
    isLoading: false,
    pokazujSugestie: true,
    fetchowane: []
    //focus: false
  };

  componentWillMount() {
    //   // axios.get(`/api/dniDoRaportu/${value}`).then(result => {
    axios.get(`/api/table/dniDoRaportu`).then(result => {
      const fetchowane = result.data;
      this.setState({
        isLoading: false,
        fetchowane
      });
      this.props.daty(fetchowane);
    });
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
    newValue !== ""
      ? this.setState({ clear: true })
      : this.setState({ clear: false });
    this.props.edytuj(newValue);
  };

  clearValue = () => {
    this.setState({
      value: "",
      clear: false
    });
    this.props.edytuj("");
    this.input.focus();
    this.setState({
      suggestions: this.state.fetchowane
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(this.state.fetchowane, value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  storeInputReference = autosuggest => {
    if (autosuggest !== null) {
      this.input = autosuggest.input;
    }
  };

  render() {
    const {
      classes,
      label,
      placeholder,
      value: valueProps,
      error
    } = this.props;
    const { suggestions } = this.state;

    const inputProps = {
      //autoFocus: focus,
      label: error ? "Wybierz poprawną datę" : label,
      placeholder,
      classes,
      value: valueProps,
      onChange: this.onChange,
      error,
      clearValue: this.clearValue
    };

    return (
      <Autosuggest
        //autoFocus={true}
        //focusInputOnSuggestionClick
        //alwaysRenderSuggestions={true}
        theme={{
          // renderInputComponent: classes.root,
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderSuggestionsContainer={options => (
          <Paper {...options.containerProps} square>
            {options.children}
          </Paper>
        )}
        // renderInputComponent={renderInputComponent}
        renderInputComponent={InputSelectTextField}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        shouldRenderSuggestions={shouldRenderSuggestions}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        ref={this.storeInputReference}
      />
    );
  }
}

InputSelectBaza.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InputSelectBaza);
