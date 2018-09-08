import React, { Component } from "react";
import _ from "lodash";
import { connect } from "react-redux";
import { startOfMonth, endOfMonth } from "date-fns";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import PropTypes from "prop-types";
import Collapse from "rc-collapse";
import { withStyles } from "@material-ui/core/styles";
import { sumaCzasow } from "../common/functions";
//import Paper from "@material-ui/core/Paper";

import PlanerAktywnosciSingle from "./PlanerAktywnosciSingle";

const Panel = Collapse.Panel;

const styles = theme => ({
  input: {
    display: "flex",
    padding: 0
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  },
  // accordionClass: {
  //   backgroundColor: fade(theme.palette.primary.main, 0.15)
  //   // borderColor: theme.palette.primary.main,
  //   // color: 'white'
  // },
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
  mojChipClickedRoot: {
    color: "white",
    margin: theme.spacing.unit / 2,
    backgroundColor: theme.palette.primary.main
  },
  mojChipRoot: {
    margin: theme.spacing.unit / 2,
    backgroundColor: "lightgray"
  },
  mojChipClicked: {
    "&:hover, &:focus": {
      margin: theme.spacing.unit / 2,
      backgroundColor: "lightgray"
    },
    "&:active": {
      color: "white",
      margin: theme.spacing.unit / 2,
      backgroundColor: theme.palette.primary.main
    }
  },
  mojChip: {
    "&:hover, &:focus": {
      color: "white",
      margin: theme.spacing.unit / 2,
      backgroundColor: theme.palette.primary.main
    },
    "&:active": {
      margin: theme.spacing.unit / 2,
      backgroundColor: "lightgray"
    }
  }
});

class PlanerAktywnosciLista extends Component {
  state = {};

  renderAktywnosci = () => {
    return this.props.aktywnosci.map(day => {
      return (
        <Collapse
          key={day.kiedy}
          accordion={true}
          // activeKey="0"
          // defaultActiveKey="0"
          onMouseEnter={() => console.log("Collapse")}
        >
          <Panel
            key={day.kiedy}
            header={
              <span style={{ fontWeight: "600" }}>
                {day.kiedy} - {sumaCzasow(day.values)}
              </span>
            }
            //headerClass={classes.accordionClass}
            style={{ color: "white" }}
          >
            <PlanerAktywnosciSingle
              fetch={() => this.props.fetchuj()}
              day={day.values}
              edit={id => this.props.edit(id)}
              //delete={id => this.props.delete(id)}
            />
          </Panel>
        </Collapse>
      );
    });
  };

  render() {
    const { classes } = this.props;

    return this.renderAktywnosci();
  }
}

PlanerAktywnosciLista.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps
    // actions
  )(PlanerAktywnosciLista)
);
