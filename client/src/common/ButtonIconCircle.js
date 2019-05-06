import React from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";

const styles = theme => ({
  root: {
    height: 30,
    width: 30,
    marginRight: theme.spacing.unit,
    marginTop: theme.spacing.unit / 2,
    marginBottom: theme.spacing.unit / 2,
    // padding: 1,
    "&:hover": {
      background: fade(theme.palette.secondary.light, 0)
    }
  },
  rootSmall: {
    height: 15,
    width: 15,
    marginRight: theme.spacing.unit / 2,
    marginTop: theme.spacing.unit / 3,
    marginBottom: theme.spacing.unit / 3,
    // padding: 1,
    "&:hover": {
      background: fade(theme.palette.secondary.light, 0)
    }
  },
  label: {
    height: 5
  },
  icon: {
    borderRadius: 15,
    padding: 3,
    color: theme.palette.primary.main,
    "&:hover": {
      color: "white",
      background: theme.palette.primary.main
    }
  }
});

function ButtonIconCircle(props) {
  const { classes, children, akcja, title, small } = props;

  return (
    <IconButton
      classes={{
        root: small ? props.classes.rootSmall : props.classes.root, // class name, e.g. `classes-nesting-root-x`
        label: props.classes.label // class name, e.g. `classes-nesting-label-x`
      }}
      aria-label="Delete"
      onClick={akcja}
    >
      <span title={title}>{children}</span>
    </IconButton>
  );
}

// ButtonIconCircle.defaultProps = {
//   height: 30
// };

ButtonIconCircle.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(ButtonIconCircle);
