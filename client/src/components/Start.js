import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import MainFrameHOC from "../common/MainFrameHOC";
import axios from "axios";
import * as actions from "../actions";

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

class Start extends Component {
  // componentDidMount() {
  //   // this.props.fetchUser();
  //   //this.props.loading(true);
  //   // this.fetching();
  // }

  // fetching = async () => {
  //   const res = await axios.get("http://localhost:3000/api/current_user");
  //   console.log("res".res);
  // };

  render() {
    // console.log("auth", this.props.auth);
    return <div>lkasdjf</div>;
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    actions
  ),
  MainFrameHOC
)(Start);
