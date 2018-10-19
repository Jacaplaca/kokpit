import React from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
//import match from "autosuggest-highlight/match";
//import parse from "autosuggest-highlight/parse";
//import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import { dynamicSort } from "../../common/functions";
import { simpleSuggestion } from "./Suggestions";
import InputSelectTextField from "../../common/inputs/InputSelectTextField";

// https://codepen.io/moroshko/pen/KVaGJE debounceing loading

function renderSuggestionsContainer({ containerProps, children, query }) {
  return <div {...containerProps}>{children}</div>;
}

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSuggestions(fetchowane, value, names) {
  // const sugestie = [...suggestions];
  //const escapedValue = escapeRegexCharacters(value.trim());
  //const regex = new RegExp("^" + escapedValue, "i");
  const regex = new RegExp(value.toLowerCase());
  //
  // const filtered = fetchowane.filter(suggestion =>
  //   regex.test(suggestion.name.toLowerCase())
  // );
  // console.log(filtered);
  // return filtered;

  //const names = ;

  return fetchowane.filter(suggestion => {
    let filtered = [];
    for (var key of names) {
      filtered.push(regex.test(suggestion[key].toLowerCase()));
    }
    return filtered;
  });
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
    // axios.get(`/api/table/${this.props.baza}`).then(result => {
    //   const fetchowane = this.props.reverse
    //     ? result.data.sort(dynamicSort("name")).reverse()
    //     : result.data.sort(dynamicSort("name"));
    //   this.setState({ fetchowane, isLoading: false });
    //   //this.props.daty(fetchowane);
    // });
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
    const wybrano = this.state.fetchowane.filter(x => x.name === newValue)[0];
    let input = {
      target: {
        value: wybrano ? wybrano.id : newValue,
        name: this.props.name,
        text: wybrano ? wybrano.name : newValue,
        type: "inputSelectBaza"
      }
    };
    console.log(input);
    newValue !== ""
      ? this.setState({ clear: true })
      : this.setState({ clear: false });

    this.props.wybrano(input);
  };

  clearValue = () => {
    console.log("czyszcze pole");
    this.setState({
      value: "",
      clear: false
    });
    //this.props.czysc();
    let input = {
      target: {
        value: "",
        name: this.props.name,
        text: "",
        type: "inputSelectBaza"
      }
    };
    this.props.wybrano(input);
    this.input.focus();
    //this.onSuggestionsFetchRequested("ko");
    // this.setState({
    //   suggestions: this.state.fetchowane
    // });
    // this.setState({
    //   value: ""
    // });
    this.props.startAfter > 0
      ? this.setState({ suggestions: [] })
      : this.loadSuggestions("", `/api/table/${this.props.baza}`);
  };

  loadSuggestions(value, address) {
    // console.log("loadSuggestions");
    //
    // this.setState({
    //   isLoading: true
    // });
    //
    // axios.get(`/api/city/${value}`).then(result => {
    //   const suggestions = result.data;
    //   console.log(suggestions);
    //
    //   if (value === this.state.value) {
    //     this.setState({
    //       isLoading: false,
    //       suggestions
    //     });
    //   } else {
    //     this.setState({
    //       isLoading: false,
    //       suggestions
    //     });
    //   }
    // });

    this.setState({
      isLoading: true
    });
    //axios.get(address).then(result => {
    axios.get(address).then(result => {
      console.log(value);
      const fetchowane = this.props.reverse
        ? result.data.sort(dynamicSort("name")).reverse()
        : result.data.sort(dynamicSort("name"));
      this.setState({ fetchowane, isLoading: false }, () => {
        this.setState({
          //suggestions: getSuggestions(this.state.fetchowane, value)
          suggestions: getSuggestions(
            this.state.fetchowane,
            value,
            this.props.names
          )
        });
      });
      //this.props.daty(fetchowane);
    });
  }

  onSuggestionsFetchRequested = ({ value }) => {
    // this.setState({
    //   //suggestions: getSuggestions(this.state.fetchowane, value)
    //   suggestions: getSuggestions(this.state.fetchowane, value)
    // });

    console.log("onSuggestionsFetchRequested");
    console.log(value);

    if (value.length === 0 && this.props.startAfter === 0) {
      this.loadSuggestions(value, `/api/table/${this.props.baza}`);
    } else if (value.length > this.props.startAfter) {
      this.loadSuggestions(value, `/api/byname/${this.props.baza}/${value}`);
    }

    // if (value.length <= this.props.startAfter) {
    // } else if (value.length > this.props.startAfter) {
    // }

    // if (value.length >= this.props.startAfter) {
    //   this.loadSuggestions(value, `/api/table/${this.props.baza}`);
    //   //this.props.wybranoLabel("");
    //   //this.props.cancelLabel();
    // } else {
    // }
  };

  onSuggestionsClearRequested = () => {
    console.log("onSuggestionsClearRequested");
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
      error,
      suggestion
      // disabled
    } = this.props;
    const { suggestions, value, single, isLoading } = this.state;

    const inputProps = {
      //autoFocus: focus,
      label: error ? "Wybierz poprawną datę" : isLoading ? "Szukam..." : label,
      placeholder,
      classes,
      value: valueProps,
      //value: value,
      onChange: this.onChange,
      error,
      clearValue: this.clearValue,
      isLoading
    };

    //const nameOfSuggestion = `${suggestion}Suggestion`;

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
        //renderInputComponent={InputSelectTextFieldOld}
        //renderInputComponent={InputComponent}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        shouldRenderSuggestions={shouldRenderSuggestions}
        renderSuggestion={suggestion}
        inputProps={inputProps}
        renderSuggestionsContainer={renderSuggestionsContainer}
        ref={this.storeInputReference}
      />
    );
  }
}

InputSelectBaza.propTypes = {
  classes: PropTypes.object.isRequired,
  startAfter: PropTypes.number,
  suggestion: PropTypes.func,
  names: PropTypes.array
};

InputSelectBaza.defaultProps = {
  //error: false,
  //helperText: "",
  startAfter: 0,
  suggestion: simpleSuggestion,
  names: ["name"]
};

export default withStyles(styles)(InputSelectBaza);
