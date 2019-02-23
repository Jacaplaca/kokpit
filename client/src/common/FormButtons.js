import React from "react";
import Key from "@material-ui/icons/VpnKey";
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
        <Key style={{ marginLeft: 10 }} />
      </ButtonMy>
      <ButtonMy
        onClick={cancelAction}
        // type="submit"
        variant="contained"
        color="secondary"
        // disabled={!isValid}
      >
        {cancelLabel}
        <Key style={{ marginLeft: 10 }} />
      </ButtonMy>
    </React.Fragment>
  );
};

export default FormButtons;
