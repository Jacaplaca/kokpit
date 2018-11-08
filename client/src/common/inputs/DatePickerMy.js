import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import { withStyles } from "@material-ui/core/styles";
import { DatePicker } from "material-ui-pickers";
import InputSelectTextField from "./InputSelectTextField";
import { dataToString } from "../../common/functions";
///import "../external/icon.css";
import "../../external/icon.css";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";

import plLocale from "date-fns/locale/pl";

let theme;

const localeMap = {
  pl: plLocale
};

const materialTheme = () => {
  return createMuiTheme({
    overrides: {
      // MuiPickersToolbar: {
      //   toolbar: {
      //     backgroundColor: lightBlue.A200
      //   }
      // },
      // MuiPickersCalendarHeader: {
      //   switchHeader: {
      //     // backgroundColor: lightBlue.A200,
      //     // color: 'white',
      //   }
      // },
      MuiPickersDay: {
        day: {
          backgroundColor: theme
            ? fade(theme.palette.primary.light, 0.24)
            : "black",
          //color: "white",
          fontWeight: "800",
          color: "gray"
        },
        selected: {
          backgroundColor: theme ? theme.palette.secondary.main : "black",
          color: "white",
          fontWeight: "800"
        },
        current: {
          backgroundColor: theme ? theme.palette.primary.main : "black",
          color: "white",
          fontWeight: "800"
        },
        disabled: {
          color: "gray",
          backgroundColor: "white",
          background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'><path fill='transparent' stroke-width='2' stroke='lightgray' d='M 10,10 L 27,27 M 27,10 L 10,27'/></svg>")`,
          // textDecoration: "line-through",
          fontWeight: "400"
        }
      }
      // MuiPickersModal: {
      //   dialogAction: {
      //     color: lightBlue["400"]
      //   }
      // }
    }
  });
};

function disableWeekends(date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

const DatePickerMy = props => {
  const {
    value,
    edytuj,
    name,
    label,
    // allowedDates,
    error,
    placeholder,
    loading,
    enableDisableDates,
    allowed,
    disallowed
  } = props;

  theme = props.theme;

  function enableSome(date) {
    if (allowed) {
      return !enableDisableDates.some(
        x => dataToString(date) === dataToString(x)
      );
    } else if (disallowed) {
      return enableDisableDates.some(
        x => dataToString(date) === dataToString(x)
      );
    }
  }

  // function formatDays(date) {
  //   return allowedDates.some(x => dataToString(date) === dataToString(x)) ? (
  //     <div>{date.getDate()}</div>
  //   ) : (
  //     <div>{date.getDate()}</div>
  //   );
  // }

  return (
    <MuiThemeProvider theme={enableDisableDates && materialTheme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap["pl"]}>
        <DatePicker
          //classes={{ root: styles.buttonRoot }}
          //keyboard
          //clearable
          // mask={[
          //   "(",
          //   /[1-9]/,
          //   /\d/,
          //   /\d/,
          //   ")",
          //   " ",
          //   /\d/,
          //   /\d/,
          //   /\d/,
          //   "-",
          //   /\d/,
          //   /\d/,
          //   /\d/,
          //   /\d/
          // ]}
          mask={[
            /[0-3]/,
            /[0-9]/,
            "-",
            /[0-1]/,
            /[0-9]/,
            "-",
            /[1-2]/,
            /[0-9]/,
            /[0-9]/,
            /[0-9]/
          ]}
          autoOk
          format="dd-MM-yyyy"
          name={name}
          label={label}
          //value={value || new Date()}
          value={value || null}
          //onChange={this.handleDateChange}
          onChange={date =>
            edytuj({ target: { name, value: dataToString(date) } })
          }
          //clearLabel="Czyść"
          //onChange={edytuj}
          //edytuj={this.handleChange}
          TextFieldComponent={InputSelectTextField}
          //adornmentPosition="end"
          // InputAdornmentProps={<div>asdf</div>}
          cancelLabel="Anuluj"
          //shouldDisableDate={enableDisableDates && enableSome}
          shouldDisableDate={enableDisableDates && enableSome}
          error={error}
          emptyLabel={placeholder}
          //emptyLabel="DD-MM-RRRR"
          //loading={loading}
          //renderDay={formatDays}
          disabled={loading}
          invalidDateMessage="Błędna data"
        />
      </MuiPickersUtilsProvider>
    </MuiThemeProvider>
  );
};

DatePickerMy.defaultProps = {
  placeholder: "Wybierz dzień",
  disabled: false
};

//export default DatePickerMy;
export default withStyles(materialTheme, { withTheme: true })(DatePickerMy);
