import React from "react";
import PropTypes from "prop-types";
import { compose } from "redux";

import { withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import * as actions from "../actions";

import MainFrameHOC from "../common/MainFrameHOC";
// import LinearProgress from "./LinearProgress";

const styles = theme => ({
  flex: {
    flexGrow: 1
  }
});
//@MainFrameHOC
class PromowaneProdukty extends React.Component {
  state = {
    checkedA: true,
    checkedB: true
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    //const { classes, theme, auth, open, handleDrawerOpen } = this.props;
    return <div>tabela produktów</div>;
  }
}

PromowaneProdukty.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    actions
  ),
  MainFrameHOC
)(PromowaneProdukty);
