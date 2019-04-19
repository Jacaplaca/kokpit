import React from "react";
import { withStyles } from "@material-ui/core/styles";

const Footer = ({ classes }) => {
  return (
    <div className={classes.root}>
      <div>email: analityka@swiadomafirma.pl</div>
      <div>© ŚWIADOMA FIRMA, 2019</div>
      <div>tel. 507 478 971</div>
      <div style={{ fontSize: 13 }} />
    </div>
  );
};

const styles = theme => ({
  root: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    color: "white",
    overflow: "hidden",
    // position: "fixed" /* Set the navbar to fixed position */,
    // bottom: 0 /* Position the navbar at the top of the page */,
    width: "100%" /* Full width */,
    backgroundColor: theme.palette.primary.main,
    zIndex: theme.zIndex.drawer + 1,
    padding: 5,
    textAlign: "center"
  }
});

export default withStyles(styles, { withTheme: true })(Footer);
