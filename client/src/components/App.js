import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "../actions";

import Register from "./Register";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import MiniDrawer from "./MiniDrawer";

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
    // this.props.fetchForm();
  }

  render() {
    return (
      <BrowserRouter>
        <MiniDrawer>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/reset" component={ResetPassword} />
        </MiniDrawer>
      </BrowserRouter>
    );
  }
}

export default connect(
  null,
  actions
)(App);
