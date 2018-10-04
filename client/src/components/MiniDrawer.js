import React from "react";
import PropTypes from "prop-types";
import { BrowserRouter, Route } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import * as actions from "../actions";

import TopNavBar from "../common/TopNavBar";
import DrawerMy from "../common/DrawerMy";

import Costs from "./Costs";
import Planer from "./Planer";
import PlanerRaport from "./PlanerRaporty";
import Login from "./Login";
import PromowaneProdukty from "./PromowaneProdukty";
import NextReports from "./NextReports";
// import LinearProgress from "../common/LinearProgress";

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

class MiniDrawer extends React.Component {
  state = {
    open: true
  };

  componentDidMount = () => {
    drawerWidth = this.props.auth !== false ? 240 : 0;
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

  render() {
    const { classes, theme, auth } = this.props;
    // console.log(this.props.auth);
    return (
      <BrowserRouter>
        <div className={classes.root}>
          {/* <LinearProgress /> */}
          <TopNavBar
            open={this.state.open}
            handleDrawerOpen={this.handleDrawerOpen}
          />
          <DrawerMy
            open={this.state.open}
            handleDrawerClose={this.handleDrawerClose}
          />
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {!auth ? (
              <Route path="/" exact component={Login} />
            ) : (
              <Route path="/" exact component={PromowaneProdukty} />
            )}
            {auth && auth.costs ? (
              <Route path="/costs" component={Costs} />
            ) : null}
            {auth && auth.planer ? (
              <Route path="/planer" component={Planer} />
            ) : null}
            {auth && auth.raporty ? (
              <Route path="/raporty" component={PlanerRaport} />
            ) : null}
            {auth && auth.nextReports ? (
              <Route path="/nextreports" component={NextReports} />
            ) : null}
            {this.props.children}
          </main>
        </div>
      </BrowserRouter>
    );
  }
}

// MiniDrawer.defaultProps = {
//   auth: { email: 'd' }
// };

MiniDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    actions
  )(MiniDrawer)
);
