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
import { durationLabel } from "../common/functions";

import {
  addDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
  differenceInCalendarDays
} from "date-fns";

import { DateRangePicker, createStaticRanges } from "react-date-range";
import { pl } from "react-date-range/src/locale/index";
import { defineds } from "../common/functions";
import ButtonMy from "../common/ButtonMy";

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

const configInputRanges = [
  {
    label: "dni do dzisiaj",
    range(value) {
      return {
        startDate: addDays(
          defineds.startOfToday,
          (Math.max(Number(value), 1) - 1) * -1
        ),
        endDate: defineds.endOfToday
      };
    },
    getCurrentValue(range) {
      if (!isSameDay(range.endDate, defineds.endOfToday)) return "-";
      if (!range.startDate) return "∞";
      return differenceInCalendarDays(defineds.endOfToday, range.startDate) + 1;
    }
  },
  {
    label: "dni od dzisiaj",
    range(value) {
      const today = new Date();
      return {
        startDate: today,
        endDate: addDays(today, Math.max(Number(value), 1) - 1)
      };
    },
    getCurrentValue(range) {
      if (!isSameDay(range.startDate, defineds.startOfToday)) return "-";
      if (!range.endDate) return "∞";
      return differenceInCalendarDays(range.endDate, defineds.startOfToday) + 1;
    }
  }
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

class DateTimePickerMy extends React.Component {
  //const zakres = `Zakres: ${startDateString} - ${endDateString}`;
  render() {
    const {
      classes,
      range,
      onChange,
      nopaper,
      expand,
      defaultExp,
      config
    } = this.props;
    return nopaper ? (
      <div>
        <ExpansionPanel
          expanded={expand}
          defaultExpanded={defaultExp ? true : false}
          elevation={nopaper ? 0 : 2}
          // style={{ marginTop: 20, marginBottom: 20 }}
        >
          {/* <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <ButtonMy>
            <Typography>
              <span
                style={{
                  fontWeight: "600"
                }}
              >
                Zakres: {startDateString} - {endDateString}
              </span>
            </Typography>
          </ButtonMy>
        </ExpansionPanelSummary> */}
          <ExpansionPanelDetails style={{ display: "block" }}>
            <DateRangePicker
              locale={pl}
              inputRanges={configInputRanges}
              staticRanges={config ? configRanges : staticRanges}
              showSelectionPreview={true}
              ranges={range}
              onChange={onChange}
              moveRangeOnFirstSelection={false}
              months={2}
              direction="horizontal"
              rangeColors={["#303f9f"]}
              // onChange={this.handleRangeChange.bind(this, 'dateRangePicker')}
              // showSelectionPreview={true}
              // moveRangeOnFirstSelection={false}
              className={"PreviewArea"}
              // months={2}
              // ranges={[this.state.dateRangePicker.selection]}
              // direction="horizontal"
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    ) : (
      <div style={{ backgroundColor: "red" }}>
        <ExpansionPanel
          defaultExpanded={defaultExp ? true : false}
          elevation={nopaper ? 0 : 2}
          // style={{ marginTop: 20, marginBottom: 20 }}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              <span
                style={{
                  fontWeight: "600"
                }}
              >
                Zakres: {durationLabel([range])}
              </span>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{ display: "block" }}>
            <DateRangePicker
              locale={pl}
              inputRanges={configInputRanges}
              staticRanges={config ? configRanges : staticRanges}
              showSelectionPreview={true}
              ranges={range}
              onChange={onChange}
              moveRangeOnFirstSelection={false}
              months={2}
              direction="horizontal"
              rangeColors={["#303f9f"]}
              // onChange={this.handleRangeChange.bind(this, 'dateRangePicker')}
              // showSelectionPreview={true}
              // moveRangeOnFirstSelection={false}
              className={"PreviewArea"}
              // months={2}
              // ranges={[this.state.dateRangePicker.selection]}
              // direction="horizontal"
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

DateTimePickerMy.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DateTimePickerMy);
