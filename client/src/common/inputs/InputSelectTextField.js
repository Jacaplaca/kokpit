import React from "react";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import IconCancel from "@material-ui/icons/Clear";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import NumberFormat from "react-number-format";
import CircularProgress from "@material-ui/core/CircularProgress";

function NumberFormatCustom(props) {
  const { inputRef, onChange, name, ...other } = props;

  return (
    <NumberFormat
      {...other}
      name={name}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.formattedValue.replace(/ /g, ""),
            name: name
          }
        });
      }}
      decimalSeparator=","
      thousandSeparator=" "
      decimalScale={2}
      suffix="  zł"
    />
  );
}

const InputSelectTextField = props => {
  const {
    // //value
    // // disabled,
    // clearvalue,
    // kwota,
    // //error,
    // classes,
    inputRef = () => {},
    ref,
    kwota,
    isloading,
    name,
    // isloading,
    ...other
  } = props;
  //console.log(ref);
  // console.log(kwota);

  // const clearButton = () => {
  //   if (inputProps.value !== "" && isloading) {
  //     return (
  //       <CircularProgress size={23} color="red" style={{ marginBottom: 10 }} />
  //     );
  //   } else if (inputProps.value !== "" && !isloading) {
  //     return (
  //       <IconButton onClick={() => clearvalue()}>
  //         <IconCancel />
  //       </IconButton>
  //     );
  //   } else {
  //     <div />;
  //   }
  // };

  const clearButton = () => {
    if (props.value !== "" && isloading) {
      return <CircularProgress size={23} style={{ marginBottom: 10 }} />;
    } else if (props.value !== "" && !isloading) {
      return (
        <IconButton
          onClick={() =>
            props.onChange({ target: { name: props.name, value: "" } })
          }
        >
          <IconCancel />
        </IconButton>
      );
    } else {
      <div />;
    }
  };

  const endAdornment = () => {
    if (props.value.length > 0 && !props.passwordVisibility) {
      return <InputAdornment position="end">{clearButton()}</InputAdornment>;
    } else if (props.value.length > 0 && props.passwordVisibility) {
      return (
        <InputAdornment position="end">
          <IconButton
            aria-label="Toggle password visibility"
            onClick={props.passwordVisibility}
          >
            {props.password ? <VisibilityOff /> : <Visibility />}
          </IconButton>
          {clearButton()}
        </InputAdornment>
      );
    } else {
      return <div />;
    }
  };

  const thisCompInputProps = {
    inputComponent: kwota && NumberFormatCustom,
    endAdornment: endAdornment()
  };

  // const inputProps = {
  //   ...thisCompInputProps,
  //   inputRef: node => {
  //     ref(node);
  //     inputRef(node);
  //   }
  //   // classes: {
  //   //   input: classes.input
  //   // }
  // };
  //let textInput = null;
  return (
    <TextField
      // ref={input => {
      //   textInput = input;
      // }}
      // disabled={disabled ? true : false}
      //error={error ? true : false}
      onClick={node => {
        // console.log("InputSelectTextField");
        // console.log(inputRef);
        // ref && ref(node);
        // inputRef(node);
        //console.log(node);
        // node.focus();
      }}
      InputProps={{
        inputRef: node => {
          //console.log(node);
          //console.log(node.getAttribute("name"));
          //console.log(node.nodeName);
          // console.log(node.name);
          //console.log(inputRef(node));
          ref && ref(node);
          inputRef(node);
          // if (node !== null) {
          //   if (node.name === "email") {
          //     node.focus();
          //   }
          // }
        },
        ...thisCompInputProps
      }}
      //inputRef={textInput}
      {...other}
      name={name}
    />
  );
};

export default InputSelectTextField;
