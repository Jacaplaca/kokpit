import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
//import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const styles = theme => ({
  input: {
    display: "flex",
    padding: 0
  }
});

class Confirmation extends Component {
  render() {
    const { children, action } = this.props;
    // console.log("confirmatrion, action", action);
    return (
      <Dialog
        //disableBackdropClick
        //disableEscapeKeyDown
        open={this.props.open}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{this.props.komunikat}</DialogTitle>
        <DialogContent>
          {children}
          {/* <DialogContentText>
            To subscribe to this website, please enter your email address
            here. We will send updates occasionally.
          </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={action} variant="contained" color="primary">
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
