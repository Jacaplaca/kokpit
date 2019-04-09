import React from "react";
import _ from "lodash";
import FormButtons from "../../../common/FormButtons";

import SelectItem from "../../../common/inputs/SelectItem";
import { DatePicker } from "material-ui-pickers";
import InputComponent from "../../../common/inputs/InputComponent";
import InputData from "../../../common/inputs/InputData";
import DateRangePickerMy from "../../../common/DateRangePickerMy";
// import SelectItem from "../../../common/SelectItem";
import {
  YMtoDate,
  dateToYM,
  validateEmail,
  validateRegister,
  defineds,
  dataToString
} from "../../../common/functions";
// import SummaryAddingUser from "./SummaryAddingUser";

class ConfigForm extends React.Component {
  // static contextType = MyContext;
  state = {
    rangeselection: {
      // startDate: defineds.startOfMonth,
      // endDate: defineds.endOfMonth,
      // key: "rangeselection"
    },
    // from: "",
    // to: "",
    // bonusType: ""
    // name: "",
    // surname: "",
    // email: "",
    // password: "",
    disableSubmit: true,
    fromHelper: "Data rozpoczęcia",
    toHelper: "Data zakończenia"
    // passwordHelper: "Hasło powinno mieć conajmniej 5 znaków",
    // passwordHelper2: "Hasła nie mogą się różnić",
    // report: null,
    // // report: {
    // //   name: "Antoni",
    // //   surname: "Maśoźeńskiewski",
    // //   email: "dziewanowski@gmail.com",
    // //   password: "Sd$#22D@#"
    // // },
    // accountInfoSent: null
  };

  componentWillReceiveProps(nextProps) {
    // console.log("form", nextProps);
    const { from, to, bonusType, bonus } = this.props.values;
    const {
      from: fromNext,
      to: toNext,
      bonusType: bonusTypeNext,
      bonus: bonusNext
    } = nextProps.values;

    const fromDiff = from !== fromNext;
    const toDiff = to !== toNext;
    const bonusTypeDiff = bonusType !== bonusTypeNext;
    const bonusDiff = bonus !== bonusNext;

    if (fromDiff || toDiff || bonusDiff || bonusTypeDiff) {
      this.validate({
        from: fromNext,
        to: toNext,
        bonusType: bonusTypeNext,
        bonus: bonusNext
      });
    }

    //
    // if (channelId !== channelId.nextProps) {
    //   change("channelId", channelId, activity);
    // } else if (itemId !== itemId.nextProps) {
    //   change("itemId", itemId, activity);
    // }
    // if (nextProps !== this.props) {
    //   this.validate({ name, surname, email, password, password2 });
    // }
  }

  componentDidMount = () => {
    this.addIdsToState();
    this.defaultRange();
  };

  addIdsToState = async () => {
    const { channelId, itemId, change, activity } = this.props;
    await change("channelId", channelId, activity);
    change("itemId", itemId, activity);
  };

  validate = async ({ from, to, bonusType, bonus }) => {
    const { items, overlapsing, activity, itemId, editedId } = this.props;
    let itemsToIter;
    if (activity === "editing") {
      const itemsCloned = _.clone(items);
      itemsToIter = itemsCloned.filter(config => config.id !== editedId);
    } else {
      itemsToIter = items;
    }
    console.log("itemsToIter", itemsToIter);

    const fromTimeQ = new Date(from).getTime();
    const toTimeQ = new Date(to).getTime();
    let validates = [];
    let fromHelper = "Data rozpoczęcia";
    let toHelper = "Data zakończenia";
    if (from !== "" && to !== "") {
      if (fromTimeQ < toTimeQ) {
        let overlaps = [];
        for (let item of itemsToIter) {
          const fromTime = new Date(item.from).getTime();
          const toTime = new Date(item.to).getTime();
          const fromOverlaping = fromTimeQ >= fromTime && fromTimeQ <= toTime;
          const toOverlaping = toTimeQ >= fromTime && toTimeQ <= toTime;
          const eatingWhole = toTimeQ >= toTime && fromTimeQ <= fromTime;
          if (fromOverlaping || toOverlaping || eatingWhole) {
            overlaps.push(item);
            fromHelper = "Zachodzi na już zapisany zakres";
            toHelper = "Zachodzi na już zapisany zakres";
            validates.push(false);
          } else {
            validates.push(true);
          }
        }
        overlapsing(overlaps.map(x => x.id));
      } else {
        validates.push(false);
        fromHelper = "Data rozpoczęcia musi być wcześniejsza niż zakończenia";
        toHelper = "Data zakończenia musi być późniejsza niż rozpoczęcia";
      }
    } else {
      validates.push(false);
    }

    if (bonusType === "" || bonus === "") {
      validates.push(false);
    } else {
      validates.push(true);
    }
    const disableSubmit = validates.includes(false);
    this.setState({ disableSubmit, fromHelper, toHelper });
  };

  handleSubmit = async e => {
    // const { values } = this.props;
    await this.addIdsToState();
    const result = await this.props.submit(e);
    // console.log("handleSubmit( in user form)", result);
    // const report = Object.assign(result, {
    //   password: values.password,
    //   ediadd: "adding"
    // });
    this.props.cancel();
    // console.log("result", result);
    // this.setState({ report });
  };

  // handleSendAccountInfo = async report => {
  //   const resp = await fetch("/api/accountinfo/", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     credentials: "same-origin",
  //     body: JSON.stringify(report)
  //   });
  //   const response = await resp.json();
  //   // console.log("response", response);
  //   this.setState({ accountInfoSent: response.email });
  //
  //   // this.nullingReport();
  // };

  // nullingReport = () => {
  //   this.setState({ report: null, sendAccountInfo: null });
  // };

  handleCancel = () => {
    this.props.cancel();
    // this.nullingReport();
  };

  defaultRange = async ranges => {
    const { activity, change } = this.props;
    let startDate;
    let endDate;
    if (ranges) {
      startDate = ranges.rangeselection.startDate;
      endDate = ranges.rangeselection.endDate;
      console.log("ranges", startDate, endDate);
    } else {
      startDate = defineds.startOfNextMonth;
      endDate = defineds.endOfNextMonth;
    }

    const rangeselection = { endDate, startDate, key: "rangeselection" };
    await change("to", dataToString(endDate), activity);
    await change("from", dataToString(startDate), activity);
    this.setState({ rangeselection });
  };

  handleSelect = ranges => {
    console.log("ranges", ranges);
    const { startDate, endDate } = ranges.rangeselection;

    const startDateString = dataToString(startDate);
    const endDateString = dataToString(endDate);

    console.log("ranges", startDateString, endDateString);
    this.setState({
      ...ranges
    });
    // this.fetchCosts(ranges);
  };

  render() {
    const {
      disableSubmit,
      fromHelper,
      toHelper,
      passwordHelper2,
      report,
      accountInfoSent
    } = this.state;
    const {
      change,
      // // value,
      // handleAdd,
      // action,
      // addLabel,
      // addFields,
      // // disableSubmit,
      // // suffix,
      // // adding,
      // validate,
      values,
      // submit,
      activity,
      // cancel
      // from,
      // to,
      // bonusType
      channelId,
      itemId,
      label
    } = this.props;
    const suffix = bonusType => {
      if (bonusType === "% marży") {
        return "%";
      } else if (bonusType === "stawka") {
        return "zł";
      } else {
        return "";
      }
    };
    return (
      <div style={{ padding: "1.3rem" }}>
        <h6>{label}</h6>

        <div
          style={{
            display: "grid",
            gridGap: "1.5rem",
            gridTemplateRows: "auto",
            gridTemplateAreas:
              " 'bonusType bonus' 'from from ' ' buttons buttons'",
            gridTemplateColumns: `minmax(120px, 1fr)   minmax(120px, 1fr)`,
            // paddingLeft: "1.3rem",
            paddingTop: "1.3rem"
            // paddingRight: "1.3rem"
          }}
        >
          <div style={{ gridArea: "from" }}>
            {/* <InputData
              id="date"
              name="from"
              //disabled={modal ? true : false}
              label="Od kiedy"
              //error={this.state.errorKiedy}
              //label="Kiedy"
              helperText={fromHelper}
              type="date"
              edytuj={value => change("from", value, activity)}
              value={values.from}
            /> */}
            <DateRangePickerMy
              onChange={this.defaultRange}
              range={[this.state.rangeselection]}
              nopaper
            />
          </div>
          {/* <div style={{ gridArea: "to" }}>
            <InputData
              id="date"
              name="to"
              //disabled={modal ? true : false}
              label="Do kiedy"
              //error={this.state.errorKiedy}
              //label="Kiedy"
              type="date"
              helperText={toHelper}
              edytuj={value => change("to", value, activity)}
              value={values.to}
            />
          </div> */}
          <div style={{ gridArea: "bonusType" }}>
            <SelectItem
              // simpleInput
              // short
              format={"select"}
              // prefix={field.label}
              // disabled={disabled}
              // key={i}
              label={values.bonusType || "Marża % / Stawka zł?"}
              select={["% marży", "stawka"]}
              value={values.bonusType || ""}
              updateSelected={value => change("bonusType", value, activity)}
            />
          </div>
          <div style={{ gridArea: "bonus" }}>
            <InputComponent
              // disabled={disabled}
              // key={i}
              name="bonus"
              label="Premia"
              // type=""
              edytuj={value => change("bonus", value, activity)}
              value={values.bonus || ""}
              format="number"
              suffix={suffix(values.bonusType)}
              // prefix="ad"
              // password
              // helperText={passwordHelper}
              // disabled={field2disabled}
            />
          </div>
          <div style={{ gridArea: "password2" }} />
          <div style={{ gridArea: "buttons" }}>
            <FormButtons
              subDisable={disableSubmit}
              subLabel={
                "Dodaj prowizję"
                //   modal && edit
                //     ? "Potwierdź edycję"
                //     : bonus > 0
                //     ? `Dodaj premię ${formatNumber(bonus)} zł`
                //     : "Potwierdź"
              }
              subAction={e => this.handleSubmit(e)}
              cancelLabel={"Anuluj"}
              cancelAction={this.handleCancel}
            />
          </div>
        </div>
      </div>
    );
  }
}

// const Summary = ({ report }) => {
//   return report ? (
//     <div>
//       {report.name} {report.surname} {report.password} {report.email}
//     </div>
//   ) : null;
// };

export default ConfigForm;
