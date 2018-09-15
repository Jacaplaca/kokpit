import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
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
