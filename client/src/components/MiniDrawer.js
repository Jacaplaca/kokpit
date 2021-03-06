import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { compose } from "redux";
import { connect } from "react-redux";
import * as actions from "../actions";

import { BrowserRouter, Route } from "react-router-dom";
import TopNavBar from "../common/TopNavBar";

//nikompatybilne z edge
import DrawerMy from "../common/DrawerMy";
import routes from "./Routes/routes";
//

import Login from "./Login";
import MyComponent from "./Routes/MyComponent";
import Footer from "../common/Footer";

let drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: "100%",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex"
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default
    //padding: theme.spacing.unit * 3
  }
});

// class MyComponent extends Component {
//   render() {
//     const TagName = this.props.component;
//     return <TagName title={this.props.title} channel={this.props.channel} />;
//   }
// }

class MiniDrawer extends React.Component {
  state = {
    open: true,
    startModule: {}
  };

  checkStartComp = ({ start_comp, UserModule }) => {
    // console.log("startComp", start_comp, UserModule);
    let startModule;
    let routeStart;
    if (UserModule.length === 0) {
      startModule = { name: "Start" };
      routeStart = routes[0];
    } else {
      const startComp = UserModule.filter(x => x.id === start_comp);
      startModule = startComp.length > 0 ? startComp[0] : UserModule[0];
      const route = routes.filter(x => x.comp === startModule.comp);
      routeStart = route.length > 0 ? route[0] : routes[0];
    }

    return (
      <MyComponent title={startModule.name} component={routeStart.component} />
    );
  };

  componentDidMount = () => {
    drawerWidth = this.props.auth !== false ? 240 : 0;
    console.log("minidrawer", this.props.auth);
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleClickWhere = where => {
    this.props.clicked(where);
  };

  compAllowed = (comps, id, comp) => {
    // console.log(
    //   "comps comp",
    //   comps,
    //   id,
    //   comp,
    //   comps.filter(x => x.id === id).length
    // );
    return comps.filter(x => x.id === id).length > 0;
  };

  render() {
    // console.log("minidrawer render");
    const { classes, theme, auth, modules, language } = this.props;

    const switchLang = title => {
      switch (language) {
        case "pl":
          return title.name;
        case "en":
          return title.name_en;
        default:
          return title.name;
      }
    };

    return (
      <BrowserRouter>
        <div className={classes.root} id="classesRoot">
          {/* <Footer /> */}

          <TopNavBar
            open={this.state.open}
            handleDrawerOpen={this.handleDrawerOpen}
          />
          <DrawerMy
            open={this.state.open}
            handleDrawerClose={this.handleDrawerClose}
          />
          <main className={classes.content}>
            <div className={classes.toolbar} id="classToolbar" />
            {!auth ? (
              <Route path="/" exact component={Login} />
            ) : (
                <Route
                  path="/"
                  exact
                  // render={() => <Invoices title="Zaległe faktury" />}
                  render={() => this.checkStartComp(auth)}
                />
              )}
            {auth &&
              routes.map((route, i) => {
                let titles = ['Sample']
                const { comp, path, component, open, id, parrentId } = route;
                if (Array.isArray(modules)) {
                  titles = modules.filter(x => x.id === id);
                }
                const moduleTitle = titles[0] ? switchLang(titles[0]) : "";
                // const moduleTitle = titles[0] ? titles[0].name : "";
                // console.log("route", comp, path);
                // const titlesFromDb = auth.UserModule.filter(x => x.id === id);
                // console.log("auth", path, id, comp, titlesFromDb);
                // const titleFromDb = titlesFromDb[0] ? titlesFromDb[0].name : "";
                return (auth &&
                  this.compAllowed(auth.UserModule, parrentId, comp)) ||
                  open ? (
                    <Route
                      key={i}
                      path={path}
                      render={() => (
                        <MyComponent
                          title={moduleTitle}
                          component={component}
                        // channel={channel}
                        />
                      )}
                    />
                  ) : null;
              })}
            {this.props.children}
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

MiniDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

function mapStateToProps({ auth, modules, language }) {
  return { auth, modules, language };
}

class Ble extends Component {
  state = {
    open: true,
    startModule: {}
  };

  checkStartComp = ({ start_comp, UserModule }) => {
    // console.log("startComp", start_comp, UserModule);
    let startModule;
    let routeStart;
    if (Array.isArray(UserModule)) {

      if (UserModule.length === 0) {
        startModule = { name: "Start" };
        routeStart = routes[0];
      } else {
        const startComp = UserModule.filter(x => x.id === start_comp);
        startModule = startComp.length > 0 ? startComp[0] : UserModule[0];
        const route = routes.filter(x => x.comp === startModule.comp);
        routeStart = route.length > 0 ? route[0] : routes[0];
      }
      return (
        <MyComponent title={startModule.name} component={routeStart.component} />
      );
    }

  };

  componentDidMount = () => {
    drawerWidth = this.props.auth !== false ? 240 : 0;
    console.log("minidrawer", this.props.auth);
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleClickWhere = where => {
    this.props.clicked(where);
  };

  compAllowed = (comps, id, comp) => {
    if (!comps) {
      return false
    } else {
      return comps.filter(x => x.id === id).length > 0
    }
  };

  render() {
    const { classes, theme, auth, modules, language } = this.props;

    const switchLang = title => {
      switch (language) {
        case "pl":
          return title.name;
        case "en":
          return title.name_en;
        default:
          return title.name;
      }
    };

    return (
      <BrowserRouter>
        <div className={classes.root} id="classesRoot">
          {/* <Footer /> */}
          <TopNavBar
            open={this.state.open}
            handleDrawerOpen={this.handleDrawerOpen}
          />
          <DrawerMy
            open={this.state.open}
            handleDrawerClose={this.handleDrawerClose}
          />
          {/* <div>sdf</div> */}
          <main className={classes.content}>
            <div className={classes.toolbar} id="classToolbar" />
            {!auth ? (
              <Route
                path="/"
                exact
                // component={Login}
                render={() => <Login />}
              />
            ) : (
                <Route
                  path="/"
                  exact
                  // render={() => <Invoices title="Zaległe faktury" />}
                  render={() => this.checkStartComp(auth)}
                />
              )}
            {auth &&
              routes.map((route, i) => {
                let titles = ["Sample"]
                const { comp, path, component, open, id, parrentId } = route;
                if (Array.isArray(modules)) {
                  titles = modules.filter(x => x.id === id);
                }
                const moduleTitle = titles[0] ? switchLang(titles[0]) : "";
                // const moduleTitle = titles[0] ? titles[0].name : "";
                // console.log("route", comp, path);
                // const titlesFromDb = auth.UserModule.filter(x => x.id === id);
                // console.log("auth", path, id, comp, titlesFromDb);
                // const titleFromDb = titlesFromDb[0] ? titlesFromDb[0].name : "";
                return (auth &&
                  this.compAllowed(auth.UserModule, parrentId, comp)) ||
                  open ? (
                    <Route
                      key={i}
                      path={path}
                      render={() => (
                        <MyComponent
                          title={moduleTitle}
                          component={component}
                        // channel={channel}
                        />
                      )}
                    />
                  ) : null;
              })}
            {this.props.children}
            {/* <div>asdflksadjfals dkfjlsakdfjla;skdf </div> */}
            {/* <Route path="/login" component={Login} /> */}
            {/* <Route path="/register" component={Register} /> */}
            {/* <Route path="/reset" component={ResetPassword} /> */}
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    actions
  )
)(Ble);

// export default withStyles(styles, { withTheme: true })(
//   connect(
//     mapStateToProps,
//     actions
//   )(Ble)
// );

// export default withStyles(styles, { withTheme: true })(
//   connect(
//     mapStateToProps,
//     actions
//   )(MiniDrawer)
// );
