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
  const { nazwa, adr_Kod, adr_Miejscowosc } = suggestion;
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

class KlienciSearch extends React.Component {
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

  componentDidMount() {
    console.log("city search did mount");
  }

  randomDelay = () => {
    return 300 + Math.random() * 1000;
  };

  loadSuggestions(value) {
    console.log("loadSuggestions");

    this.setState({
      isLoading: true
    });

    setTimeout(() => {
      // const suggestions = getMatchingLanguages(value);

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
      }, 400);
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

  editMiejsceLabel = () => {
    if (this.props.miejsceLabel !== "" && this.state.single === "") {
      return this.props.miejsceLabel;
    } else {
      return this.state.single;
    }
  };

  render() {
    const { classes, value, edytuj, placeholder } = this.props;

    const status = this.state.isLoading ? "Szukam..." : this.props.label;

    const inputProps = {
      classes,
      label: status,
      placeholder: placeholder,
      //value: this.editMiejsceLabel(),
      value: this.state.single,
      onChange: this.handleChange("single"),
      // value: value
      // onChange: event => edytuj(event.target.value)
      onFocus: () => {
        this.setState({ single: this.props.miejsceLabel });
        return this.loadSuggestions(this.props.miejsceLabel);
      }
    };

    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue: this.getSuggestionValue,
      renderSuggestion
    };

    const renderSearchInput = inputProps => (
      <DebounceInput
        element={TextField}
        minLength={1}
        debounceTimeout={400}
        //autoFocus
        // classesName={classes.input}
        {...inputProps}
      />
    );

    return (
      <div className={classes.root}>
        <Autosuggest
          // focusInputOnSuggestionClick={true}
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
