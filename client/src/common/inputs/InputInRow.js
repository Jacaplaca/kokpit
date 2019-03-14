import React, { Component } from "react";
import Input from "@material-ui/core/Input";

class InputInRow extends Component {
  componentWillReceiveProps(nextProps) {
    console.log("InputInRow()", nextProps);
  }

  render() {
    return (
      <Input
        inputProps={{ style: { fontSize: 13 } }}
        // style={{ marginTop: 6 }}
        // disableUnderline
        // startAdornment={
        //   <InputAdornment position="start">{`${
        //     field.label
        //   }: `}</InputAdornment>
        // }
        // label={value[field.label]}
        key={"unit"}
        name={"name"}
        // autoFocus={item.id === editedId}
        type="text"
        value={this.props.values["name"]}
        onChange={e => this.props.change("name", e.target.value, "editing")}
      />
    );
  }
}

export default InputInRow;
