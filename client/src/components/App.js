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
import Footer from "../common/Footer";

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
    document.title = `Świadoma Firma - Kokpit`;
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
                {/* <div
                // style={{ position: "absolute" }}
                >
                  asdfla klo Expetendis ne deserunt. Se elit amet ubi ingeniis,
                  amet litteris sed esse tempor, quae in ingeniis et magna, quo
                  sint quem nulla probant. Culpa ita aliquip, export aut
                  voluptate, sed cillum aute iis nostrud, litteris quorum
                  appellat ab ita litteris instituendarum ut ne iis nulla
                  ullamco ad de nostrud graviterque, laboris aut doctrina.Ne quo
                  philosophari, aliquip id aute possumus. Constias quae duis
                  voluptate enim est ad a illum ipsum eram, ipsum voluptatibus
                  expetendis quis mandaremus a quo in imitarentur non ne nisi
                  irure duis quibusdam, velit offendit ab praesentibus quo id
                  fugiat quamquam comprehenderit, ea id fore minim fugiat. Ex
                  illum admodum qui incididunt anim veniam admodum quis.
                  Deserunt dolor eiusmod ut amet ubi laborum, incurreret tamen
                  esse offendit quis, ne in quid sunt dolor in esse possumus ut
                  illustriora o incididunt id arbitror do et malis deserunt non
                  arbitror an offendit.
                </div> */}
              </MiniDrawer>
            </MuiPickersUtilsProvider>

            <div
              style={{
                zIndex: 100,
                position: "fixed",
                bottom: 0,
                left: "0px",
                width: "100%",
                transform: "translateZ(0px)"
              }}
            >
              <Footer />
              {/* <div>alskdjflsakdj flasdkfj laskdf</div> */}
            </div>
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
