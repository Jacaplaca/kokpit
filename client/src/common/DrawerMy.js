import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";

import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import { connect } from "react-redux";
import * as actions from "../actions";

import DrawerLink from "./DrawerLink";
import ShowLinkToComp from "./ShowLinkToComp";

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

class DrawerMy extends React.Component {
  render() {
    const { classes, theme, auth, open, handleDrawerClose } = this.props;
    const links = [
      { comp: "costs", text: "Koszty", link: "/costs", icon: "MoneyIcon" },
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
      },
      {
        comp: "nextReports",
        text: "Next Reports",
        link: "/nextreports",
        icon: "InsertChartOutlined"
      },
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
      {
        comp: "products",
        text: "Produkty",
        link: "/products",
        icon: "InsertChartOutlined"
      },
      {
        comp: "users",
        text: "Użytkownicy",
        link: "/users",
        icon: "InsertChartOutlined"
      },
      {
        comp: "channels",
        text: "Systemy prowizyjne",
        link: "/systems",
        icon: "InsertChartOutlined"
      },
      {
        comp: "invoices",
        text: "Faktury",
        link: "/invoices",
        icon: "InsertChartOutlined"
      },
      {
        comp: "customer_details",
        text: "Informacje o klientach",
        link: "/customerdetails",
        icon: "InsertChartOutlined"
      },
      {
        comp: "calculators",
        text: "Kalkulatory",
        link: "/calculators",
        icon: "InsertChartOutlined"
      }
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
          {auth && auth.email.split("@")[0]}
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>

        <div>
          {links.map((el, i) => {
            const { comp, text, link, icon } = el;
            return (
              <ShowLinkToComp key={i} comp={comp}>
                <DrawerLink text={text} link={link} icon={icon} />
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
