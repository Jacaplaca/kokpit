import React from "react";
import PropTypes from "prop-types";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import { withStyles } from "@material-ui/core/styles";

import { connect } from "react-redux";
import * as actions from "../actions";

import MainFrame from "../common/MainFrame";
import SiteHeader from "../common/SiteHeader";
// import LinearProgress from "./LinearProgress";

const styles = theme => ({
  flex: {
    flexGrow: 1
  }
});

class PromowaneProdukty extends React.Component {
  state = {
    checkedA: true,
    checkedB: true
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  render() {
    //const { classes, theme, auth, open, handleDrawerOpen } = this.props;
    return (
      <MainFrame>
        <SiteHeader text="Produkty promowane" />
        {/* <iframe
          style={{ width: "100%", height: 600 }}
          src="http://217.182.72.224:8080/nextreports-server"
        /> */}
        {/* <FormControlLabel
          control={
            <Switch
              checked={this.state.checkedA}
              onChange={this.handleChange("checkedA")}
              value="checkedA"
            />
          }
          label="Secondary"
        />
        <FormControlLabel
          control={
            <Switch
              checked={this.state.checkedB}
              onChange={this.handleChange("checkedB")}
              value="checkedB"
              color="primary"
            />
          }
          label="Primary"
        />
        <FormControlLabel
          control={<Switch value="checkedC" />}
          label="Uncontrolled"
        />
        <FormControlLabel
          disabled
          control={<Switch value="checkedD" />}
          label="Disabled"
        />
        <FormControlLabel
          disabled
          control={<Switch checked value="checkedE" />}
          label="Disabled"
        /> */}
      </MainFrame>
    );
  }
}

PromowaneProdukty.propTypes = {
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
  )(PromowaneProdukty)
);
