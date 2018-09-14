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
import { withStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import IconCancel from "@material-ui/icons/Clear";

import InputSelectTextField from "./InputSelectTextField";

// https://codepen.io/moroshko/pen/KVaGJE debounceing loading

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.nazwa, query);
  const parts = parse(suggestion.nazwa, matches);
  const {
    gus_terc_woj,
    gus_terc_pow,
    gus_terc,
    cecha,
    nazwa_1,
    nazwa_2
  } = suggestion;
  // console.log(suggestion);

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
        {nazwa_1 && (
          <span style={{ float: "center" }}>
            <span style={{ fontSize: 15 }}> {cecha}</span>
            <span style={{ fontSize: 15 }}>{nazwa_1}</span>
            <span style={{ fontSize: 15 }}> {nazwa_2}</span>
          </span>
        )}
        <span style={{ float: "right" }}>
          <span style={{ fontSize: 12 }}>woj.: </span>
          <span style={{ fontSize: 15 }}>{gus_terc_woj.nazwa} </span>
          <span style={{ fontSize: 12 }}>pow.: </span>
          <span style={{ fontSize: 15 }}>{gus_terc_pow.nazwa} </span>
          <span style={{ fontSize: 12 }}>gmi.: </span>
          <span style={{ fontSize: 15 }}>{gus_terc.nazwa} </span>
        </span>
      </div>
      {/* <span>{gmina}</span> */}
    </MenuItem>
  );
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
    right: 0
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

class CitySearch extends React.Component {
  constructor() {
    super();

    this.state = {
      calaNazwa: "",
      single: "",
      popper: "",
      suggestions: [],
      isLoading: false,
      clear: false
    };

    this.debouncedLoadSuggestions = debounce(this.loadSuggestions, 400); // 1000ms is chosen for demo purposes only.
  }

  popperNode = null;

  componentDidMount() {
    console.log("city search did mount");
    const { miejsceLabel } = this.props;
    miejsceLabel !== "" && this.setState({ clear: true });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { single: single_prevState } = prevState;
    const { single } = this.state;

    if (single !== single_prevState && single.length < 3) {
      this.props.edytuj("");
      this.props.wybranoLabel("");
    }
  }

  randomDelay = () => {
    return 300 + Math.random() * 1000;
  };

  loadSuggestions(value) {
    console.log("loadSuggestions");

    this.setState({
      isLoading: true
    });

    axios.get(`/api/city/${value}`).then(result => {
      const suggestions = result.data;

      if (value === this.state.value) {
        this.setState({
          isLoading: false,
          suggestions
        });
      } else {
        this.setState({
          isLoading: false,
          suggestions
        });
      }
    });
  }

  getSuggestionValue = suggestion => {
    console.log("get suggestion value");
    const miasto = suggestion.nazwa;
    const id = suggestion.id;
    const cecha = suggestion.cecha ? suggestion.cecha : "";
    const nazwa_1 = suggestion.nazwa_1 ? suggestion.nazwa_1 : "";
    const nazwa_2 = suggestion.nazwa_2 ? suggestion.nazwa_2 : "";
    // if (this.state.single !== "") {
    // }
    this.props.test(id);
    this.props.edytuj(id);
    this.props.wybranoLabel(miasto);
    this.setState({ calaNazwa: miasto, clear: true });
    console.log(id);
    return `${miasto} ${cecha}${nazwa_1} ${nazwa_2}`;
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    console.log("handleSuggestionsFetchRequested");
    console.log(value);
    if (this.state.single !== "") {
      this.loadSuggestions(value);
      this.props.wybranoLabel("");
      //this.props.cancelLabel();
    }
  };

  handleSuggestionsClearRequested = () => {
    console.log("handleSuggestionsClearRequested");
    this.setState({
      suggestions: []
    });
    //this.props.wybranoLabel("");
    //this.props.edytuj("");
  };

  handleChange = name => (event, { newValue }) => {
    console.log("handleChange");
    this.setState({
      [name]: newValue
    });
    newValue !== ""
      ? this.setState({ clear: true })
      : this.setState({ clear: false });
    // if (newValue.lenght < 3) {
    //   console.log("kasuj");
    //   this.props.edytuj("");
    // }
  };

  clearValue = () => {
    this.setState({ single: "", clear: false });
    this.props.edytuj("");
    this.props.wybranoLabel("");
    this.input.focus();
  };

  editMiejsceLabel = () => {
    console.log("editMiejsceLabel");
    // if (this.props.miejsceLabel !== "" && this.state.single === "") {
    // if (this.state.single.length < 3) {
    //   this.props.edytuj("");
    //   console.log("kasuj");
    // } else {
    //   console.log("nie kasuj");
    // }

    console.log(this.state.single.length);
    if (this.props.miejsceLabel !== "") {
      return this.props.miejsceLabel;
    } else {
      return this.state.single;
    }
  };

  storeInputReference = autosuggest => {
    if (autosuggest !== null) {
      this.input = autosuggest.input;
    }
  };

  render() {
    const { classes, value, edytuj } = this.props;
    const { clear } = this.state;

    const status = this.state.isLoading ? "Szukam..." : "Miejscowość";

    const inputProps = {
      clearValue: this.clearValue,
      clear,
      classes,
      label: status,
      placeholder: "Zacznij wpisywać miejscowość",
      value: this.editMiejsceLabel(),
      //value: this.state.single,
      //value: this.props.miejsceLabel,
      onChange: this.handleChange("single")
      // onBlur: () => console.log("on blur")
      // value: value
      // onChange: event => edytuj(event.target.value)
    };

    const autosuggestProps = {
      renderInputComponent: InputSelectTextField,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue: this.getSuggestionValue,
      renderSuggestion
    };

    return (
      <div className={classes.root}>
        <Autosuggest
          {...autosuggestProps}
          // inputProps={{
          //   classes,
          //   label: "Miejscowość",
          //   placeholder: "Zacznij wpisywać miejscowość",
          //   value: this.state.single,
          //   onChange: this.handleChange("single")
          // }}
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
          inputProps={inputProps}
          ref={this.storeInputReference}
          //renderInputComponent={renderSearchInput}
        />
      </div>
    );
  }
}

CitySearch.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CitySearch);
