import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Iframe from "react-iframe";
import { withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MoneyIcon from "@material-ui/icons/AttachMoney";

import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import * as actions from "../actions";
// import { Link } from 'react-router-dom';

// import { mailFolderListItems, otherMailFolderListItems } from './tileData';
// import Header from './Header';

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
  button: {
    // background: 'white',
    // borderRadius: 3,
    border: 0,
    // color: 'black',
    "font-weight": 600,
    height: 35,
    padding: "0 30px",
    // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    "font-size": 25
    // $nest: {
    //   '&:hover': {
    //     color: 'red'
    //   }
    // }
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36
  },
  hide: {
    display: "none"
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9
    }
  },
  drawerPaperHide: {
    width: 0
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
    console.log(this.props.auth);
    console.log(drawerWidth);
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

  renderContent() {
    console.log(this.props.auth);
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          // <li>
          //   <a href="/auth/google">Login With Google</a>
          // </li>
          [
            <Button key="1a" color="inherit" href="/register">
              Rejestracja
            </Button>,
            <Button key="2b" color="inherit" href="/login">
              Logowanie
            </Button>
          ]
        );
      default:
        return [
          // <li key="1">
          //   <Payments />
          // </li>,
          // <li key="3" style={{ margin: '0 10px' }}>
          //   Credits: {this.props.auth.credits}
          // </li>,
          // <li key="2">
          //   <a href="/api/logout">Logout</a>
          // </li>
          <Button key="2" color="inherit" href="/api/logout">
            Wyloguj się
          </Button>
        ];
    }
  }

  render() {
    const { classes, theme, auth } = this.props;
    // console.log(this.props.auth);
    return (
      <div className={classes.root}>
        <AppBar
          position="absolute"
          className={classNames(
            classes.appBar,
            this.state.open && classes.appBarShift,
            !this.props.auth && classes.appBarShiftHide
          )}
        >
          <Toolbar disableGutters={!this.state.open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(
                classes.menuButton,
                this.state.open && classes.hide
              )}
            >
              <MenuIcon />
            </IconButton>
            {/* <Header /> */}
            {/* <Typography variant="title" color="inherit" noWrap>
              Mini variant drawer
            </Typography> */}
            <div variant="title" color="inherit" className={classes.flex}>
              <Button
                key="2"
                color="inherit"
                href="/"
                className={classes.button}
              >
                Świadoma Firma
              </Button>
            </div>
            {/* <Button color="inherit">Login</Button> */}
            <ul className="right">{this.renderContent()}</ul>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: classNames(
              classes.drawerPaper,
              !this.state.open && classes.drawerPaperClose,
              !this.props.auth && classes.drawerPaperHide
            )
          }}
          open={this.state.open}
        >
          <div className={classes.toolbar}>
            {this.props.auth && this.props.auth.email.split("@")[0]}
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <ListItem button onClick={() => this.handleClickWhere("costs")}>
            <ListItemIcon>
              <MoneyIcon />
            </ListItemIcon>
            <ListItemText primary="Koszty" />
          </ListItem>

          <ListItem button onClick={() => this.handleClickWhere("planer")}>
            <ListItemIcon>
              <MoneyIcon />
            </ListItemIcon>
            <ListItemText primary="Planer" />
          </ListItem>

          {/* <Divider />
          <List>{mailFolderListItems}</List>
          <Divider />
          <List>{otherMailFolderListItems}</List> */}
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {/* <Typography noWrap>
            {'You think water moves fast? You should see ice.'}
          </Typography> */}
          {this.props.children}
          {/* <Iframe
            url="https://www.spidersweb.pl/"
            width="100%"
            height="100%"
            id="myId"
            className="myClassname"
            display="initial"
            position="relative"
            allowFullScreen
          /> */}
          {/* <iframe
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            src="https://antyweb.pl/"
            style={{ width: 500, height: 600 }}
            // s="border: 0; width:130px; height:20px;"
          /> */}
        </main>
      </div>
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
