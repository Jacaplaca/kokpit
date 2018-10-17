import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import ClockIcon from "@material-ui/icons/WatchLater";
import Edit from "@material-ui/icons/Edit";
import { withStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import {
  timeDiff,
  wezGodzine,
  minutes2hours,
  shortPlace
} from "../common/functions";
//import Paper from "@material-ui/core/Paper";

import RaportyAkcjeIndicator from "./RaportyAkcjeIndicator";
import Confirmation from "./Confirmation";

const styles = theme => ({
  row: {
    borderBottomColor: fade(theme.palette.primary.main, 0.22),
    borderBottomStyle: "solid",
    borderBottomWidth: 1,
    width: "100%"
  },
  aktywnosc: {
    borderRadius: 5,
    backgroundColor: fade(theme.palette.primary.main, 0.1),
    marginLeft: 15,
    marginRight: 10,
    padding: 4,
    fontWeight: "600"
  },
  klient: {
    borderRadius: 5,
    //backgroundColor: fade(theme.palette.primary.main, 0.1),
    //marginLeft: 20,
    marginRight: 10,
    padding: 4,
    fontWeight: "200"
  },
  hours: {
    backgroundColor: fade(theme.palette.primary.main, 0.15),
    fontWeight: "600",
    padding: 2,
    borderRadius: 5
  },
  button: {
    margin: theme.spacing.unit,
    width: 30,
    height: 30
  },
  input: {
    display: "none"
  }
});

class PlanerAktywnosciSingle extends Component {
  state = { open: false, id: null };

  handleEdit = id => {
    this.props.edit(id);
  };
  handleDelete = id => {
    this.props.delete(id);
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDelete = id => {
    const url = `/api/${this.props.component}/remove/${id}`;
    this.setState({ delete: "", open: false });
    fetch(url, {
      method: "POST",
      // body: JSON.stringify({ aa: 'aaa' }),
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin"
    }).then(() => {
      this.props.fetch();
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Confirmation
          open={this.state.open}
          close={this.handleClose}
          action={() => this.handleDelete(this.state.id)}
          komunikat="Czy na pewno chcesz usunąć tę aktywność?"
        />
        {this.props.day.map(day => {
          const {
            id,
            // kiedy,
            start,
            stop,
            aktywnosc_id,
            planer_akt_rodz,
            // miejsce_id,
            // gus_simc,
            miejsca,
            inna,
            // uwagi,
            wyslano,
            // nawozy,
            // nowyKlient,
            // sprzedaz,
            // zamowienie,
            // zboza,
            planer_klienci
          } = day;
          return (
            <div key={id} className={classes.row}>
              <IconButton
                onClick={() => this.handleEdit(id)}
                color="primary"
                className={classes.button}
                aria-label="Add to shopping cart"
                disabled={wyslano ? true : false}
              >
                <Edit />
              </IconButton>
              {/* <div style={{ display: "inline" }}> */}
              <span className={classes.hours}>
                {wezGodzine(start)} - {wezGodzine(stop)}
              </span>
              {/* </div> */}
              <span>
                <Icon
                  color="primary"
                  style={{
                    //position: "relative",
                    verticalAlign: "sub",
                    // marginTop: 3,
                    // width: 15,
                    opacity: "0.4",
                    marginLeft: 20,
                    marginRight: 5
                  }}
                >
                  <ClockIcon style={{ fontSize: 17 }} />
                </Icon>
                {minutes2hours(timeDiff(start, stop))}
              </span>
              <span className={classes.aktywnosc}>
                {aktywnosc_id === 5 ? inna : planer_akt_rodz.name}{" "}
                {/* {aktywnosc_id === 1 && gus_simc.nazwa} */}
                {aktywnosc_id === 1 && shortPlace(miejsca.name)}
              </span>
              <span className={classes.klient}>
                {planer_klienci && planer_klienci.name}
              </span>
              <RaportyAkcjeIndicator day={day} />

              <IconButton
                style={
                  {
                    //position: "absolute",
                    //right: "20px"
                  }
                }
                className={classes.button}
                aria-label="Delete"
                // onClick={() => this.handleDelete(id)}
                onClick={() => this.setState({ open: true, id })}
                disabled={wyslano ? true : false}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          );
        })}
      </div>
    );
  }
}

PlanerAktywnosciSingle.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps
    // actions
  )(PlanerAktywnosciSingle)
);
