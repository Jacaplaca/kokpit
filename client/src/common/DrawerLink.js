import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { withStyles } from "@material-ui/core/styles";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MoneyIcon from "@material-ui/icons/AttachMoney";
import EventIcon from "@material-ui/icons/Event";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import InsertChartOutlined from "@material-ui/icons/InsertChartOutlined";

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
  }
});

const components = {
  MoneyIcon: <MoneyIcon />,
  EventIcon: <EventIcon />,
  EventAvailableIcon: <EventAvailableIcon />,
  InsertChartOutlined: <InsertChartOutlined />
};

class DrawerLink extends React.Component {
  ktoraIkona = icon => {
    return components[icon];
  };

  render() {
    const { classes, theme, link, text, icon } = this.props;
    return (
      <Link to={link}>
        <ListItem button>
          <ListItemIcon>{this.ktoraIkona(icon)}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      </Link>
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
