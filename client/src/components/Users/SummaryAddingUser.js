import React, { useState, Component } from "react";
// import { Formik } from "formik";
import Grid from "@material-ui/core/Grid";
// import Paper from "@material-ui/core/Paper";
// import InputComponent from "../common/inputs/InputComponent";
// import InputSelectBaza from "../common/inputs/InputSelectBaza";
// import InputData from "../common/inputs/InputData";
// import axios from "axios";
// import * as Yup from "yup";
// import ButtonMy from "../common/ButtonMy";
// import CitySearch from "./CitiesSearch";
// import NumberFormat from "react-number-format";
// import { formatNumber, cleanNumber, dynamicSort } from "../common/functions";
import FormButtons from "../../common/FormButtons";
import Send from "@material-ui/icons/Send";

class SummaryAddingUser extends Component {
  render() {
    let { report, cancel, send, ok, headline, footer } = this.props;

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

    console.log("SummaryAddingUser()", this.props);
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
              fontWeight: "700",
              marginBottom: 20,
              textAlign: "center"
            }}
          >
            {headline}
          </h6>
          <Grid container spacing={0}>
            <Grid item xs={4}>
              <span
              // style={{ ...styles.summaryTitles }}
              >
                Imię:
              </span>
            </Grid>
            <Grid item xs={8}>
              <span
              // style={{ ...styles.summaryNumbers }}
              >
                {report.name}
              </span>
            </Grid>
            <Grid item xs={4}>
              <span
              // style={{ ...styles.summaryTitles }}
              >
                Nazwisko:
              </span>
            </Grid>
            <Grid item xs={8}>
              <span
              // style={{ ...styles.summaryNumbers }}
              >
                {report.surname}
              </span>
            </Grid>
            <Grid item xs={4}>
              <span
              // style={{ ...styles.summaryTitles }}
              >
                Email:
              </span>
            </Grid>
            <Grid item xs={8}>
              <span
              // style={{ ...styles.summaryNumbers }}
              >
                {report.email}
              </span>
            </Grid>
            <Grid item xs={4}>
              <span
              // style={{ ...styles.summaryTitles }}
              >
                Hasło:
              </span>
            </Grid>
            <Grid item xs={8}>
              <span
              // style={{ ...styles.summaryNumbers }}
              >
                {report.password}
              </span>
            </Grid>
          </Grid>
          <div style={{ marginTop: 30, textAlign: "center" }}>
            <p style={{ fontSize: "0.8em" }}>{footer}</p>
            <FormButtons
              subAction={() => send(report)}
              // subDisable={}
              subLabel={"Wyślij"}
              cancelLabel={"Anuluj"}
              cancelAction={cancel}
            />
          </div>

          {/* {bonusType === "% marży" && (
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
            )} */}
        </div>
        {/* {bonus > 0 && ( */}
        {ok && (
          <div
            style={{
              padding: 10,
              display: "grid",
              background: "rgba(245, 0, 87, 0.63) none repeat scroll 0% 0%",
              borderRadius: 3
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
                  fontWeight: "700",
                  color: "white"
                }}
              >
                Email został wysłany
              </h6>
            </div>
          </div>
        )}

        {/* )} */}
      </div>
    );
  }
}

// SummaryAddingUser.defaultProps = {
//   report: { name: "Antoni" }
//   // label: "Button Text"
// };

SummaryAddingUser.defaultProps = {
  headline: "Konto pracownika zostało założone pomyślnie!",
  footer:
    "Czy chcesz wysłać pracownikowi email z danymi dostępowymi do jego konta?"
};

export default SummaryAddingUser;