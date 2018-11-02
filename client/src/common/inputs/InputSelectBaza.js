import React from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import { withStyles } from "@material-ui/core/styles";
import { dynamicSort } from "../../common/functions";
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
    isLoading: false,
    pokazujSugestie: true,
    // fetchowane: [{ id: 1, name: "aaa" }, { id: 2, name: "bbb" }]
    fetchowane: [],
    fetchowaneRest: undefined,
    renderRows: 50,
    renderRowsStart: 0,
    offset: 0
    //focus: false
  };

  renderSuggestionsContainer = ({ containerProps, children, query }) => {
    const { suggestions, fetchowane, offset, fetchowaneRest } = this.state;
    const { object } = this.props;
    console.log(fetchowaneRest);
    return (
      <div>
        <div {...containerProps}>
          {children &&
            offset > 0 &&
            !object && (
              <UpDownButton icon={"ExpandLess"} onClick={this.handleUp} />
            )}
          {children}
          {children &&
            fetchowaneRest &&
            !object && (
              <UpDownButton onClick={this.handleDown} icon={"ExpandMore"} />
            )}
        </div>
      </div>
    );
  };

  handleUp = () => {
    console.log("doladuj gore");
    this.changeOffset(-1);
    //this.loadSuggestions(this.state.value, "ddd");
  };

  handleDown = () => {
    console.log("doladuj dol");
    this.changeOffset(1);
    //this.loadSuggestions(this.state.value, "ddd");
    this.suggestions.scrollTo(0, 0);
  };

  changeOffset = async direction => {
    const { offset, fetchowane, value } = this.state;
    const addToState = async () => {
      const fetchedFromDB = await this.props.fetch(
        value,
        offset + 30 * direction
      );
      this.loadSuggestions(value, fetchedFromDB);
      this.setState({ offset: offset + 30 * direction });
    };
    if (fetchowane.length >= 30 && direction === 1) {
      addToState();
    } else if (direction === -1) {
      addToState();
    }
  };

  onChange = (event, { newValue, method }) => {
    if (newValue.length > 4) {
      this.suggestions.scrollTo(0, 300);
      // this.setState({ pos: 50 }, () => {
      //   this.suggestionsRef.scrollTo = this.state.pos;
      // });
    }
    //console.log("onchange");
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
    //console.log(input);
    newValue !== ""
      ? this.setState({ clear: true })
      : this.setState({ clear: false });

    this.props.wybrano(input);
  };

  clearValue = () => {
    this.onSuggestionsClearRequested();
    //console.log("czyszcze pole");
    this.setState({
      value: "",
      clear: false
    });
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
    this.props.startAfter > 0
      ? this.setState({ suggestions: [] })
      : this.loadSuggestions("", `/api/table/${this.props.baza}`);
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
            .splice(0, 30)
            .reverse()
        : fetched.sort(dynamicSort("name")).splice(0, 30);
      fetchowaneRest = this.props.reverse
        ? fetched
            //.sort(dynamicSort("name"))
            .splice(0, 5)
            .reverse()
        : fetched.sort(dynamicSort("name")).splice(0, 5);
    }
    this.setState({
      fetchowane,
      fetchowaneRest,
      isLoading: false,
      suggestions: this.getSuggestions(fetchowane, value, this.props.names)
    });
  };

  getSuggestions = (fetchowane, value, names) => {
    //console.log("getSuggestions");
    //  console.log(fetchowane);
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
    //.splice(this.state.renderRowsStart, this.state.renderRows);
  };

  onSuggestionsFetchRequested = async ({ value }) => {
    console.log(`onSuggestionsFetchRequested value: ${value}`);
    if (this.props.object) {
      this.loadSuggestions(value, this.props.object);
    } else {
      const fetchedFromDB = await this.props.fetch(value, this.state.offset);
      this.loadSuggestions(value, fetchedFromDB);
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
    //console.log(this.suggestions);
    const {
      classes,
      label,
      placeholder,
      value: valueProps,
      error,
      suggestion
      // disabled
    } = this.props;
    const {
      suggestions,
      value,
      single,
      isLoading,
      renderRows,
      renderRowsStart
    } = this.state;

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
      isLoading:
        this.props.isLoading === undefined ? isLoading : this.props.isLoading
    };

    //const nameOfSuggestion = `${suggestion}Suggestion`;
    //console.log(suggestions);

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
  clearOffset: () => {}
  //isLoading: false
};

export default withStyles(styles)(InputSelectBaza);
