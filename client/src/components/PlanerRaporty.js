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
import PlanerRaportyForm from "./PlanerRaportyForm";

const styles = theme => ({
  input: {
    display: "flex",
    padding: 0
  }
});

class PlanerRaporty extends Component {
  render() {
    return <PlanerRaportyForm />;
  }
}

PlanerRaporty.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps
    // actions
  )(PlanerRaporty)
);
