import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Modal from "@material-ui/core/Modal";
import { withStyles } from "@material-ui/core/styles";
import LinearProgress from "../common/LinearProgress";
import * as actions from "../actions";
//import Paper from "@material-ui/core/Paper";

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    width: 30,
    height: 30
  },
  input: {
    display: "none"
  },
  paper: {
    position: "absolute",
    //width: theme.spacing.unit * 50,
    //backgroundColor: theme.palette.background.paper,
    //boxShadow: theme.shadows[5],
    boxShadow: "0 0 150px #111"
    //padding: theme.spacing.unit * 4
  }
});

class ModalWindow extends Component {
  handleOpen = () => {
    this.setState({ openModal: true });
  };

  handleClose = () => {
    this.setState({ openModal: false });
  };

  getModalStyle = () => {
    return {
      maxWidth: this.props.maxWidth,
      width: "100%",
      top: `${50}%`,
      left: `${50}%`,
      transform: `translate(-${50}%, -${50}%)`
    };
  };

  render() {
    const { classes, children, open, close } = this.props;

    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={close}
      >
        <div style={this.getModalStyle()} className={classes.paper}>
          <LinearProgress />
          {children}
        </div>
      </Modal>
    );
  }
}

ModalWindow.propTypes = {
  classes: PropTypes.object.isRequired
};

ModalWindow.defaultProps = {
  maxWidth: 500,
  vertical: 50,
  horizontal: 50
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    actions
  )(ModalWindow)
);
