import React, { Component } from "react";
//import RootRef from "@material-ui/core/RootRef";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import classNames from "classnames";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
  buttonRoot: {
    borderRadius: 3,
    //height: 22,
    padding: "0 20px",
    //margin: "10px 10px 0 0 "
    margin: theme.spacing.unit
  },
  buttonMain: {
    background: `linear-gradient(45deg, ${fade(
      theme.palette.secondary.main,
      1
    )} 30%, ${fade(theme.palette.secondary.light, 1)} 90%)`,
    color: "white"
  },
  buttonGray: {
    background: "lightgray"
  },
  label: {
    borderColor: "gray"
  },
  text: {
    height: 4
  }
});

class ButtonMy extends Component {
  //buttonRef = React.createRef();
  // function ButtonMy(props) {
  render() {
    const {
      classes,
      children,
      disabled,
      size,
      style,
      onClick,
      progress,
      submit,
      colorMy,
      type,
      id
      //ref
    } = this.props;

    return (
      <Button
        //ref={this.buttonRef}
        //rootRef={this.buttonRef}
        id={id}
        type={type}
        onClick={onClick}
        //onClick={() => console.log(this.buttonRef)}
        classes={{
          //root: color === "gray" ? classes.buttonGray : classes.buttonRoot,
          root: classNames(
            classes.buttonRoot,
            colorMy === "gray" ? classes.buttonGray : classes.buttonMain
          ),
          label: classes.label,
          text: classes.text // class name, e.g. `classes-nesting-label-x`
        }}
        style={style}
        size={size}
        disabled={disabled ? true : false}
      >
        {children}
        {progress &&
          submit && <CircularProgress size={23} style={{ marginLeft: 10 }} />}
      </Button>
    );
  }
}

ButtonMy.defaultProps = {
  colorMy: "secondary"
};

ButtonMy.propTypes = {
  classes: PropTypes.object.isRequired
};

// export default withStyles(styles, { withTheme: true })(ButtonMy);
function mapStateToProps({ submit }) {
  return { submit };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps
    //actions
  )(ButtonMy)
);
