import React from "react";
// import Key from "@material-ui/icons/VpnKey";
import Send from "@material-ui/icons/Send";
//import Edit from "@material-ui/icons/Edit";
import Cancel from "@material-ui/icons/Clear";
import ButtonMy from "./ButtonMy";

const FormButtons = ({
  subAction,
  subDisable,
  subLabel,
  cancelLabel,
  cancelAction
}) => {
  return (
    <React.Fragment>
      <ButtonMy
        // type="submit"
        onClick={subAction}
        variant="contained"
        color="primary"
        disabled={subDisable}
      >
        {subLabel}
        <Send style={{ marginLeft: 10 }} />
      </ButtonMy>
      <ButtonMy
        onClick={cancelAction}
        // type="submit"
        variant="contained"
        color="secondary"
        // disabled={!isValid}
      >
        {cancelLabel}
        <Cancel style={{ marginLeft: 10 }} />
      </ButtonMy>
    </React.Fragment>
  );
};

export default FormButtons;
