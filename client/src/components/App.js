import React, { Component } from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "../actions";

import Register from "./Register";
// import Header from "./Header";
import Landing from "./Landing";
import Login from "./Login";
import MiniDrawer from "./MiniDrawer";
// import MiniDrawer2 from "./MiniDrawer2";
import ResetPassword from "./ResetPassword";
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
      // <MiniDrawer />
      // <div className="container">
      <BrowserRouter>
        <div>
          {/* <div>
            <Link to="/costs">Koszty</Link>
            <Link to="/planer">Planer</Link>
            <Link to="/planerRaporty">Raporty</Link>
          </div> */}
          {/* <Header /> */}
          {/* <MiniDrawer2 /> */}
          <MiniDrawer>
            <Route path="/login" component={Login} />
            {/* <Route exact path="/" component={Landing} /> */}
            <Route path="/register" component={Register} />
            <Route path="/reset" component={ResetPassword} />
            {/* <Route path="/costs" component={Costs} />
            <Route path="/planer" component={Planer} />
            <Route path="/raporty" component={PlanerRaport} /> */}
          </MiniDrawer>
          {/* <Route exact path="/surveys" component={Dashboard} /> */}
          {/* <Route path="/surveys/new" component={SurveyNew} /> */}
          {/* <Route path="/login" component={Login} /> */}
        </div>
      </BrowserRouter>
      // </div>
    );
  }
}

export default connect(
  null,
  actions
)(App);
