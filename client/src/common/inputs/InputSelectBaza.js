import React from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import { withStyles } from "@material-ui/core/styles";
import { dynamicSort, fetchDB, fetchDBall } from "../../common/functions";
import { simpleSuggestion } from "./Suggestions";
import SuggestionsContainer from "./SuggestionsContainer";
import InputSelectTextField from "../../common/inputs/InputSelectTextField";
import UpDownButton from "../UpDownButton";

// https://codepen.io/moroshko/pen/KVaGJE debounceing loading

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSuggestionValue(suggestion) {
  //console.log("getSuggestionValue");
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
  //suggestionsRef = React.createRef();

  state = {
    //error: "Wpisz poprawną datę",
    value: "",
    single: "",
    popper: "",
    suggestions: [],
    isloading: false,
    fetchowane: [],
    fetchowaneRest: null,
    offset: 0
  };

  renderSuggestionsContainer = ({ containerProps, children, query }) => {
    const { suggestions, fetchowane, offset, fetchowaneRest } = this.state;
    const { object } = this.props;
    return (
      <div>
        <div {...containerProps}>
          {children &&
            offset > 0 &&
            !object && (
              <UpDownButton
                icon={"ExpandLess"}
                onClick={() => this.handleUp(query)}
              />
            )}
          {children}
          {children &&
            fetchowaneRest &&
            !object && (
              <UpDownButton
                onClick={() => this.handleDown(query)}
                icon={"ExpandMore"}
              />
            )}
        </div>
      </div>
    );
  };

  handleUp = query => {
    this.changeOffset(-1, query);
  };

  handleDown = query => {
    this.changeOffset(1, query);
    this.suggestions.scrollTo(0, 0);
  };

  changeOffset = async (direction, query) => {
    const { offset, fetchowane } = this.state;
    const addToState = async () => {
      this.setState({ offset: offset + this.props.limit * direction }, () => {
        this.onSuggestionsFetchRequested({ value: query });
      });
    };
    if (fetchowane.length >= this.props.limit && direction === 1) {
      addToState();
    } else if (direction === -1) {
      addToState();
    }
  };

  onChange = (event, { newValue, method }) => {
    if (newValue.length > 4) {
      this.suggestions.scrollTo(0, 300);
    }
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
    newValue !== ""
      ? this.setState({ clear: true })
      : this.setState({ clear: false });

    this.props.wybrano(input);
  };

  loadSuggestions = async (value, fetched) => {
    let fetchowane;
    let fetchowaneRest;
    if (this.props.object) {
      fetchowane = this.props.object;
    } else {
      fetchowane = this.props.reverse
        ? fetched
            //.sort(dynamicSort("name"))
            .splice(0, this.props.limit)
            .reverse()
        : fetched.sort(dynamicSort("name")).splice(0, this.props.limit);
      fetchowaneRest = this.props.reverse
        ? fetched
            //.sort(dynamicSort("name"))
            .splice(0, 1)
            .reverse()
        : fetched.sort(dynamicSort("name")).splice(0, 5);
    }
    this.setState({
      fetchowane,
      fetchowaneRest:
        fetchowaneRest && fetchowaneRest.length === 0 ? null : fetchowaneRest,
      isloading: false,
      suggestions: this.getSuggestions(fetchowane, value, this.props.names)
    });
  };

  getSuggestions = (fetchowane, value, names) => {
    const regex = new RegExp(value.toLowerCase());
    let filtered = [];

    for (let field of names) {
      filtered.push(
        ...fetchowane.filter(suggestion =>
          regex.test(suggestion[field].toLowerCase())
        )
      );
    }
    return filtered.reduce((x, y) => (x.includes(y) ? x : [...x, y]), []);
  };

  onSuggestionsFetchRequested = async ({ value }) => {
    console.log(`onSuggestionsFetchRequested value: ${value}`);
    let fetchedFromDB;
    if (value.length >= this.props.startAfter) {
      // console.log(value);
      if (this.props.object) {
        this.loadSuggestions(value, this.props.object);
      } else {
        this.setState({ isloading: true });
        if (this.props.limit === 999999) {
          fetchedFromDB =
            this.state.fetchowane.length === 0
              ? await fetchDBall(this.props.name)
              : this.state.fetchowane;
        } else {
          fetchedFromDB = await fetchDB(
            value,
            this.state.offset,
            this.props.name,
            this.props.limit
          );
        }
        fetchedFromDB && this.loadSuggestions(value, fetchedFromDB);
      }
    }
  };

  onSuggestionsClearRequested = () => {
    console.log("onSuggestionsClearRequested");
    this.setState({
      suggestions: [],
      offset: 0
    });
  };

  storeInputReference = autosuggest => {
    if (autosuggest !== null) {
      this.input = autosuggest.input;
      this.suggestions = autosuggest.suggestionsContainer;
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
    const { suggestions, value, single, isloading } = this.state;

    const inputProps = {
      //autoFocus: focus,
      label: error ? "Wybierz poprawną datę" : isloading ? "Szukam..." : label,
      placeholder,
      classes,
      value: valueProps,
      //value: value,
      onChange: this.onChange,
      error,
      //clearvalue: this.clearvalue,
      isloading
      // isloading:
      //   this.props.isloading === undefined ? isloading : this.props.isloading
    };

    return (
      <Autosuggest
        // focusInputOnSuggestionClick
        // alwaysRenderSuggestions
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
        //suggestions={suggestions.splice(0, 50)}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        shouldRenderSuggestions={shouldRenderSuggestions}
        renderSuggestion={suggestion}
        inputProps={inputProps}
        renderSuggestionsContainer={this.renderSuggestionsContainer}
        //renderSuggestionsContainer={SuggestionsContainer}
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
  names: ["name"],
  clearOffset: () => {},
  limit: 999999
  //isloading: false
};

export default withStyles(styles)(InputSelectBaza);
