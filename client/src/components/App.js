import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";
import { StickyContainer, Sticky } from "react-sticky";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
// import DateFnsUtils from "@date-io/date-fns";
import { Provider } from "react-redux";
import MomentUtils from "@date-io/moment";

import Register from "./Register";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import MiniDrawer from "./MiniDrawer";
import LinearProgress from "../common/LinearProgress";

import moment from "moment";
import "moment/locale/pl";

import { createStore, applyMiddleware } from "redux";
// import { composeWithDevTools } from "redux-devtools-extension";
import reduxThunk from "redux-thunk";

import reducers from "../reducers";
import store from "../store";

// const store = createStore(reducers, {}, composeWithDevTools((applyMiddleware(reduxThunk)));
// const store = createStore(
//   reducers,
//   composeWithDevTools(
//     applyMiddleware(reduxThunk)
//     // other store enhancers if any
//   )
// );

// const store = createStore(reducers, applyMiddleware(reduxThunk));

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
    //this.props.loading(true);
  }

  render() {
    // console.log("props", this.props);
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
            <MuiPickersUtilsProvider
              utils={MomentUtils}
              locale={"pl"}
              moment={moment}
            >
              <MiniDrawer>
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/reset" component={ResetPassword} />
              </MiniDrawer>
            </MuiPickersUtilsProvider>
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
