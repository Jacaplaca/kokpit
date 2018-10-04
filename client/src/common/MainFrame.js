import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  container: {
    display: "inline-block",
    flexWrap: "nowrap",
    padding: theme.spacing.unit * 3
  }
});

function MainFrame(props) {
  const { classes, children } = props;

  return <div className={classes.container}>{children}</div>;
}

MainFrame.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(MainFrame);
