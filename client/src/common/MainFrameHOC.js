import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles
} from "@material-ui/core/styles";
import deepOrange from "@material-ui/core/colors/deepOrange";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import SiteHeader from "../common/SiteHeader";

const MainFrameHOC = WrappedComponent => {
  return class MainFrameHOCClass extends Component {
    state = {
      key: 0
    };

    componentWillReceiveProps = nextProps => {
      if (nextProps.language !== this.props.language) {
        this.setState({ key: this.state.key + 1 });
      }
    };

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
        },
        palette: {
          secondary: deepOrange
        }
      });

      return (
        <MuiThemeProvider theme={theme}>
          <div id="MainFrameHOC" style={styles.container}>
            <div style={{ display: "inline-flex" }}>
              <SiteHeader text={this.props.title} />
              {this.props.help && (
                <div>
                  <Tooltip
                    disableFocusListener
                    title={this.props.help}
                    // style={styles.tooltip}
                  >
                    <div style={{ marginLeft: 5 }}>(?)</div>
                  </Tooltip>
                </div>
              )}
            </div>
            <WrappedComponent {...this.props} key={this.state.key} />
          </div>
        </MuiThemeProvider>
      );
    }
  };
};

export default MainFrameHOC;
