import React, { useState, Component } from "react";
import { Formik } from "formik";
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

class SerwisSummary extends Component {
  state = {};

  bonusType = type => {
    if (type === "stawka") {
      return "Stawka: ";
    } else if (type === "% marży") {
      return "% marży: ";
    }
  };

  bonusUnit = (type, unit) => {
    if (type === "stawka") {
      return (
        <NumberFormat
          value={formatNumber(unit)}
          displayType={"text"}
          thousandSeparator={" "}
          decimalSeparator={","}
          suffix={" zł"}
        />
      );
    } else if (type === "% marży") {
      return (
        <NumberFormat
          value={formatNumber(unit * 100)}
          displayType={"text"}
          thousandSeparator={" "}
          decimalSeparator={","}
          suffix={"%"}
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
      bonusUnit
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

    console.log("SerwisSummary()", this.props);
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
        <div
          style={{
            padding: 20,
            background: "rgba(245, 0, 87, 0.06) none repeat scroll 0% 0%",
            borderRadius: 3
          }}
        >
          <h6
            style={{
              color: "rgb(64, 64, 64)",
              textTransform: "uppercase",
              fontWeight: "700"
            }}
          >
            Podsumowanie:
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
                  Marża jednostkowa:
                </Grid>
                <Grid item xs={5}>
                  <NumberFormat
                    style={{ ...styles.summaryNumbers }}
                    value={formatNumber(marginUnit)}
                    displayType={"text"}
                    thousandSeparator={" "}
                    decimalSeparator={","}
                    suffix={" zł"}
                  />
                </Grid>
                <Grid item xs={7} style={{ ...styles.summaryTitles }}>
                  Wartość brutto:
                </Grid>
                <Grid item xs={5}>
                  <NumberFormat
                    style={{ ...styles.summaryNumbers }}
                    value={formatNumber(gross)}
                    displayType={"text"}
                    thousandSeparator={" "}
                    decimalSeparator={","}
                    suffix={" zł"}
                  />
                </Grid>
                <Grid item xs={7} style={{ ...styles.summaryTitles }}>
                  Marża brutto:
                </Grid>
                <Grid item xs={5}>
                  <NumberFormat
                    style={{ ...styles.summaryNumbers }}
                    value={formatNumber(grossMargin)}
                    displayType={"text"}
                    thousandSeparator={" "}
                    decimalSeparator={","}
                    suffix={" zł"}
                  />
                </Grid>
              </React.Fragment>
            )}
          </Grid>
        </div>
        {/* {bonus > 0 && ( */}

        <div
          style={{
            padding: 10,
            display: "grid",
            background: "rgba(245, 0, 87, 0.63) none repeat scroll 0% 0%",
            borderRadius: 3
          }}
        >
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
                Premia:
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
                displayType={"text"}
                thousandSeparator={" "}
                decimalSeparator={","}
                suffix={" zł"}
              />
            </h4>
          </div>
        </div>
        {/* )} */}
      </div>
    );
  }
}

InputComponent.defaultProps = {};

export default SerwisSummary;
