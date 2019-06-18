import React, { useState, Component } from "react";
import Grid from "@material-ui/core/Grid";
import FormButtons from "../../common/FormButtons";

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
        </div>
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
