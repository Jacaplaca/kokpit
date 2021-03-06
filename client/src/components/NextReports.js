import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import * as actions from "../actions";

// import LinearProgress from "./LinearProgress";

const styles = theme => ({
  flex: {
    flexGrow: 1
  }
});

const makeNextReportsLink = auth => {
  const linkFromDB = auth.Company.nextReportsLink;
  const user = auth.nextReports_user;
  const pass = auth.nextReports_pass;
  const fullLink = `${linkFromDB}username=${user}&password=${pass}`;
  console.log(linkFromDB, user, pass, fullLink);
  return fullLink;
};

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
          // src={this.props.auth.Company.nextReportsLink}
          src={makeNextReportsLink(this.props.auth)}
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
