import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import { lighten, darken } from "@material-ui/core/styles/colorManipulator";
import classNames from "classnames";

import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { connect } from "react-redux";

// import Button from "@material-ui/core/Button";
// import Menu from "@material-ui/core/Menu";
// import MenuItem from "@material-ui/core/MenuItem";
// import Fade from "@material-ui/core/Fade";
// import Grow from "@material-ui/core/Grow";
import { elements } from "./DrawerElements";
import * as actions from "../actions";

import DrawerLink from "./DrawerLink";
import ShowLinkToComp from "./ShowLinkToComp";
import CompanyInfo from "../common/CompanyInfo";

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
  button: {
    border: 0,
    "font-weight": 600,
    height: 35,
    padding: "0 30px",
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
  drawerPaper: {
    // backgroundColor: lighten(theme.palette.primary.light, 0.92),
    // backgroundColor: lighten(theme.palette.primary.main, 0.92),
    backgroundColor: theme.palette.grey["200"],
    // backgroundColor: darken(theme.palette.primary.main, 0.3),
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    borderRightWidth: 0,
    paddingBottom: 25
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 6,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 8.2
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
    backgroundColor: "white",
    textAlign: "center",
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  }
});

class DrawerMy extends React.Component {
  state = {
    anchorEl: null,
    activeLink: false
  };

  // componentDidUpdate() {
  //   console.log("drawerMy udpate");
  // }

  handleClickMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    console.log("handleClose()");
    this.setState({ anchorEl: null });
  };

  handleClick = () => {
    // console.log("drawermy", window.location.pathname);
    this.setState({ activeLink: window.location.pathname });
  };

  render() {
    const {
      classes,
      theme,
      auth,
      open,
      handleDrawerClose,
      anchorEl
    } = this.props;
    const { activeLink } = this.state;
    return (
      <Drawer
        variant="permanent"
        classes={{
          paper: classNames(
            classes.drawerPaper,
            !open && classes.drawerPaperClose,
            !auth && classes.drawerPaperHide
          )
        }}
        open={open}
      >
        <div className={classes.toolbar}>
          {/* {auth && auth.Company.name} */}
          {/* {auth && auth.email.split("@")[0]} */}
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        {open && <CompanyInfo width={drawerWidth} open={open} auth={auth} />}
        <div>
          {elements(auth).map((el, i) => {
            // console.log("el", el);
            const { comp, text, link, icon, comps, links } = el;
            return (
              <ShowLinkToComp key={i} comp={comp}>
                <DrawerLink
                  openDrawer={open}
                  text={text}
                  link={link}
                  icon={icon}
                  comps={comps}
                  comp={comp}
                  element={el}
                  open={event => this.handleClickMenu(event)}
                  anchor={anchorEl}
                  close={this.handleClose}
                  links={links}
                  path={activeLink}
                  clickDrawer={this.handleClick}
                />
              </ShowLinkToComp>
            );
          })}
        </div>
      </Drawer>
    );
  }
}

DrawerMy.propTypes = {
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
  )(DrawerMy)
);
