import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import currency from "currency.js";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import PieChart1 from "./PieChart1";

const styles = {};

function CostsPodsumowanie(props) {
  const { classes, costs } = props;

  const sumOfKey = (data, key) => {
    let dane;
    let sorting;
    switch (key) {
      case "category":
        dane = _(data)
          .groupBy("category.name")
          .map((v, k) => {
            const suma = _.sumBy(v, "kwota_netto");
            return {
              name: k,
              value: Math.round(suma),
              value_format: `${currency(Math.round(suma), {
                separator: " ",
                decimal: ","
              }).format()}`
            };
          })
          .value();
        sorting = dane.sort(function(a, b) {
          return a.value - b.value;
        });
        return sorting.reverse();
        break;
      case "group":
        dane = _(data)
          .groupBy("group.name")
          .map((v, k) => {
            const suma = _.sumBy(v, "kwota_netto");
            return {
              name: k,
              value: suma,
              value_format: `${currency(Math.round(suma), {
                separator: " ",
                decimal: ","
              }).format()}`
            };
          })
          .value();
        sorting = dane.sort(function(a, b) {
          return a.value - b.value;
        });
        return sorting.reverse();
        break;
      default:
    }
  };

  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          <span
            style={{
              fontWeight: "600"
            }}
          >
            Podsumowanie
          </span>
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ display: "block" }}>
        <div>
          <PieChart1
            dane={sumOfKey(costs, "category")}
            label="Kategorie"
            // group={this.sumOfKey(this.costs(), 'group')}
          />
        </div>
        <div>
          <PieChart1
            // category={this.sumOfKey(this.costs(), 'category')}
            dane={sumOfKey(costs, "group")}
            label="Grupy"
          />
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

CostsPodsumowanie.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CostsPodsumowanie);
