import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
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
import Confirmation from "./Confirmation";

import PlanerAktywnosciSingle from "./PlanerAktywnosciSingle";

const styles = theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular
  },
  wyslanoPasek: {
    backgroundColor: fade(theme.palette.secondary.light, 0.1)
  },
  buttonRoot: {
    background: `linear-gradient(45deg, ${fade(
      theme.palette.secondary.main,
      1
    )} 30%, ${fade(theme.palette.secondary.light, 1)} 90%)`,
    borderRadius: 3,
    color: "white",
    height: 22,
    padding: "0 20px"
  },
  label: {
    borderColor: "gray"
  },
  text: {
    height: 4
  }
});

class PlanerLista extends Component {
  state = {
    open: false,
    kiedy: ""
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
        this.props.fetchuj();
      })
      .then(() => {
        this.setState({ open: false, kiedy: "" });
      });
  };

  handleClose = () => {
    this.setState({ open: false, kiedy: "" });
  };

  render() {
    const { classes, expanded, wyslijDoPlanuButton } = this.props;

    return (
      <div>
        <Confirmation
          open={this.state.open}
          close={this.handleClose}
          action={() => this.wyslijDoPlanu(this.state.kiedy)}
          komunikat="Czy na pewno chcesz zakończyć planowanie tego dnia?"
        />
        {this.props.aktywnosci.map((day, i) => {
          return (
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
          );
        })}
      </div>
    );
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
