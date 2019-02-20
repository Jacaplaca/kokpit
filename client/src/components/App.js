import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";
import { StickyContainer, Sticky } from "react-sticky";

import Register from "./Register";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import MiniDrawer from "./MiniDrawer";
import LinearProgress from "../common/LinearProgress";

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
    //this.props.loading(true);
  }

  render() {
    return (
      <BrowserRouter style={{ height: "100%" }}>
        <div id="app" style={{ height: "100%" }}>
          <StickyContainer style={{ height: "100%" }}>
            <Sticky>
              {({ style }) => (
                <div
                  style={{
                    zIndex: 100,
                    position: "fixed",
                    top: "0px",
                    left: "0px",
                    width: "100%",
                    transform: "translateZ(0px)"
                  }}
                >
                  <LinearProgress />
                </div>
              )}
            </Sticky>
            <MiniDrawer>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/reset" component={ResetPassword} />
            </MiniDrawer>
          </StickyContainer>
        </div>
      </BrowserRouter>
    );
  }
}

export default connect(
  null,
  actions
)(App);
