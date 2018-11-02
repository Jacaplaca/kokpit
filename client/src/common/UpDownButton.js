import React from "react";
import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

import { connect } from "react-redux";
import * as actions from "../actions";

const styles = theme => ({});

const components = {
  ExpandLess: <ExpandLess />,
  ExpandMore: <ExpandMore />
};

class UpDownButton extends React.Component {
  ktoraIkona = icon => {
    return components[icon];
  };

  render() {
    const { classes, theme, text, icon, onClick } = this.props;
    return (
      <ListItem button style={{ height: 10 }} onClick={onClick}>
        <ListItemIcon style={{ margin: "0 auto" }}>
          {this.ktoraIkona(icon)}
        </ListItemIcon>
      </ListItem>
    );
  }
}

UpDownButton.propTypes = {
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
  )(UpDownButton)
);
