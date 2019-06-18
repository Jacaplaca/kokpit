import React from "react";
import { connect } from "react-redux";
import NumberFormat from "react-number-format";
import { formatNumber } from "./functions";

const CurrencyFormat = ({ value, language, auth, nosuffix, style }) => (
  <NumberFormat
    style={style}
    value={formatNumber(value)}
    displayType={"text"}
    thousandSeparator={" "}
    decimalSeparator={language === "pl" ? "," : "."}
    suffix={
      !nosuffix
        ? auth.Company.currency
          ? ` ${auth.Company.currency}`
          : " "
        : ""
    }
  />
);

function mapStateToProps({ language, auth }) {
  return { language, auth };
}

export default connect(
  mapStateToProps,
  null
)(CurrencyFormat);
