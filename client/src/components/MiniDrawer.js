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
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
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
    const { classes, theme } = this.props;
    // console.log(this.props.auth);
    return (
      <BrowserRouter>
        <div className={classes.root}>
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
            <Route path="/costs" component={Costs} />
            <Route path="/planer" component={Planer} />
            <Route path="/raporty" component={PlanerRaport} />
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
