import React from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { getYear } from "date-fns";
import { DateRangePicker, createStaticRanges } from "react-date-range";
import { pl } from "react-date-range/src/locale/index";
import { defineds } from "../common/functions";

const staticRanges = [
  // ...defaultStaticRanges,
  ...createStaticRanges([
    {
      label: "Dziś",
      range: () => ({
        startDate: defineds.startOfToday,
        endDate: defineds.endOfToday
      })
    },
    {
      label: "Wczoraj",
      range: () => ({
        startDate: defineds.startOfYesterday,
        endDate: defineds.endOfYesterday
      })
    },

    {
      label: "Bieżący tydzień",
      range: () => ({
        startDate: defineds.startOfWeek,
        endDate: defineds.endOfWeek
      })
    },
    {
      label: "Poprzedni tydzień",
      range: () => ({
        startDate: defineds.startOfLastWeek,
        endDate: defineds.endOfLastWeek
      })
    },
    {
      label: "Bieżący miesiąc",
      range: () => ({
        startDate: defineds.startOfMonth,
        endDate: defineds.endOfMonth
      })
    },
    {
      label: "Poprzedni miesiąc",
      range: () => ({
        startDate: defineds.startOfLastMonth,
        endDate: defineds.endOfLastMonth
      })
    }
  ])
];

const configRanges = [
  // ...defaultStaticRanges,
  ...createStaticRanges([
    {
      label: "Bieżący miesiąc",
      range: () => ({
        startDate: defineds.startOfMonth,
        endDate: defineds.endOfMonth
      })
    },
    {
      label: "Następny miesiąc",
      range: () => ({
        startDate: defineds.startOfNextMonth,
        endDate: defineds.endOfNextMonth
      })
    },
    {
      label: `Pierwszy kwartał ${getYear(new Date())}`,
      range: () => ({
        startDate: defineds.startFirstQuarter,
        endDate: defineds.endFirstQuarter
      })
    },
    {
      label: `Drugi kwartał ${getYear(new Date())}`,
      range: () => ({
        startDate: defineds.startSecondQuarter,
        endDate: defineds.endSecondQuarter
      })
    },
    {
      label: `Trzeci kwartał ${getYear(new Date())}`,
      range: () => ({
        startDate: defineds.startThirdQuarter,
        endDate: defineds.endThirdQuarter
      })
    },
    {
      label: `Czwarty kwartał ${getYear(new Date())}`,
      range: () => ({
        startDate: defineds.startFourthQuarter,
        endDate: defineds.endFourthQuarter
      })
    }
  ])
];

const styles = {};

function DateTimePickerMy(props) {
  const { classes, range, onChange, nopaper } = props;

  const { startDate, endDate } = range[0];

  const startDateString = new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "long",
    day: "2-digit"
  }).format(startDate);
  const endDateString = new Intl.DateTimeFormat("pl-PL", {
    year: "numeric",
    month: "long",
    day: "2-digit"
  }).format(endDate);

  //const zakres = `Zakres: ${startDateString} - ${endDateString}`;

  return nopaper ? (
    <DateRangePicker
      locale={pl}
      inputRanges={[]}
      staticRanges={configRanges}
      showSelectionPreview={true}
      ranges={range}
      onChange={onChange}
      moveRangeOnFirstSelection={false}
      months={2}
      direction="horizontal"
      rangeColors={["#303f9f"]}
    />
  ) : (
    <ExpansionPanel style={{ marginTop: 20, marginBottom: 20 }}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          <span
            style={{
              fontWeight: "600"
            }}
          >
            Zakres: {startDateString} - {endDateString}
          </span>
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails style={{ display: "block" }}>
        <DateRangePicker
          locale={pl}
          inputRanges={[]}
          staticRanges={staticRanges}
          showSelectionPreview={true}
          ranges={range}
          onChange={onChange}
          moveRangeOnFirstSelection={false}
          months={2}
          direction="horizontal"
          rangeColors={["#303f9f"]}
        />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

DateTimePickerMy.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DateTimePickerMy);
