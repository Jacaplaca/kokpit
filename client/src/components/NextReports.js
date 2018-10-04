import React from "react";
import PropTypes from "prop-types";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import { withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import * as actions from "../actions";

import SiteHeader from "../common/SiteHeader";
// import LinearProgress from "./LinearProgress";

const styles = theme => ({
  flex: {
    flexGrow: 1
  }
});

class NextReports extends React.Component {
  render() {
    return (
      <div
        style={{
          height: "100%",
          margin: 0
        }}
      >
        <iframe
          // style={{ width: "100%", height: 700 }}
          style={{
            display: "block" /* iframes are inline by default */,
            background: "#000",
            border: "none" /* Reset default border */,
            width: "100%",
            height: "100%"
          }}
          src="http://217.182.72.224:8080/nextreports-server"
        />
        {/* <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "red",
            display: "block"
          }}
        >
          <p>asdfa</p>
        </div> */}
      </div>
    );
  }
}

NextReports.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    actions
  )(NextReports)
);
