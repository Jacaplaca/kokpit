import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import Chip from "@material-ui/core/Chip";

const styles = theme => ({
  root: {
    //display: "flex",
    justifyContent: "center",
    flexWrap: "wrap"
  },
  chip: {
    margin: theme.spacing.unit / 2,
    color: "white",
    backgroundColor: fade(theme.palette.secondary.light, 1)
  }
});

function RaportyAkcjeIndicator(props) {
  const { classes, text, day } = props;
  const { nawozy, nowyKlient, sprzedaz, zamowienie, zboza } = day;

  return (
    <span className={classes.root}>
      {nawozy ? <Chip label="Nawozy" className={classes.chip} /> : null}
      {nowyKlient ? (
        <Chip label="Nowy klient" className={classes.chip} />
      ) : null}
      {sprzedaz ? <Chip label="Sprzedaż" className={classes.chip} /> : null}
      {zamowienie ? <Chip label="Zamówienie" className={classes.chip} /> : null}
      {zboza ? <Chip label="Zboża" className={classes.chip} /> : null}
    </span>
  );
}

RaportyAkcjeIndicator.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(RaportyAkcjeIndicator);
