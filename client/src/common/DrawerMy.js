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

import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import Grow from "@material-ui/core/Grow";

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
  // state = {
  //   anchorEl: null
  // };
  //
  // handleClick = event => {
  //   this.setState({ anchorEl: event.currentTarget });
  // };
  //
  // handleClose = () => {
  //   this.setState({ anchorEl: null });
  // };

  render() {
    const { classes, theme, auth, open, handleDrawerClose } = this.props;

    // const { anchorEl } = this.state;
    // const open2 = Boolean(anchorEl);

    const expLinks = [
      {
        text: "Planer",
        icon: "EventIcon",
        comp: "planer",
        comps: [
          {
            comp: "planer",
            text: "Aktywności",
            link: "/planer",
            icon: "EventIcon"
          },
          {
            comp: "raporty",
            text: "Raporty",
            link: "/raporty",
            icon: "EventAvailableIcon"
          }
        ]
      },

      {
        comp: "powerBi",
        text: "Power BI",
        link: "https://powerbi.microsoft.com/pl-pl/",
        icon: "Pageview"
      },
      {
        comp: "nextReports",
        text: "Next Reports",
        link: "/nextreports",
        icon: "InsertChartOutlined"
      },
      { comp: "costs", text: "Koszty", link: "/costs", icon: "MoneyIcon" },
      {
        comp: "invoices",
        text: "Faktury",
        link: "/invoices",
        icon: "ListAlt"
      },
      {
        comp: "customer_details",
        text: "Informacje o klientach",
        link: "/customerdetails",
        icon: "People"
      },
      {
        comp: "calculators",
        text: "Premie",
        link: "/calculators",
        icon: "Money"
      },
      {
        comp: "bonusRules",
        text: "Regulamin premiowy",
        link: "/bonusrules",
        icon: "Description"
      },
      {
        text: "Konfiguracja",
        comp: "settings",
        icon: "Settings",
        // link: "/costs",
        comps: [
          {
            comp: "bonus_system",
            // icon: "Assignment",
            text: "Ustawienia premii",
            menus: [
              {
                // comp: "products",
                text: "Produkty",
                link: "/products",
                icon: "LocalOffer"
              },
              {
                // comp: "channels",
                text: "Systemy prowizyjne",
                link: "/systems",
                icon: "Assignment"
              },
              {
                // comp: "users_channels",
                text: "Pracownicy",
                link: "/users_channels",
                icon: "People"
              }
            ]
          },
          {
            comp: "users",
            text: "Użytkownicy",
            link: "/users",
            icon: "Person"
          },
          {
            comp: "settings",
            text: "Ogólne ustawienia",
            link: "/settings",
            icon: "Settings"
          }
        ]
      }
    ];

    const links = [
      // { comp: "costs", text: "Koszty", link: "/costs", icon: "MoneyIcon" },
      // {
      //   comp: "planer",
      //   text: "Aktywności",
      //   link: "/planer",
      //   icon: "EventIcon"
      // },
      // {
      //   comp: "raporty",
      //   text: "Raporty",
      //   link: "/raporty",
      //   icon: "EventAvailableIcon"
      // },
      // {
      //   comp: "nextReports",
      //   text: "Next Reports",
      //   link: "/nextreports",
      //   icon: "InsertChartOutlined"
      // },
      // {
      //   comp: "serwis",
      //   text: "Serwis",
      //   link: "/serwis",
      //   icon: "InsertChartOutlined"
      // },
      // {
      //   comp: "chanprodconf",
      //   text: "Konfiguracja",
      //   link: "/channelconfiguration",
      //   icon: "InsertChartOutlined"
      // },
      // {
      //   comp: "products",
      //   text: "Produkty",
      //   link: "/products",
      //   icon: "InsertChartOutlined"
      // },
      // {
      //   comp: "users",
      //   text: "Użytkownicy",
      //   link: "/users",
      //   icon: "InsertChartOutlined"
      // },
      // {
      //   comp: "channels",
      //   text: "Systemy prowizyjne",
      //   link: "/systems",
      //   icon: "InsertChartOutlined"
      // },
      // {
      //   comp: "invoices",
      //   text: "Faktury",
      //   link: "/invoices",
      //   icon: "InsertChartOutlined"
      // },
      // {
      //   comp: "customer_details",
      //   text: "Informacje o klientach",
      //   link: "/customerdetails",
      //   icon: "InsertChartOutlined"
      // },
      // {
      //   comp: "calculators",
      //   text: "Kalkulatory",
      //   link: "/calculators",
      //   icon: "InsertChartOutlined"
      // }
      // {
      //   comp: "channels_config",
      //   text: "Konfiguracja systemów",
      //   link: "/configs",
      //   icon: "InsertChartOutlined"
      // }
    ];
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
          {expLinks.map((el, i) => {
            // console.log("el", el);
            const { comp, text, link, icon, comps } = el;
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
                />
              </ShowLinkToComp>
            );
          })}
          {/* {links.map((el, i) => {
            const { comp, text, link, icon } = el;
            return (
              <ShowLinkToComp key={i} comp={comp}>
                <DrawerLink key={i} text={text} link={link} icon={icon} />
              </ShowLinkToComp>
            );
          })} */}
        </div>
        {/* <div>
          <Button
            aria-owns={open2 ? "fade-menu" : undefined}
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            Open with fade transition
          </Button>
          <Menu
            elevation={1}
            id="fade-menu"
            anchorEl={anchorEl}
            open={open2}
            onClose={this.handleClose}
            TransitionComponent={Grow}
            // id="menu-appbar"
            // anchorEl={anchorEl}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: "center", horizontal: "right" }}
            transformOrigin={{ vertical: "center", horizontal: "left" }}
            // className={props.classes.menu}
          >
            <MenuItem onClick={this.handleClose}>Profile</MenuItem>
            <MenuItem onClick={this.handleClose}>My account</MenuItem>
            <MenuItem onClick={this.handleClose}>Logout</MenuItem>
          </Menu>
        </div> */}
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
