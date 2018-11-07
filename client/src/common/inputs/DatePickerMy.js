import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "material-ui-pickers";
import { DatePicker } from "material-ui-pickers";
import InputSelectTextField from "./InputSelectTextField";
import { dataToString } from "../../common/functions";
///import "../external/icon.css";
import "../../external/icon.css";
import plLocale from "date-fns/locale/pl";

const localeMap = {
  pl: plLocale
};

const allowed = [
  "2018-11-04",
  "2018-11-06",
  "2018-11-07",
  "2018-11-01",
  "2018-11-15"
];

// function disableRandomDates() {
//   console.log(Math.random());
//   return Math.random() > 0.7;
// }

function disableWeekends(date) {
  return date.getDay() === 0 || date.getDay() === 6;
}

function enableSome(date) {
  return !allowed.some(x => dataToString(date) === dataToString(x));
}

const DatePickerMy = props => {
  const { value, edytuj, name, label } = props;
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap["pl"]}>
      <DatePicker
        //keyboard
        //clearable
        autoOk
        format="dd-MM-yyyy"
        name={name}
        label={label}
        value={value || new Date()}
        //onChange={this.handleDateChange}
        onChange={date => edytuj({ target: { name, value: date } })}
        //onChange={edytuj}
        //edytuj={this.handleChange}
        TextFieldComponent={InputSelectTextField}
        //adornmentPosition="end"
        // InputAdornmentProps={<div>asdf</div>}
        cancelLabel="Anuluj"
        shouldDisableDate={enableSome}
      />
    </MuiPickersUtilsProvider>
  );
};

export default DatePickerMy;
