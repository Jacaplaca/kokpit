import React from "react";
import NumberFormat from "react-number-format";

const SimpleNumberFormat = props => {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        // console.log("SimpleNumberFormat", values);
        // this.setState({ width: 10 + values.value.length * 8 });
        onChange(values.value);
      }}
      decimalSeparator=","
      thousandSeparator=" "
      decimalScale={2}
      // suffix={this.props.suffix ? ` ${this.props.suffix}` : null}
    />
  );
};

export default SimpleNumberFormat;
