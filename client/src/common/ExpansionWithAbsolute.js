import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Paper from "@material-ui/core/Paper";

const styles = theme => ({
  root: {
    width: "100%"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
    fontWeight: 600
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  }
});

class ExpansionWithAbsolute extends React.Component {
  state = {
    expanded: null
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
  };

  render() {
    const { classes, children, title } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classes.root}>
        <Paper elevation={expanded === "panel1" ? 2 : 0}>
          <ExpansionPanel
            elevation={expanded === "panel1" ? 0 : 2}
            expanded={expanded === "panel1"}
            onChange={this.handleChange("panel1")}
          >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>{title}</Typography>
              {/* <Typography className={classes.secondaryHeading}>
              I am an expansion panel
            </Typography> */}
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ display: "block" }}>
              {expanded !== "panel1" && children}
            </ExpansionPanelDetails>
          </ExpansionPanel>
          {expanded === "panel1" && children}
        </Paper>
      </div>
    );
  }
}

ExpansionWithAbsolute.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ExpansionWithAbsolute);
