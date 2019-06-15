import React from "react";
import { connect } from "react-redux";
// import Key from "@material-ui/icons/VpnKey";
import Send from "@material-ui/icons/Send";
//import Edit from "@material-ui/icons/Edit";
import Cancel from "@material-ui/icons/Clear";
import ButtonMy from "./ButtonMy";
import { getString } from "../translate";

const FormButtons = ({
  subAction,
  subDisable,
  subLabel,
  cancelLabel,
  cancelAction,
  language
}) => {
  return (
    <div>
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
        {cancelLabel ? cancelLabel : getString("CANCEL", language)}
        <Cancel style={{ marginLeft: 10 }} />
      </ButtonMy>
    </div>
  );
};

function mapStateToProps({ language }) {
  return { language };
}

export default connect(
  mapStateToProps,
  null
)(FormButtons);
