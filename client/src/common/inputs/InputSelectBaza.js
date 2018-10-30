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
import SuggestionsContainer from "./SuggestionsContainer";
import InputSelectTextField from "../../common/inputs/InputSelectTextField";

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
  suggestionsRef = React.createRef();

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
    fetchowaneBack: [],
    renderRows: 50,
    renderRowsStart: 0
    //focus: false
  };

  renderSuggestionsContainer = ({ containerProps, children, query }) => {
    //this.suggestionsRef.scrollTo = 50;
    //console.log("renderSuggestionsContainer");
    const { suggestions, fetchowane, fetchowaneBack } = this.state;
    const scrolling = event => {
      //console.log(event.nativeEvent);
      if (event.type === "scroll") {
        const height = event.nativeEvent.srcElement.scrollHeight;
        const position = event.nativeEvent.srcElement.scrollTop;
        // console.log(
        //   `height: ${height}, position: ${position}, h-p: ${height -
        //     position}, renderRows: ${this.state.renderRows} fetchLen: ${
        //     this.state.fetchowane.length
        //   } renderRows: ${this.state.renderRows}`
        // );
        //console.log(`offset: ${this.props.offset}, position: ${position}`);
        if (height - position < 301) {
          //console.log("doladuj dol");
          this.props.changeOffset(1);
          this.loadSuggestions(this.state.value, "ddd");
          // console.log(this.suggestions);
        } else if (position === 0 && this.props.offset > 0) {
          //console.log("doladuj gore");
          this.props.changeOffset(-1);
          this.loadSuggestions(this.state.value, "ddd");
        }
      }
    };
    return (
      <div
        // ref={re => (this.second = re)}
        //ref={this.storeSugReference}
        onScroll={scrolling}
        {...containerProps}
        //ref={this.suggestionsRef}
      >
        {children}
      </div>
    );
  };

  onChange = (event, { newValue, method }) => {
    if (newValue.length > 4) {
      //console.log(this.suggestionsRef);
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

  loadSuggestions = async (value, address) => {
    //console.log(`loadSuggestions, value:${value}`);
    this.setState({
      isLoading: true
    });
    let fetchowane;
    // console.log(this.props.object);
    if (this.props.object) {
      //console.log("nie fetchuj");
      //console.log(this.props.object);
      fetchowane = this.props.reverse
        ? this.props.object.sort(dynamicSort("name")).reverse()
        : this.props.object.sort(dynamicSort("name"));
    } else {
      //  console.log("fetchuj i chuj");
      const result = await axios.get(address);
      fetchowane = this.props.reverse
        ? result.data.sort(dynamicSort("name")).reverse()
        : result.data.sort(dynamicSort("name"));
    }
    await this.setState(
      { fetchowane, isLoading: false, fetchowaneBack: fetchowane },
      () => {
        //console.log("loadSuggestions await");
        this.setState({
          suggestions: this.getSuggestions(
            this.state.fetchowane,
            value,
            this.props.names
          )
        });
      }
    );

    //.splice(this.state.renderRowsStart, this.state.renderRows);
  };

  getSuggestions = (fetchowane, value, names) => {
    console.log("getSuggestions");
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

  onSuggestionsFetchRequested = ({ value }) => {
    //console.log(`onSuggestionsFetchRequested value: ${value}`);
    this.loadSuggestions(value, "sdf");
    // if (value.length === 0 && this.props.startAfter === 0) {
    //   this.loadSuggestions(value, `/api/table/${this.props.baza}`);
    // } else if (value.length > this.props.startAfter) {
    //   this.loadSuggestions(value, `/api/byname/${this.props.baza}/${value}`);
    // }
  };

  onSuggestionsClearRequested = () => {
    //  console.log("onSuggestionsClearRequested");
    this.setState(
      {
        suggestions: [],
        renderRows: 50,
        renderRowsStart: 0
      },
      () => this.props.clearOffset()
    );
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
