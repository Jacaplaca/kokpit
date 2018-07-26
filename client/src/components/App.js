import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../actions';

import Register from './Register';
import Header from './Header';
import Landing from './Landing';
import Login from './Login';
import MiniDrawer from './MiniDrawer';
import MiniDrawer2 from './MiniDrawer2';
import ResetPassword from './ResetPassword';
// const Dashboard = () => <h2>Dashboard</h2>;
// const SurveyNew = () => <h2>SurveyNew</h2>;

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
    // this.props.fetchForm();
  }

  render() {
    return (
      // <div className="container">
      <BrowserRouter>
        <div>
          <Header />
          <MiniDrawer2 />
          <MiniDrawer>
            <Route path="/login" component={Login} />
            <Route exact path="/" component={Landing} />
            <Route path="/register" component={Register} />
            <Route path="/reset" component={ResetPassword} />
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
