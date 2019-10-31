import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";
import { StickyContainer, Sticky } from "react-sticky";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
// import DateFnsUtils from "@date-io/date-fns";
import { Provider } from "react-redux";
import MomentUtils from "@date-io/moment";

// import Register from "./Register";
// import Login from "./Login";
// import ResetPassword from "./ResetPassword";
//neikom z edge
// import MiniDrawer from "./MiniDrawer";
//
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


  state = {
    edge: false,
    module: null
  };

  componentDidMount() {
    this.checkBrowser();
    this.props.fetchUser();
    this.props.fetchModules();


    let language = localStorage.getItem("language");
    console.log("cookies lan", language);

    if (!language) {
      localStorage.setItem("language", "pl");
      language = "pl";
    } else {
      // localStorage.setItem("language", action.payload);
      // language = action.payload;
      this.props.languageChange(language);
    }

    document.title = `Świadoma Firma - Kokpit`;
    // console.log("auth", this.props);
    //this.props.loading(true);
  }

  checkBrowser = () => {
    var isIE = /*@cc_on!@*/ false || !!document.documentMode;
    var isEdge = !isIE && !!window.StyleMedia;
    console.log("det", isIE, isEdge);
    if (isIE || isEdge) {
      this.setState({ edge: true });
    } else {
      const path = "./Drawer.js"
      import(`${path}`)
        .then(module => this.setState({ module: module.default }))
    }
  };

  render() {
    // console.log("props", this.props);
    // const Drawer = import('./Drawer')
    const { module: Component } = this.state;
    return (
      this.state.edge ? <div style={{ backgroundColor: 'black', height: "100%", padding: 50 }}><div style={{
        padding: 15, textAlign: 'left', maxWidth: 800,
        border: '1px solid red', margin: '0 auto', borderRadius: 5, backgroundColor: 'white'
      }}><h4>Uwaga! Wykryto przeglądarkę <span style={{ color: 'red' }}>Edge lub Microsoft Internet Explorer</span></h4><p>Ze względu na aktualizację serwera mogą wystąpić problemy z tymi przeglądarkami. Na czas korzystania z aplikacji Kokpit prosimy przełączyć się na <strong>Chrome bądź Firefox</strong>. Dziękujemy i przepraszamy za kłopot.</p><p style={{ fontStyle: "italic" }}>Pracujemy nad rozwiązaniem problemu - Świadoma
        Firma</p></div></div> : (
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
                  {Component && <Component />}
                  {/* <MiniDrawer>
                    <Route
                      path="/login"
                      component={Login}
                    />
                    <Route path="/register" component={Register} />
                    <Route path="/reset" component={ResetPassword} />
                  </MiniDrawer> */}
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
        )

    );
  }
}

function mapStateToProps({ auth }) {
  return {
    auth
  };
}

export default connect(
  mapStateToProps,
  actions
)(App);
