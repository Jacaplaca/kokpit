import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import * as actions from "../actions";
import ButtonMy from "./ButtonMy";

const LanguageSwitch = ({ languageChange, language }) => {
  return (
    // <span style={{ fontWeight: 800 }}>
    //   {language !== "pl" ? (
    //     <ButtonMy onClick={() => languageChange("pl")}>PL</ButtonMy>
    //   ) : (
    //     <span>PL</span>
    //   )}{" "}
    //   {language !== "en" ? (
    //     <ButtonMy onClick={() => languageChange("en")}>EN</ButtonMy>
    //   ) : (
    //     <span>EN</span>
    //   )}
    // </span>

    <span>
      <ButtonMy
        style={{ fontWeight: language === "pl" ? 800 : 100 }}
        onClick={() => languageChange("pl")}
      >
        PL
      </ButtonMy>
      <ButtonMy
        style={{ fontWeight: language === "en" ? 800 : 100 }}
        onClick={() => languageChange("en")}
      >
        EN
      </ButtonMy>
    </span>
  );
};

function mapStateToProps({ auth, language }) {
  return { auth, language };
}

export default withStyles(null, { withTheme: true })(
  connect(
    mapStateToProps,
    actions
  )(LanguageSwitch)
);
