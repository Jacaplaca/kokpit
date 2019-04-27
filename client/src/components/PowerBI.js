import React, { Component } from "react";

import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import * as actions from "../actions";
import MainFrameHOC from "../common/MainFrameHOC";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
  input: {
    display: "flex",
    padding: 0
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  }
});

class PowerBI extends Component {
  render() {
    return <Paper>asdfsadf</Paper>;
  }
}

// export default PowerBI;

function mapStateToProps({ auth }) {
  return {
    auth,
    help:
      "Tu możesz dodawać, usuwać oraz edytować użytkowników/pracowników oraz nadawać im uprawnienia do poszczególnych modułów."
  };
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    actions
  ),
  MainFrameHOC
)(PowerBI);
