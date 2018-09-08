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

import Confirmation from "./Confirmation";

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

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDelete = id => {
    const url = `/api/akt/remove/${id}`;
    this.setState({ delete: "", open: false });
    fetch(url, {
      method: "POST",
      // body: JSON.stringify({ aa: 'aaa' }),
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin"
    }).then(() => {
      this.props.fetch();
    });
  };

  renderDay = () => {
    const { classes } = this.props;
    return this.props.day.map(day => {
      const { id, kiedy, start, stop } = day;
      return (
        <div key={id}>
          <Confirmation
            open={this.state.open}
            close={this.handleClose}
            delete={() => this.handleDelete(id)}
            komunikat="Czy na pewno chcesz usunąć tę aktywność?"
          />
          <IconButton
            onClick={() => this.handleEdit(id)}
            color="primary"
            className={classes.button}
            aria-label="Add to shopping cart"
          >
            <Edit />
          </IconButton>
          {kiedy} - {start} - {stop} - {timeDiff(start, stop)}
          <IconButton
            className={classes.button}
            aria-label="Delete"
            // onClick={() => this.handleDelete(id)}
            onClick={() => this.setState({ open: true })}
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
