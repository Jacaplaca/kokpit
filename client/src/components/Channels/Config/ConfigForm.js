import React from "react";
import FormButtons from "../../../common/FormButtons";

import SelectItem from "../../../common/inputs/SelectItem";
import { DatePicker } from "material-ui-pickers";
import InputComponent from "../../../common/inputs/InputComponent";
import InputData from "../../../common/inputs/InputData";
// import SelectItem from "../../../common/SelectItem";
import {
  YMtoDate,
  dateToYM,
  validateEmail,
  validateRegister
} from "../../../common/functions";
// import SummaryAddingUser from "./SummaryAddingUser";

class ConfigForm extends React.Component {
  // static contextType = MyContext;
  state = {
    // from: "",
    // to: "",
    // bonusType: ""
    // name: "",
    // surname: "",
    // email: "",
    // password: "",
    disableSubmit: true
    // emailHelper: "Podaj prawidłowy adres email",
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
  };

  addIdsToState = async () => {
    const { channelId, itemId, change, activity } = this.props;
    await change("channelId", channelId, activity);
    change("itemId", itemId, activity);
  };

  validate = async ({ from, to, bonusType, bonus }) => {
    console.log("ftbb", from, to, bonusType, bonus);
    if (bonus === "" || bonusType === "" || from === "") {
      this.setState({
        disableSubmit: true
        // emailHelper,
        // passwordHelper,
        // passwordHelper2
      });
    } else {
      this.setState({
        disableSubmit: false
      });
    }
    // // console.log("validate", name, surname, email, password, password2);
    // // const { email, password, password2 } = this.state;
    // const validate = await validateRegister({
    //   email,
    //   password,
    //   password2
    // });
    // const {
    //   disableSubmit,
    //   emailHelper,
    //   passwordHelper,
    //   passwordHelper2
    // } = validate;
    // // console.log("validate", validate);
    //
    // this.setState({
    //   disableSubmit,
    //   emailHelper,
    //   passwordHelper,
    //   passwordHelper2
    // });
  };

  handleSubmit = async e => {
    // const { values } = this.props;
    const result = await this.props.submit(e);
    // console.log("handleSubmit( in user form)", result);
    // const report = Object.assign(result, {
    //   password: values.password,
    //   ediadd: "adding"
    // });
    this.addIdsToState();
    // console.log("result", result);
    // this.setState({ report });
  };

  handleSendAccountInfo = async report => {
    const resp = await fetch("/api/accountinfo/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(report)
    });
    const response = await resp.json();
    // console.log("response", response);
    this.setState({ accountInfoSent: response.email });

    // this.nullingReport();
  };

  nullingReport = () => {
    this.setState({ report: null, sendAccountInfo: null });
  };

  handleCancel = () => {
    this.props.cancel();
    this.nullingReport();
  };

  render() {
    const {
      disableSubmit,
      emailHelper,
      passwordHelper,
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
              "'from to bonusType bonus' 'buttons buttons buttons buttons'",
            gridTemplateColumns: `minmax(60px, 1fr) minmax(60px, 1fr) minmax(150px, 2fr) minmax(60px, 1fr)`,
            // paddingLeft: "1.3rem",
            paddingTop: "1.3rem"
            // paddingRight: "1.3rem"
          }}
        >
          <div style={{ gridArea: "from" }}>
            <InputData
              id="date"
              name="from"
              //disabled={modal ? true : false}
              label="Od kiedy"
              //error={this.state.errorKiedy}
              //label="Kiedy"
              type="date"
              edytuj={value => change("from", value, activity)}
              value={values.from}
            />
          </div>
          <div style={{ gridArea: "to" }}>
            <InputData
              id="date"
              name="to"
              //disabled={modal ? true : false}
              label="Do kiedy"
              //error={this.state.errorKiedy}
              //label="Kiedy"
              type="date"
              edytuj={value => change("to", value, activity)}
              value={values.to}
            />
          </div>
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
