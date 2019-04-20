import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { lighten } from "@material-ui/core/styles/colorManipulator";

import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import Collapse from "@material-ui/core/Collapse";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";

import { withStyles } from "@material-ui/core/styles";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MoneyIcon from "@material-ui/icons/AttachMoney";
import EventIcon from "@material-ui/icons/Event";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import InsertChartOutlined from "@material-ui/icons/InsertChartOutlined";
import Settings from "@material-ui/icons/Settings";
import Person from "@material-ui/icons/Person";
import ListAlt from "@material-ui/icons/ListAlt";
import People from "@material-ui/icons/People";
import Assignment from "@material-ui/icons/Assignment";
import ShowLinkToComp from "./ShowLinkToComp";
import { connect } from "react-redux";
import * as actions from "../actions";

const styles = theme => ({
  rootButton: {
    color: "white",
    "&:hover": {
      color: "white"
    }
  },
  hover: {},
  labelButton: {
    borderColor: "gray",
    textAlign: "left"
  },
  listItemText: {
    fontSize: "0.9em"
    // padding: "0px 1px" //Insert your required size
  },
  itemText: {
    padding: "0px 1px"
  },
  expanded: {
    // backgroundColor: "rgb(231, 231, 231, 0.35)",
    backgroundColor: lighten(theme.palette.primary.main, 0.86),
    boxShadow: "0 5px 11px -6px gray"
  }
});

const components = {
  MoneyIcon: <MoneyIcon />,
  EventIcon: <EventIcon />,
  EventAvailableIcon: <EventAvailableIcon />,
  InsertChartOutlined: <InsertChartOutlined />,
  Settings: <Settings />,
  Person: <Person />,
  ListAlt: <ListAlt />,
  People: <People />,
  Assignment: <Assignment />
};

class DrawerLink extends React.Component {
  state = {
    open: false
  };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  ktoraIkona = icon => {
    return components[icon];
  };

  render() {
    const { classes, theme, link, text, icon, comps, comp } = this.props;
    const { open } = this.state;
    console.log("drawerlink", link, text, icon);
    return comps ? (
      <div className={classNames(open && classes.expanded)}>
        <ListItem button onClick={this.handleClick}>
          <ListItemIcon>{this.ktoraIkona(icon)}</ListItemIcon>
          <ListItemText
            inset
            primary={text}
            classes={{ primary: classes.listItemText, root: classes.itemText }}
          />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse
          in={open}
          timeout="auto"
          unmountOnExit
          // className={classNames(open && classes.expanded)}
        >
          {comps.map((x, i) => (
            <Link key={i} to={x.link}>
              {/* <List component="div" disablePadding> */}
              <ListItem button className={classes.nested}>
                {/* <ListItemIcon>{this.ktoraIkona(icon)}</ListItemIcon> */}
                <ListItemText
                  inset
                  primary={x.text}
                  classes={{
                    primary: classes.listItemText,
                    root: classes.itemText
                  }}
                />
              </ListItem>
              {/* </List> */}
            </Link>
          ))}
        </Collapse>
      </div>
    ) : (
      <ShowLinkToComp comp={comp}>
        <Link to={link}>
          <ListItem button>
            <ListItemIcon>{this.ktoraIkona(icon)}</ListItemIcon>
            <ListItemText
              classes={{
                primary: classes.listItemText,
                root: classes.itemText
              }}
              primary={text}
            />
          </ListItem>
        </Link>
      </ShowLinkToComp>
    );
  }
}

DrawerLink.propTypes = {
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
  )(DrawerLink)
);
