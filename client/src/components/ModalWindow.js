import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { startOfMonth, endOfMonth } from "date-fns";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import PropTypes from "prop-types";
import Collapse from "rc-collapse";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Edit from "@material-ui/icons/Edit";
import Cancel from "@material-ui/icons/Clear";
import { withStyles } from "@material-ui/core/styles";
import { timeDiff } from "../common/functions";
//import Paper from "@material-ui/core/Paper";

const Panel = Collapse.Panel;

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
          {children}
        </div>
      </Modal>
    );
  }
}

ModalWindow.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps
    // actions
  )(ModalWindow)
);
