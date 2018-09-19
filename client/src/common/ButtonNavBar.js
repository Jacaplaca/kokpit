import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import * as actions from "../actions";

const styles = theme => ({
  rootButton: {
    color: "white",
    "&:hover": {
      color: "white"
    }
  },
  hover: {},
  labelButton: {
    borderColor: "gray",
    textAlign: "left"
  }
});

class ButtonNavBar extends React.Component {
  render() {
    const { classes, theme, link, text } = this.props;
    return (
      <Button
        href={link}
        classes={{
          root: classes.rootButton,
          label: classes.labelButton,
          text: classes.textButton // class name, e.g. `classes-nesting-label-x`
        }}
      >
        {text}
      </Button>
    );
  }
}

ButtonNavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    actions
  )(ButtonNavBar)
);
