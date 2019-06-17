import React, { useState, Component } from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import InputComponent from "../common/inputs/InputComponent";
import InputSelectBaza from "../common/inputs/InputSelectBaza";
import InputData from "../common/inputs/InputData";
import axios from "axios";
import * as Yup from "yup";
import ButtonMy from "../common/ButtonMy";
import CitySearch from "./CitiesSearch";
import NumberFormat from "react-number-format";
import { formatNumber, cleanNumber, dynamicSort } from "../common/functions";
import FormButtons from "../common/FormButtons";
import Send from "@material-ui/icons/Send";
import { getString } from "../translate";

class SerwisSummary extends Component {
  state = {};

  numberFormatProps = () => {
    return {
      displayType: "text",
      thousandSeparator: " ",
      decimalSeparator: this.props.language === "pl" ? "," : ".",
      suffix: ` ${
        this.props.auth.Company.currency ? this.props.auth.Company.currency : ""
      }`
    };
  };

  bonusType = type => {
    if (type === "stawka") {
      return `${getString("TYPE_FLAT_RATE", this.props.language)}: `;
    } else if (type === "% marży") {
      return `${getString("TYPE_MARGIN", this.props.language)}: `;
    }
  };

  bonusUnit = (type, unit) => {
    if (type === "stawka") {
      return (
        <NumberFormat
          {...this.numberFormatProps()}
          value={formatNumber(unit)}
        />
      );
    } else if (type === "% marży") {
      return (
        <NumberFormat
          value={formatNumber(unit * 100)}
          {...this.numberFormatProps()}
        />
      );
    }
  };

  render() {
    let {
      bonus,
      bonusType,
      marginUnit,
      gross,
      grossMargin,
      bonusUnit,
      classes,
      language,
      auth: { Company }
    } = this.props;

    const styles = {
      summaryTitles: {
        fontSize: 14
      },
      summaryNumbers: {
        display: "grid",
        justifyContent: "end",
        fontWeight: "600"
      }
    };

    // console.log("SerwisSummary()", this.props);
    // const bonus = 85.2;
    // const bonusType = "% marży";
    // const marginUnit = 10;
    // const gross = 33;
    // const grossMargin = 10;
    // const bonusUnit = "stawka";
    return (
      <div
        style={{
          display: "grid",
          gridGap: "1rem",
          // grid-template-columns: 1fr 1fr;
          gridTemplateRows: "1fr 75px"
          // grid-template-areas: 1fr
        }}
      >
        <div className={classes.summaryBox}>
          <h6
            style={{
              color: "rgb(64, 64, 64)",
              textTransform: "uppercase",
              fontWeight: "700"
            }}
          >
            {getString("CALCULATORS_FORM_SUMMARY", language)}:
          </h6>
          <Grid container spacing={0}>
            <Grid item xs={7}>
              <span style={{ ...styles.summaryTitles }}>
                {this.bonusType(bonusType)}{" "}
              </span>
            </Grid>
            <Grid item xs={5}>
              <span style={{ ...styles.summaryNumbers }}>
                {this.bonusUnit(bonusType, bonusUnit)}
              </span>
            </Grid>

            {bonusType === "% marży" && (
              <React.Fragment>
                <Grid item xs={7} style={{ ...styles.summaryTitles }}>
                  {getString("CALCULATORS_FORM_MARGIN_SINGLE", language)}:
                </Grid>
                <Grid item xs={5}>
                  <NumberFormat
                    style={{ ...styles.summaryNumbers }}
                    value={formatNumber(marginUnit)}
                    {...this.numberFormatProps()}
                  />
                </Grid>
                <Grid item xs={7} style={{ ...styles.summaryTitles }}>
                  {getString("CALCULATORS_FORM_GROSS", language)}:
                </Grid>
                <Grid item xs={5}>
                  <NumberFormat
                    style={{ ...styles.summaryNumbers }}
                    value={formatNumber(gross)}
                    {...this.numberFormatProps()}
                  />
                </Grid>
                <Grid item xs={7} style={{ ...styles.summaryTitles }}>
                  {getString("CALCULATORS_FORM_GROSS_MARGIN", language)}:
                </Grid>
                <Grid item xs={5}>
                  <NumberFormat
                    style={{ ...styles.summaryNumbers }}
                    value={formatNumber(grossMargin)}
                    {...this.numberFormatProps()}
                  />
                </Grid>
              </React.Fragment>
            )}
          </Grid>
        </div>
        {/* {bonus > 0 && ( */}

        <div className={classes.bonusBox}>
          <div
            container
            spacing={0}
            style={{
              display: "grid",
              gridGap: "1rem",
              gridTemplateColumns: "1fr 2fr",
              color: "white"

              // gridAutoRows: "auto"
              // border: "red solid 1px"
              // gridTemplateRows: "1fr 1fr"
            }}
          >
            <div
              style={{
                alignSelf: "center",
                justifySelf: "center"
              }}
            >
              <h6
                style={{
                  textTransform: "uppercase",
                  fontWeight: "700"
                }}
              >
                {getString("CALCULATORS_FORM_BONUS", language)}:
              </h6>
            </div>
            <h4
              style={{
                alignSelf: "center",
                justifySelf: "center",
                fontWeight: "900"
              }}
            >
              <NumberFormat
                value={formatNumber(bonus)}
                {...this.numberFormatProps()}
              />
            </h4>
          </div>
        </div>
        {/* )} */}
      </div>
    );
  }
}

const styles = theme => ({
  bonusBox: {
    padding: 10,
    display: "grid",
    background: theme.palette.secondary.main,
    borderRadius: 3
  },
  summaryBox: {
    padding: 20,
    background: fade(theme.palette.secondary.main, 0.06)
  }
});

InputComponent.defaultProps = {};

// export default SerwisSummary;

function mapStateToProps({ auth, language }) {
  return {
    language,
    auth
  };
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    null
  )
)(SerwisSummary);

// export default withStyles(styles, { withTheme: true })(SerwisSummary);
