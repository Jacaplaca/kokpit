import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const Expansion = ({ children, title }) => (
  <ExpansionPanel>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>
        <span
          style={{
            fontWeight: "600"
          }}
        >
          {title}
        </span>
      </Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails style={{ display: "block" }}>
      {children}
    </ExpansionPanelDetails>
  </ExpansionPanel>
);

export default Expansion;
