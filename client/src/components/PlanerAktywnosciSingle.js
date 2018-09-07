import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { startOfMonth, endOfMonth } from "date-fns";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import PropTypes from "prop-types";
import Collapse from "rc-collapse";
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
  }
});

class PlanerAktywnosciSingle extends Component {
  state = {};

  handleEdit = id => {
    this.props.edit(id);
  };
  handleDelete = id => {
    this.props.delete(id);
  };

  renderDay = () => {
    const { classes } = this.props;
    return this.props.day.map(day => {
      const { id, kiedy, start, stop } = day;
      return (
        <div key={id}>
          <IconButton
            onClick={() => this.handleEdit(id)}
            color="primary"
            className={classes.button}
            aria-label="Add to shopping cart"
          >
            <Edit />
          </IconButton>
          {kiedy} - {timeDiff(start, stop)}
          <IconButton
            className={classes.button}
            aria-label="Delete"
            onClick={() => this.handleDelete(id)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      );
    });
  };

  render() {
    const { classes } = this.props;

    return this.renderDay();
  }
}

PlanerAktywnosciSingle.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps
    // actions
  )(PlanerAktywnosciSingle)
);
