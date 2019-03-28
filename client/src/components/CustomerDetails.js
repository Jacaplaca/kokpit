import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";

import * as actions from "../actions";
import { dataToString, defineds, dynamicSort } from "../common/functions";
import MainFrameHOC from "../common/MainFrameHOC";
//import SiteHeader from "../common/SiteHeader";

import CustomerForm from "./CustomerDetails/CustomerForm";

const CustomerDetails = () => {
  return <CustomerForm />;
};

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

export default compose(
  withStyles(styles, { withTheme: true }),
  // connect(
  //   mapStateToProps,
  //   actions
  // ),
  MainFrameHOC
)(CustomerDetails);
