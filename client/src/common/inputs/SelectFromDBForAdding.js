import React, { Component } from "react";
import PropTypes from "prop-types";
import InputSelectBaza from "../../common/inputs/InputSelectBaza";

class SelectFromDBForAdding extends Component {
  state = { id: 0, name: "" };

  handleChange = value => {
    const { id, name } = value;
    // console.log("handleChange", value);
    const oldState = this.state;
    const showAdd = id === 0;
    this.props.showAdd(showAdd, name, id);
    this.setState({ id, name }, () => this.handleUpdate(oldState));
  };
  //
  handleUpdate = prevState => {
    // console.log("oldState", prevState);
    // this.setState({  });
  };

  // componentWillReceiveProps = nextProps => {
  //   console.log("channels receive props");
  //   const { insertedId } = nextProps;
  //   if (this.props.insertedId !== insertedId) {
  //     this.setState({ id: insertedId });
  //   }
  // };

  render() {
    const { label, list, disabled } = this.props;
    return (
      <InputSelectBaza
        disabled={disabled}
        wybrano={value => {
          value && this.handleChange(value);
        }}
        edytuj={name => {
          // this.setState({ name, id: 0 });
          this.handleChange({ name, id: 0 });
        }}
        czysc={() => this.handleChange({ id: 0, name: "" })}
        value={this.state.name}
        daty={daty => console.log("daty", daty)}
        label={`Wybierz lub dodaj ${label}`}
        // placeholder="Kanał sprzedaży"
        przeszukuje={list}
      />
    );
  }
}

// SelectFromDBForAdding.defaultProps = {
//   // error: false,
//   // helperText: "",
//   // number: false,
//   // format: "standard",
//   // disabled: false
//   // label:
// };

SelectFromDBForAdding.propTypes = {
  label: PropTypes.string.isRequired,
  list: PropTypes.string.isRequired || PropTypes.object.isRequired
};

export default SelectFromDBForAdding;
