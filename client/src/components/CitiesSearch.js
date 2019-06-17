import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import debounce from "lodash.debounce";
import { withStyles } from "@material-ui/core/styles";

import InputSelectTextField from "../common/inputs/InputSelectTextField";
import { getString } from "../translate";

// https://codepen.io/moroshko/pen/KVaGJE debounceing loading
//z lapa
function renderSuggestionsContainer({ containerProps, children, query }) {
  return <div {...containerProps}>{children}</div>;
}

// function renderSuggestion(suggestion, { query, isHighlighted }) {
//   const matches = match(suggestion.nazwa, query);
//   const parts = parse(suggestion.nazwa, matches);
//   const {
//     gus_terc_woj,
//     gus_terc_pow,
//     gus_terc,
//     cecha,
//     nazwa_1,
//     nazwa_2
//   } = suggestion;
//
//   return (
//     <MenuItem selected={isHighlighted} component="div">
//       <div style={{ display: "block", width: "100%" }}>
//         <span>
//           {parts.map((part, index) => {
//             return part.highlight ? (
//               <span key={String(index)} style={{ fontWeight: 500 }}>
//                 {part.text}
//               </span>
//             ) : (
//               <strong key={String(index)} style={{ fontWeight: 300 }}>
//                 {part.text}
//               </strong>
//             );
//           })}
//         </span>
//         {nazwa_1 && (
//           <span style={{ float: "center" }}>
//             <span style={{ fontSize: 15 }}> {cecha}</span>
//             <span style={{ fontSize: 15 }}>{nazwa_1}</span>
//             <span style={{ fontSize: 15 }}> {nazwa_2}</span>
//           </span>
//         )}
//         <span style={{ float: "right" }}>
//           <span style={{ fontSize: 12 }}>woj.: </span>
//           <span style={{ fontSize: 15 }}>{gus_terc_woj.nazwa} </span>
//           <span style={{ fontSize: 12 }}>pow.: </span>
//           <span style={{ fontSize: 15 }}>{gus_terc_pow.nazwa} </span>
//           <span style={{ fontSize: 12 }}>gmi.: </span>
//           <span style={{ fontSize: 15 }}>{gus_terc.nazwa} </span>
//         </span>
//       </div>
//     </MenuItem>
//   );
// }
function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);

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
      </div>
    </MenuItem>
  );
}

const styles = theme => ({
  root: {
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
});

class CitySearch extends React.Component {
  constructor() {
    super();

    this.state = {
      calaNazwa: "",
      single: "",
      popper: "",
      suggestions: [],
      isLoading: false
    };

    this.debouncedLoadSuggestions = debounce(this.loadSuggestions, 400); // 1000ms is chosen for demo purposes only.
  }

  popperNode = null;

  componentDidMount() {
    // console.log("city search did mount");
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

  componentWillReceiveProps(nextProps) {
    // console.log("klienci search", this.props.value, nextProps.value);
    if (nextProps.value && nextProps.value > 0) {
      this.loadEditedElement(nextProps.value);
    } else if (nextProps.value === 0) {
      this.setState({ single: "" });
    }
  }

  loadEditedElement = id => {
    axios.get(`/api/placesid/${id}`).then(result => {
      const fetched = result.data;
      console.log(fetched);
      this.setState({
        single: fetched.name
      });
    });
  };

  randomDelay = () => {
    return 300 + Math.random() * 1000;
  };

  loadSuggestions(value) {
    console.log("loadSuggestions");

    let url;
    if (this.props.places) {
      url = `/api/places/${value}`;
    } else {
      url = `/api/city/${value}`;
    }

    this.setState({
      isLoading: true
    });

    axios.get(url).then(result => {
      const suggestions = result.data;
      // console.log(suggestions);

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

  // getSuggestionValue = suggestion => {
  //   console.log("get suggestion value");
  //   const miasto = suggestion.nazwa;
  //   const id = suggestion.id;
  //   const cecha = suggestion.cecha ? suggestion.cecha : "";
  //   const nazwa_1 = suggestion.nazwa_1 ? suggestion.nazwa_1 : "";
  //   const nazwa_2 = suggestion.nazwa_2 ? suggestion.nazwa_2 : "";
  //   // if (this.state.single !== "") {
  //   // }
  //   //this.props.test(id);
  //   this.props.edytuj(id);
  //   this.props.wybranoLabel(miasto);
  //   this.setState({ calaNazwa: miasto, clear: true });
  //   console.log(id);
  //   return `${miasto} ${cecha}${nazwa_1} ${nazwa_2}`;
  // };

  getSuggestionValue = suggestion => {
    console.log("get suggestion value");
    const miasto = suggestion.name;
    const id = suggestion.id;
    this.props.edytuj(id);
    this.props.wybranoLabel(miasto);
    this.setState({ calaNazwa: miasto, clear: true });
    console.log(id);
    return `${miasto}`;
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
    // console.log("handleSuggestionsClearRequested");
    this.setState({
      suggestions: []
    });
    //this.props.wybranoLabel("");
    //this.props.edytuj("");
  };

  handleChange = name => (event, { newValue }) => {
    // console.log("handleChange");
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
    // console.log("editMiejsceLabel");
    // if (this.props.miejsceLabel !== "" && this.state.single === "") {
    // if (this.state.single.length < 3) {
    //   this.props.edytuj("");
    //   console.log("kasuj");
    // } else {
    //   console.log("nie kasuj");
    // }

    // console.log(this.state.single.length);
    if (
      this.props.miejsceLabel !== "" &&
      this.props.miejsceLabel !== "cancelLabel"
    ) {
      return this.props.miejsceLabel;
    } else if (this.props.miejsceLabel === "cancelLabel") {
      return "";
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
    const { classes, error, helperText, label, language } = this.props;

    const status = this.state.isLoading
      ? getString("SEARCHING", language)
      : label;

    const inputProps = {
      clearValue: this.clearValue,
      classes,
      label: status,
      placeholder: getString("CITYSEARCH_INPUT", language),
      value: this.editMiejsceLabel(),
      //value: this.state.single,
      //value: this.props.miejsceLabel,
      onChange: this.handleChange("single"),
      // onBlur: () => console.log("on blur")
      // value: value
      // onChange: event => edytuj(event.target.value)
      error,
      helperText
    };

    const autosuggestProps = {
      renderInputComponent: InputSelectTextField,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue: this.getSuggestionValue,
      renderSuggestion,
      renderSuggestionsContainer
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

function mapStateToProps({ language }) {
  return {
    language
  };
}

export default compose(
  withStyles(styles),
  connect(
    mapStateToProps,
    null
  )
)(CitySearch);

// export default withStyles(styles)(CitySearch);
