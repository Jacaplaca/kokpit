import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";

import * as actions from "../actions";
import { dataToString, defineds, dynamicSort } from "../common/functions";
import MainFrameHOC from "../common/MainFrameHOC";
//import SiteHeader from "../common/SiteHeader";

import CustomerForm from "./CustomerDetails/CustomerForm";

class CustomerDetails extends Component {
  state = {
    details: null
  };

  componentWillMount() {
    this.fetching();
  }

  fetching = async () => {
    const data = await axios.get("/api/customerdetail/");
    const details = data.data;
    await this.setAsyncState({ details });
  };

  setAsyncState = newState =>
    new Promise(resolve => this.setState(newState, () => resolve()));

  render() {
    return (
      <div>
        <CustomerForm />;
      </div>
    );
  }
}

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
