import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { lighten, darken } from "@material-ui/core/styles/colorManipulator";

const Footer = ({ classes }) => {
  return (
    <div className={classes.root}>
      <div>email: analityka@uptima.pl</div>
      <div>© Leverage Point Ltd, 2019</div>
      <div>tel. 604 280 499</div>
      <div style={{ fontSize: 13 }} />
    </div>
  );
};

const styles = theme => ({
  root: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    color: theme.palette.grey["400"],
    overflow: "hidden",
    // position: "fixed" /* Set the navbar to fixed position */,
    // bottom: 0 /* Position the navbar at the top of the page */,
    width: "100%" /* Full width */,
    // backgroundColor: theme.palette.primary.main,
    backgroundColor: darken(theme.palette.primary.main, 0.3),
    zIndex: theme.zIndex.drawer + 1,
    padding: 3,
    textAlign: "center",
    fontSize: "0.75em",
    fontWeight: 700
    // opacity: 0.75
    // boxShadow: "0px -15px 10px -15px #111"
  }
});

export default withStyles(styles, { withTheme: true })(Footer);
