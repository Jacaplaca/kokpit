import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { getString } from "../translate";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: "100%",
    textTransform: "uppercase",
    opacity: "0.75",
    marginBottom: 20
  },
  text: {
    fontSize: 30,
    fontWeight: "300"
  }
});

function SiteHeader(props) {
  const { classes, text, align, language } = props;
  console.log("SiteHeader", props);
  return (
    <div className={classes.root}>
      <Typography
        variant="display1"
        gutterBottom
        align={align}
        classes={{
          //root: classes.rootButton,
          //label: classes.labelButton,
          display1: classes.text // class name, e.g. `classes-nesting-label-x`
        }}
      >
        {/* {text} */}
        {text}
      </Typography>
    </div>
  );
}

SiteHeader.propTypes = {
  classes: PropTypes.object.isRequired
};

SiteHeader.defaultProps = {
  align: "left"
};

const mapStateToProps = ({ language }) => {
  return { language };
};

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    null
  )(SiteHeader)
);

// export default withStyles(styles, { withTheme: true })(SiteHeader);
