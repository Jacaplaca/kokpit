import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";

const styles = theme => ({
  buttonRoot: {
    background: `linear-gradient(45deg, ${fade(
      theme.palette.secondary.main,
      1
    )} 30%, ${fade(theme.palette.secondary.light, 1)} 90%)`,
    borderRadius: 3,
    color: "white",
    height: 22,
    padding: "0 20px"
  },
  label: {
    borderColor: "gray"
  },
  text: {
    height: 4
  }
});

function ButtonMy(props) {
  const { classes, children, disabled, size, style, onClick } = props;

  return (
    <Button
      onClick={onClick}
      classes={{
        root: disabled ? classes.buttonRootDisabled : classes.buttonRoot,
        label: classes.label,
        text: classes.text // class name, e.g. `classes-nesting-label-x`
      }}
      style={style}
      size={size}
      disabled={disabled ? true : false}
    >
      {children}
    </Button>
  );
}

ButtonMy.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(ButtonMy);
