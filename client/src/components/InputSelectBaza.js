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

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
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
      {...props.selectProps.textFieldProps}
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

const styles = theme => ({
  input: {
    display: "flex",
    padding: 6
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
  }
});

class InputSelectBaza extends React.Component {
  state = {
    wybrany: "",
    selections: []
  };

  // componentDidMount() {
  //   axios.get(`/api/table/${this.props.table}`).then(result => {
  //     const selections = result.data;
  //     this.setState({
  //       selections
  //     });
  //   });
  // }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeSelect = name => value => {
    this.props.wybrano(value[name]);
    // console.log(name);
    // console.log(value);
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
    const { classes, array } = this.props;

    return (
      <div>
        {/* <InputLabel htmlFor="age-required">Grupa</InputLabel> */}
        {/* <NoSsr> */}
        <ReactSelect
          placeholder="Wybierz..."
          name="groupId"
          components={components}
          classes={classes}
          options={this.renderSelect(array)}
          value={this.state.groupId}
          onChange={this.handleChangeSelect(this.props.zwracam)}
        />
      </div>
    );
  }
}

InputSelectBaza.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InputSelectBaza);
