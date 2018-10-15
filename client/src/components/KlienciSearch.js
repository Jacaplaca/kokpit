import React from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import debounce from "lodash.debounce";
import { withStyles } from "@material-ui/core/styles";

import InputSelectTextField from "../common/inputs/InputSelectTextField";

// https://codepen.io/moroshko/pen/KVaGJE debounceing loading

function renderSuggestionsContainer({ containerProps, children, query }) {
  return <div {...containerProps}>{children}</div>;
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.nazwa, query);
  const parts = parse(suggestion.nazwa, matches);
  const { adr_Kod, adr_Miejscowosc } = suggestion;
  // console.log(suggestion);

  return (
    <MenuItem selected={isHighlighted} component="div" dense>
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
        <span style={{ float: "right" }}>
          <span style={{ fontSize: 15 }}>{adr_Kod} </span>
          <span style={{ fontSize: 15 }}>{adr_Miejscowosc} </span>
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

class KlienciSearch extends React.Component {
  constructor() {
    super();

    this.state = {
      single: "",
      popper: "",
      suggestions: [],
      isLoading: false,
      czysc: false
    };

    this.debouncedLoadSuggestions = debounce(this.loadSuggestions, 400); // 1000ms is chosen for demo purposes only.
  }

  popperNode = null;

  componentDidMount() {
    console.log("city search did mount");
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { single: single_prevState } = prevState;
    const { single } = this.state;

    if (single !== single_prevState && single.length > 0) {
      this.setState({ clear: true });
      //this.props.edytuj("");
      //this.props.wybranoLabel("");
    } else if (single !== single_prevState && single.length === 0) {
      this.setState({ clear: false });
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
    axios.get(`/api/klienci/${value}`).then(result => {
      const suggestions = result.data;
      console.log(suggestions);

      if (value === this.state.value) {
        this.setState({
          isLoading: false,
          suggestions
        });
      } else {
        // Ignore suggestions if input value changed
        this.setState({
          isLoading: false,
          suggestions
        });
      }
    });
  }

  getSuggestionValue = suggestion => {
    const klient = suggestion.nazwa;
    const id = suggestion.id;
    const kod = suggestion.adr_Kod;
    const miejscowosc = suggestion.adr_Miejscowosc;
    // if (this.state.single !== "") {
    // }
    this.props.edytuj(id);
    return `${klient} (${kod} ${miejscowosc})`;
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    console.log("handleSuggestionsFetchRequested");
    console.log(value);
    // if (this.state.single !== "") {
    //   this.loadSuggestions(value);
    //   this.props.cancelLabel();
    // }
    this.loadSuggestions(value);
  };

  handleSuggestionsClearRequested = () => {
    console.log("onSuggestionsClearRequested");
    this.setState({
      suggestions: []
    });
  };

  handleChange = name => (event, { newValue }) => {
    this.setState({
      [name]: newValue
    });
    if (newValue === "") {
      this.props.edytuj("");
    }
  };

  clearValue = () => {
    this.setState({ single: "" });
    this.props.edytuj("");
    this.input.focus();
    this.props.clearLabel();
    this.setState({ single: "" });
  };

  storeInputReference = autosuggest => {
    if (autosuggest !== null) {
      this.input = autosuggest.input;
    }
  };

  editKlientLabel = () => {
    if (this.props.klientLabel !== "") {
      return this.props.klientLabel;
    } else {
      return this.state.single;
    }
  };

  onFocus = () => {
    if (this.state.single === "") {
      this.setState({ single: this.props.miejsceLabel });
    }
    return this.loadSuggestions(this.props.miejsceLabel);
  };

  render() {
    const { classes, placeholder } = this.props;
    //const { single } = this.state;

    const status = this.state.isLoading ? "Szukam..." : this.props.label;

    const inputProps = {
      clearValue: this.clearValue,
      // clear,
      classes,
      label: status,
      placeholder: placeholder,
      //value: this.editMiejsceLabel(),
      value: this.editKlientLabel(),
      onChange: this.handleChange("single"),
      // value: value
      // onChange: event => edytuj(event.target.value)
      onFocus: this.onFocus
    };

    const autosuggestProps = {
      renderInputComponent: InputSelectTextField,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      // onSuggestionsClearRequested: () => console.log("clear"),
      getSuggestionValue: this.getSuggestionValue,
      renderSuggestion,
      renderSuggestionsContainer
    };

    return (
      <div className={classes.root}>
        <Autosuggest
          //alwaysRenderSuggestions
          // focusInputOnSuggestionClick
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
          // renderSuggestionsContainer={options => (
          //   <Paper {...options.containerProps} square>
          //     {/* {options.children} */}
          //   </Paper>
          // )}
          inputProps={inputProps}
          ref={this.storeInputReference}
          // shouldRenderSuggestions={() =>
          //   this.setState({ single: this.props.miejsceLabel })
          // }
        />
      </div>
    );
  }
}

KlienciSearch.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(KlienciSearch);
