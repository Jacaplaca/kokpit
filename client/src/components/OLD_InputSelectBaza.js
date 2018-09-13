import React from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import TextField from "@material-ui/core/TextField";
//import FormControl from "@material-ui/core/FormControl";
import axios from "axios";
import InputLabel from "@material-ui/core/InputLabel";
//import Select from "@material-ui/core/Select";
import ReactSelect from "react-select";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

// https://codepen.io/moroshko/pen/KVaGJE debounceing loading

const styles = theme => ({
  input: {
    display: "flex"
    //padding: 6
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
    // padding: 33
  },
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  container: {
    display: "inline-block",
    flexWrap: "nowrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
    //width: 200
  },
  formControl: {
    margin: theme.spacing.unit
  },
  label: {
    fontSize: "12px"
  }
});

class InputSelectBaza extends React.Component {
  state = {
    wybrany: "",
    selections: [],
    value: ""
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { value: value_prevState } = prevState;
    const { value } = this.state;
    console.log("input select baza did update");
    console.log(value);
    console.log(this.state);
  }

  componentDidMount() {
    console.log("inpue select baza did mount");
    // axios.get(`/api/table/${this.props.table}`).then(result => {
    //   const selections = result.data;
    //   this.setState({
    //     selections
    //   });
    // });
  }

  // handleChange = event => {
  //   this.setState({ [event.target.name]: event.target.value });
  // };
  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  handleChangeSelect = name => value => {
    // console.log(value);
    this.props.wybrano(value[name]);
    // console.log(name);
    // console.log(value[name]);
    // this.setState({
    //   [name]: value
    // });
  };

  renderSelect = select => {
    // console.log(select);
    const none = { label: "Brak", value: "" };
    const doWyboru = select.map((elem, i) => ({
      label: elem.name,
      value: elem.id
    }));
    //return doWyboru.sort(this.dynamicSort("label"));
    return doWyboru;
  };

  render() {
    const { selectedOption } = this.state;
    const { classes, array } = this.props;
    const components = {
      // Option,
      Control,
      // NoOptionsMessage,
      Placeholder
      //SingleValue,
      //MultiValue,
      //ValueContainer,
      //Menu,
    };
    function inputComponent({ inputRef, ...props }) {
      // console.log({ ...props });
      return <div ref={inputRef} {...props} />;
    }

    function Control(props) {
      console.log(props.selectProps.inputValue);
      return (
        <TextField
          fullWidth
          InputProps={{
            inputComponent,
            inputProps: {
              className: props.selectProps.classes.input,
              inputRef: props.innerRef,
              children: props.children,
              ...props.innerProps
            }
          }}
          //{...props.selectProps.textFieldProps}
          {...props.value}
        />
      );
    }

    function Placeholder(props) {
      return (
        <Typography
          color="textSecondary"
          className={props.selectProps.classes.placeholder}
          {...props.innerProps}
        >
          {props.children}
        </Typography>
      );
    }
    console.log(this.state);
    return (
      <div>
        {/* <InputLabel className={classes.label} htmlFor="age-required">
          Grupa
        </InputLabel> */}
        {/* <NoSsr> */}
        <ReactSelect
          placeholder="Wybierz..."
          name="value"
          components={components}
          classes={classes}
          options={this.renderSelect(array)}
          //value={selectedOption}
          //value={this.props.value}
          onChange={this.handleChangeSelect(this.props.zwracam)}
          inputValue={this.props.initialInput}

          // menuIsOpen
          // onMenuOpen
          // onMenuClose
          // onInputChange
          // defaultValue
          // defaultMenuIsOpen
          // defaultInputValue
        />
      </div>
    );
  }
}

InputSelectBaza.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InputSelectBaza);
