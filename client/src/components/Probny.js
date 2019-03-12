import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import * as actions from "../actions";

class Probny extends Component {
  componentDidMount() {
    // this.props.fetchUser();
    //this.props.loading(true);
    this.fetching();
  }

  fetching = async () => {
    const res = await axios.get("http://localhost:3000/api/current_user");
    console.log("res".res);
  };

  render() {
    // console.log("auth", this.props.auth);
    return <div>lkasdjf</div>;
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
};

export default connect(
  mapStateToProps,
  actions
)(Probny);
