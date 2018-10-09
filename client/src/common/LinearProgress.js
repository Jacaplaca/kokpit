import React from "react";
import PropTypes from "prop-types";
import LinearProgress from "@material-ui/core/LinearProgress";
import { connect } from "react-redux";

function LinearIndeterminate({ loading }) {
  return <div>{loading && <LinearProgress />}</div>;
}

LinearIndeterminate.propTypes = {
  loading: PropTypes.bool.isRequired
};

function mapStateToProps({ loading }) {
  return { loading };
}

export default connect(mapStateToProps)(LinearIndeterminate);
