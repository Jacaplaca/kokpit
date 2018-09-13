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

function renderInputComponent(inputProps) {
  const { error, classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      error={error ? true : false}
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
//
function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);
  const { name } = suggestion;
  console.log("render suggestion");

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
    pokazujSugestie: true
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

  //
  // popperNode = null;
  //
  // componentDidMount() {
  //   console.log("city search did mount");
  // }
  //
  // randomDelay = () => {
  //   return 300 + Math.random() * 1000;
  // };
  //
  // loadSuggestions(value) {
  //   console.log("loadSuggestions");
  //
  //   this.setState({
  //     isLoading: true
  //   });
  //
  //   // axios.get(`/api/dniDoRaportu/${value}`).then(result => {
  //   axios.get(`/api/table/dniDoRaportu`).then(result => {
  //     const suggestions = result.data;
  //     console.log(suggestions);
  //
  //     if (value === this.state.value) {
  //       this.setState({
  //         isLoading: false,
  //         suggestions
  //       });
  //     } else {
  //       // Ignore suggestions if input value changed
  //       this.setState({
  //         isLoading: false,
  //         suggestions
  //       });
  //     }
  //   });
  // }
  //
  // getSuggestionValue = suggestion => {
  //   const { id, name } = suggestion;
  //   // if (this.state.single !== "") {
  //   // }
  //   this.props.edytuj(id);
  //   return `${name}`;
  // };
  //
  // handleSuggestionsFetchRequested = ({ value }) => {
  //   console.log("handleSuggestionsFetchRequested");
  //   console.log(value);
  //   // if (this.state.single !== "") {
  //   //   this.loadSuggestions(value);
  //   //   this.props.cancelLabel();
  //   // }
  //   this.loadSuggestions(value);
  // };
  //
  // handleSuggestionsClearRequested = () => {
  //   console.log("handleSuggestionsClearRequested");
  //   this.setState({
  //     suggestions: []
  //   });
  // };
  //
  // handleChange = name => (event, { newValue }) => {
  //   this.setState({
  //     [name]: newValue
  //   });
  // };
  //
  // editMiejsceLabel = () => {
  //   if (this.props.miejsceLabel !== "" && this.state.single === "") {
  //     return this.props.miejsceLabel;
  //   } else {
  //     return this.state.single;
  //   }
  // };

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
    this.props.edytuj(newValue);
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

  render() {
    const {
      classes,
      label,
      placeholder,
      value: valueProps,
      error
    } = this.props;
    const { value, suggestions } = this.state;
    const inputProps = {
      label: error ? "Wybierz poprawną datę" : label,
      placeholder,
      classes,
      value: valueProps,
      onChange: this.onChange,
      error
    };

    return (
      <Autosuggest
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
        renderInputComponent={renderInputComponent}
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        shouldRenderSuggestions={shouldRenderSuggestions}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
  }

  // render() {
  //   const { classes, value, edytuj, placeholder } = this.props;
  //
  //   const status = this.state.isLoading ? "Szukam..." : this.props.label;
  //
  //   const inputProps = {
  //     classes,
  //     label: status,
  //     placeholder: placeholder,
  //     //value: this.editMiejsceLabel(),
  //     value: this.state.single,
  //     onChange: this.handleChange("single"),
  //     onBlur: () => {
  //       console.log("onblur");
  //       this.setState({ pokazujSugestie: false });
  //     }
  //     // value: value
  //     // onChange: event => edytuj(event.target.value)
  //     // onFocus: () => {
  //     //   console.log("focusuje na kiedy");
  //     //   console.log(this.props.value);
  //     //   // this.setState({ single: this.props.miejsceLabel });
  //     //   // return this.loadSuggestions(this.props.miejsceLabel);
  //     //   // this.loadSuggestions(this.props.value);
  //     //   // return renderSuggestion(this.state.suggestions, {});
  //     //   return this.setState({ pokazujSugestie: false });
  //     // }
  //   };
  //
  //   const autosuggestProps = {
  //     renderInputComponent,
  //     suggestions: this.state.suggestions,
  //     onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
  //     onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
  //     getSuggestionValue: this.getSuggestionValue,
  //     renderSuggestion
  //   };
  //
  //   return (
  //     <div className={classes.root}>
  //       <Autosuggest
  //         // focusInputOnSuggestionClick={true}
  //         {...autosuggestProps}
  //         // inputProps={{
  //         //   classes,
  //         //   label: "Miejscowość",
  //         //   placeholder: "Zacznij wpisywać miejscowość",
  //         //   value: this.state.single,
  //         //   onChange: this.handleChange("single")
  //         // }}
  //         //alwaysRenderSuggestions={this.state.pokazujSugestie}
  //         // focusInputOnSuggestionClick
  //         theme={{
  //           // renderInputComponent: classes.root,
  //           container: classes.container,
  //           suggestionsContainerOpen: classes.suggestionsContainerOpen,
  //           suggestionsList: classes.suggestionsList,
  //           suggestion: classes.suggestion
  //         }}
  //         renderSuggestionsContainer={options => (
  //           <Paper {...options.containerProps} square>
  //             {options.children}
  //           </Paper>
  //         )}
  //         inputProps={inputProps}
  //         //renderInputComponent={renderSearchInput}
  //         // shouldRenderSuggestions={() =>
  //         //   this.setState({ single: this.props.miejsceLabel })
  //         // }
  //       />
  //     </div>
  //   );
  // }
}

InputSelectBaza.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InputSelectBaza);
