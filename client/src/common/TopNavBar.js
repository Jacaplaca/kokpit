import React from "react";
import PropTypes from "prop-types";
import {
  BrowserRouter,
  Route,
  Link,
  Redirect,
  NavLink
} from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import { connect } from "react-redux";
import * as actions from "../actions";

import ButtonNavBar from "./ButtonNavBar";

let drawerWidth = 240;

const styles = theme => ({
  flex: {
    flexGrow: 1
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  appBarShiftHide: {
    marginLeft: 0,
    width: `calc(100% - ${0}px)`
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  hide: {
    display: "none"
  }
});

class TopNavBar extends React.Component {
  renderContent() {
    const { classes } = this.props;
    console.log(this.props.auth);
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return [
          <ButtonNavBar key="1a" link="/register" text="Rejestracja" />,
          <ButtonNavBar key="2b" link="/login" text="Logowanie" />
        ];
      default:
        return [<ButtonNavBar key={2} link="/api/logout" text="Wyloguj się" />];
    }
  }

  render() {
    const { classes, theme, auth, open, handleDrawerOpen } = this.props;
    return (
      <AppBar
        position="absolute"
        className={classNames(
          classes.appBar,
          open && classes.appBarShift,
          !auth && classes.appBarShiftHide
        )}
      >
        <Toolbar disableGutters={!open}>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerOpen}
            className={classNames(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <div variant="title" color="inherit" className={classes.flex}>
            <Typography variant="title" color="inherit" noWrap>
              <NavLink
                activeStyle={{
                  color: "white",
                  fontWeight: "600",
                  textDecoration: "none"
                }}
                to="/"
              >
                Świadoma Firma
              </NavLink>
            </Typography>
          </div>
          <ul className="right">{this.renderContent()}</ul>
        </Toolbar>
      </AppBar>
    );
  }
}

TopNavBar.propTypes = {
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
  )(TopNavBar)
);
