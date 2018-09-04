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

// https://codepen.io/moroshko/pen/KVaGJE debounceing loading

// const suggestions = [
//   { nazwa: "Afghanistan" },
//   { nazwa: "Aland Islands" },
//   { nazwa: "Albania" },
//   { nazwa: "Algeria" },
//   { nazwa: "American Samoa" },
//   { nazwa: "Andorra" },
//   { nazwa: "Angola" },
//   { nazwa: "Anguilla" },
//   { nazwa: "Antarctica" },
//   { nazwa: "Antigua and Barbuda" },
//   { nazwa: "Argentina" },
//   { nazwa: "Armenia" },
//   { nazwa: "Aruba" },
//   { nazwa: "Australia" },
//   { nazwa: "Austria" },
//   { nazwa: "Azerbaijan" },
//   { nazwa: "Bahamas" },
//   { nazwa: "Bahrain" },
//   { nazwa: "Bangladesh" },
//   { nazwa: "Barbados" },
//   { nazwa: "Belarus" },
//   { nazwa: "Belgium" },
//   { nazwa: "Belize" },
//   { nazwa: "Benin" },
//   { nazwa: "Bermuda" },
//   { nazwa: "Bhutan" },
//   { nazwa: "Bolivia, Plurinational State of" },
//   { nazwa: "Bonaire, Sint Eustatius and Saba" },
//   { nazwa: "Bosnia and Herzegovina" },
//   { nazwa: "Botswana" },
//   { nazwa: "Bouvet Island" },
//   { nazwa: "Brazil" },
//   { nazwa: "British Indian Ocean Territory" },
//   { nazwa: "Brunei Darussalam" }
// ];

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
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
}

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

// function getSuggestions(value) {
//   const inputValue = value.trim().toLowerCase();
//   const inputLength = inputValue.length;
//   let count = 0;
//
//   return inputLength < 3
//     ? []
//     : suggestions.filter(suggestion => {
//         const keep =
//           count < 5 &&
//           suggestion.nazwa.toLowerCase().slice(0, inputLength) === inputValue;
//
//         if (keep) {
//           count += 1;
//         }
//         console.log(keep);
//         return keep;
//       });
// }

function getSuggestionValue(suggestion) {
  // console.log(suggestion);
  const miasto = suggestion.nazwa;
  const cecha = suggestion.cecha ? suggestion.cecha : "";
  const nazwa_1 = suggestion.nazwa_1 ? suggestion.nazwa_1 : "";
  const nazwa_2 = suggestion.nazwa_2 ? suggestion.nazwa_2 : "";
  // return suggestion.nazwa;
  return `${miasto} ${cecha}${nazwa_1} ${nazwa_2}`;
}

const styles = theme => ({
  root: {
    // height: 250,
    width: "100%",
    flexGrow: 1
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
    height: theme.spacing.unit * 2
  }
});

class IntegrationAutosuggest extends React.Component {
  constructor() {
    super();

    this.state = {
      single: "",
      popper: "",
      suggestions: [],
      isLoading: false
    };

    this.debouncedLoadSuggestions = debounce(this.loadSuggestions, 400); // 1000ms is chosen for demo purposes only.
  }

  popperNode = null;

  // state = {
  //   single: "",
  //   popper: "",
  //   suggestions: [],
  //   isLoading: false
  // };

  randomDelay = () => {
    return 300 + Math.random() * 1000;
  };

  loadSuggestions(value) {
    console.log("loadSuggestions");
    // if (this.lastRequestId !== null) {
    //   clearTimeout(this.lastRequestId);
    // }

    this.setState({
      isLoading: true
    });

    // this.lastRequestId = setTimeout(() => {
    //   axios.get(`/api/city/${value}`).then(result => {
    //     const wyniki = result.data;
    //     console.log(wyniki);
    //     this.setState({
    //       isLoading: false,
    //       suggestions: wyniki
    //     });
    //   });
    // }, 400);

    setTimeout(() => {
      // const suggestions = getMatchingLanguages(value);

      axios.get(`/api/city/${value}`).then(result => {
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
      }, 400);
    });
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    console.log("handleSuggestionsFetchRequested");
    console.log(value);
    // this.setState({
    //   suggestions: getSuggestions(value)
    // });
    this.loadSuggestions(value);
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleChange = name => (event, { newValue }) => {
    this.setState({
      [name]: newValue
    });
  };

  render() {
    const { classes } = this.props;

    const status = this.state.isLoading ? "Szukam..." : "Miejscowość";

    const inputProps = {
      classes,
      label: status,
      placeholder: "Zacznij wpisywać miejscowość",
      value: this.state.single,
      onChange: this.handleChange("single")
    };

    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion
    };

    const renderSearchInput = inputProps => (
      <DebounceInput
        element={TextField}
        minLength={1}
        debounceTimeout={400}
        autoFocus
        // classesName={classes.input}
        {...inputProps}
      />
    );

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
          renderInputComponent={renderSearchInput}
        />
      </div>
    );
  }
}

IntegrationAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(IntegrationAutosuggest);
