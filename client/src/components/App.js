import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "../actions";

import Register from "./Register";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
// import Header from "./Header";
import Landing from "./Landing";
import MiniDrawer from "./MiniDrawer";
// import MiniDrawer2 from "./MiniDrawer2";
import Costs from "./Costs";
import Planer from "./Planer";
import PlanerRaport from "./PlanerRaporty";
// const Dashboard = () => <h2>Dashboard</h2>;
// const SurveyNew = () => <h2>SurveyNew</h2>;

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
