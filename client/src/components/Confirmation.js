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
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const styles = theme => ({
  input: {
    display: "flex",
    padding: 0
  }
});

class Confirmation extends Component {
  render() {
    return (
      <Dialog open={this.props.open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{this.props.komunikat}</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address
            here. We will send updates occasionally.
          </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.props.action}
            variant="contained"
            color="primary"
          >
            Tak
          </Button>
          <Button
            onClick={this.props.close}
            variant="contained"
            color="primary"
          >
            Nie
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

Confirmation.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps
    // actions
  )(Confirmation)
);
