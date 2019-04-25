import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles
} from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import SiteHeader from "../common/SiteHeader";

const MainFrameHOC = WrappedComponent => {
  return class MainFrameHOCClass extends Component {
    render() {
      const styles = {
        container: {
          // display: "inline-block",
          flexWrap: "nowrap",
          padding: this.props.theme.spacing.unit * 3,
          position: "relative"
          // height: "100%"
        },
        tooltip: {
          color: "lightblue",
          backgroundColor: "green"
        }
      };

      const theme = createMuiTheme({
        overrides: {
          MuiTooltip: {
            tooltip: {
              fontSize: "0.8em",
              maxWidth: 500
              // color: "yellow",
              // backgroundColor: "red"
            }
          }
        }
      });

      return (
        <div id="MainFrameHOC" style={styles.container}>
          <div style={{ display: "inline-flex" }}>
            <SiteHeader text={this.props.title} />
            {this.props.help && (
              <div>
                <MuiThemeProvider theme={theme}>
                  <Tooltip
                    disableFocusListener
                    title={this.props.help}
                    // style={styles.tooltip}
                  >
                    <div style={{ marginLeft: 5 }}>(?)</div>
                  </Tooltip>
                </MuiThemeProvider>
              </div>
            )}
          </div>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  };
};

export default MainFrameHOC;
