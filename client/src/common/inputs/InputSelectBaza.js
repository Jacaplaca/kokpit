import React from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import { dynamicSort } from "../../common/functions";
import InputSelectTextField from "./InputSelectTextField";

// https://codepen.io/moroshko/pen/KVaGJE debounceing loading

//

function renderSuggestionsContainer({ containerProps, children, query }) {
  return <div {...containerProps}>{children}</div>;
}

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
  const regex = new RegExp(value.toLowerCase());

  return fetchowane.filter(suggestion =>
    regex.test(suggestion.name.toLowerCase())
  );
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
    overflowY: "auto",
    background: "white",
    boxShadow: theme.shadows[5]
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
    // fetchowane: [{ id: 1, name: "aaa" }, { id: 2, name: "bbb" }]
    fetchowane: []
    //focus: false
  };

  componentWillMount() {
    axios.get(`/api/table/${this.props.przeszukuje}`).then(result => {
      const fetchowane = this.props.reverse
        ? result.data.sort(dynamicSort("name")).reverse()
        : result.data.sort(dynamicSort("name"));
      this.setState({ fetchowane, isLoading: false });
      this.props.daty(fetchowane);
    });
  }

  onChange = (event, { newValue, method }) => {
    console.log(newValue);
    const wybrano = this.state.fetchowane.filter(x => x.name === newValue)[0];
    console.log(wybrano);
    this.setState({
      value: newValue
    });
    newValue !== ""
      ? this.setState({ clear: true })
      : this.setState({ clear: false });

    this.props.edytuj(newValue);
    wybrano ? this.props.wybrano(wybrano) : this.props.wybrano("");
    // wybrano ? this.props.edytujValue(wybrano)
    //this.props.edytuj({ name: wybrano ? wybrano.namenewValue });
  };

  clearValue = () => {
    this.setState({
      value: "",
      clear: false
    });
    this.props.czysc();
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
      // disabled
    } = this.props;
    const { suggestions, value, single } = this.state;

    const inputProps = {
      //autoFocus: focus,
      label: error ? "Wybierz poprawną datę" : label,
      placeholder,
      classes,
      value: valueProps,
      //value: value,
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
        renderInputComponent={InputSelectTextField}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        shouldRenderSuggestions={shouldRenderSuggestions}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        renderSuggestionsContainer={renderSuggestionsContainer}
        ref={this.storeInputReference}
      />
    );
  }
}

InputSelectBaza.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InputSelectBaza);
