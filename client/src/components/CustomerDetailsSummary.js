import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";

const CustomerDetailsSummary = ({ data, classes }) => {
  console.log("TCL: data", data);
  console.log("style", styles);

  return (
    <Paper style={{ padding: 20, marginTop: "1.3rem" }}>
      <h6 className={classes.head}>Dodano</h6>
      <div>
        <div
          className={`${classes.summaryElement} ${classes.tableHead} ${classes.employee}`}
        >
          Pracownik
        </div>
        <div
          className={`${classes.summaryElement} ${classes.tableHead} ${classes.number}`}
        >
          Sumarycznie
        </div>
        <div
          className={`${classes.summaryElement} ${classes.tableHead} ${classes.number}`}
        >
          W tym miesiącu
        </div>
        <div
          className={`${classes.summaryElement} ${classes.tableHead} ${classes.number}`}
        >
          W porzednim
        </div>
      </div>
      {data.map(user => {
        const { employee, all, prevMonth, thisMonth } = user;
        return (
          <div>
            <div className={`${classes.summaryElement} ${classes.employee}`}>
              {employee}
            </div>
            <div className={`${classes.summaryElement} ${classes.number}`}>
              {all}
            </div>
            <div className={`${classes.summaryElement} ${classes.number}`}>
              {thisMonth}
            </div>
            <div className={`${classes.summaryElement} ${classes.number}`}>
              {prevMonth}
            </div>
          </div>
        );
      })}
    </Paper>
  );
};

CustomerDetailsSummary.propTypes = {};

const styles = theme => ({
  head: { fontSize: "1rem", fontWeight: "600" },
  summaryElement: {
    width: "130px",
    // height: "50px",
    display: "inline-table"
    // fontSize: "33px"
  },
  employee: { width: "200px" },
  number: { textAlign: "center" },
  input: {
    display: "flex",
    padding: 0
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  },
  tableHead: {
    textTransform: "uppercase"
  }
});

export default withStyles(styles, { withTheme: true })(CustomerDetailsSummary);
