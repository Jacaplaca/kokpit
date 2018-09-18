import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { startOfMonth, endOfMonth } from "date-fns";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import PropTypes from "prop-types";
import Collapse from "rc-collapse";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import ClockIcon from "@material-ui/icons/WatchLater";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";

import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { sumaCzasow, minutes2hours } from "../common/functions";
//import Paper from "@material-ui/core/Paper";
import Confirmation from "./Confirmation";

import PlanerAktywnosciSingle from "./PlanerAktywnosciSingle";

const Panel = Collapse.Panel;

const styles = theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  input: {
    display: "flex",
    padding: 0
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  },
  wyslanoPasek: {
    backgroundColor: fade(theme.palette.secondary.light, 0.1)
  },
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  container: {
    display: "inline-block",
    flexWrap: "nowrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  formControl: {
    margin: theme.spacing.unit
  },
  buttonRoot: {
    // background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    // boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)"
    background: `linear-gradient(45deg, ${fade(
      theme.palette.secondary.main,
      1
    )} 30%, ${fade(theme.palette.secondary.light, 1)} 90%)`,
    //boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)",
    borderRadius: 3,
    //border: 0,
    color: "white",
    height: 22,
    padding: "0 20px"
    // lineHeight: 1
  },

  label: {
    // textTransform: "capitalize"
    //padding: 0,
    borderColor: "gray"
  },
  text: {
    //padding: "0 1px",
    //borderColor: "red",
    height: 4
  }
});

class PlanerLista extends Component {
  state = {
    open: false,
    kiedy: ""
    //expanded: "2018-09-01"
  };

  wyslijDoPlanu = kiedy => {
    const url = `/api/akt/planned/${kiedy}`;
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin"
    })
      .then(() => {
        this.props.wyslanoDoPlanu(kiedy);
        // this.fetchCosts();
        this.props.fetchuj();
      })
      .then(() => {
        // this.clearForm();
        this.setState({ open: false, kiedy: "" });
      });
  };

  handleClose = () => {
    this.setState({ open: false, kiedy: "" });
  };

  render() {
    const { classes, expanded, wyslijDoPlanuButton } = this.props;
    //const { expanded } = this.state;
    console.log("lista dni");

    return (
      <div style={{ marginTop: 20 }}>
        <Confirmation
          open={this.state.open}
          close={this.handleClose}
          action={() => this.wyslijDoPlanu(this.state.kiedy)}
          komunikat="Czy na pewno chcesz zakończyć planowanie tego dnia?"
        />
        {this.props.aktywnosci.map((day, i) => {
          return (
            // <div className={classes.root} key={day.kiedy}>
            <ExpansionPanel
              key={day.kiedy}
              defaultExpanded={expanded === day.kiedy ? true : false}
            >
              <ExpansionPanelSummary
                className={day.values[0].wyslano ? classes.wyslanoPasek : ""}
                expandIcon={<ExpandMoreIcon />}
              >
                <Typography className={classes.heading}>
                  <span
                    style={{
                      fontWeight: "600",
                      opacity: day.values[0].wyslano ? "0.65" : "1"
                    }}
                  >
                    {day.kiedy}{" "}
                    <Icon
                      //color="white"
                      style={{
                        //position: "relative"
                        verticalAlign: "middle",
                        //paddingBottom: 23,
                        // width: 15,
                        opacity: "0.4",
                        marginLeft: 15
                      }}
                    >
                      <ClockIcon
                        style={{
                          paddingBottom: 4,
                          fontSize: 20
                        }}
                      />
                    </Icon>{" "}
                    {minutes2hours(sumaCzasow(day.values))}
                    {wyslijDoPlanuButton && (
                      <Button
                        onClick={() =>
                          this.setState({ open: true, kiedy: day.kiedy })
                        }
                        classes={{
                          root: day.values[0].wyslano
                            ? classes.buttonRootDisabled
                            : classes.buttonRoot,
                          label: classes.label,
                          text: classes.text // class name, e.g. `classes-nesting-label-x`
                        }}
                        style={{
                          position: "absolute",
                          right: "50px",
                          marginTop: "-5px"
                        }}
                        //variant="outlined"
                        size="small"
                        disabled={day.values[0].wyslano ? true : false}
                        // className={classes.button}
                      >
                        {day.values[0].wyslano
                          ? "Wysłano do planu"
                          : "Wyślij do planu"}
                      </Button>
                    )}
                  </span>
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails
                style={{ display: "block" }}
                className={day.values[0].wyslano ? classes.wyslanoPasek : ""}
              >
                <PlanerAktywnosciSingle
                  fetch={() => this.props.fetchuj()}
                  day={day.values}
                  edit={id => this.props.edit(id)}
                  component={this.props.component}
                  //delete={id => this.props.delete(id)}
                />
              </ExpansionPanelDetails>
            </ExpansionPanel>
            //</div>
          );
        })}
      </div>
    );
    // return (
    //   <div>
    //     <ExpansionPanel>
    //       <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
    //         <Typography>Expansion Panel 1</Typography>
    //       </ExpansionPanelSummary>
    //       <ExpansionPanelDetails>
    //         <Typography>
    //           Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    //           Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
    //           eget.
    //         </Typography>
    //       </ExpansionPanelDetails>
    //     </ExpansionPanel>
    //     <ExpansionPanel>
    //       <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
    //         <Typography>Expansion Panel 2</Typography>
    //       </ExpansionPanelSummary>
    //       <ExpansionPanelDetails>
    //         <Typography>
    //           Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    //           Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
    //           eget.
    //         </Typography>
    //       </ExpansionPanelDetails>
    //     </ExpansionPanel>
    //   </div>
    // );
  }
}

PlanerLista.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps
    // actions
  )(PlanerLista)
);
