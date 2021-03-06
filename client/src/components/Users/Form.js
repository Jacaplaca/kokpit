import React from "react";
import FormButtons from "../../common/FormButtons";
import { connect } from "react-redux";

import SelectItem from "../../common/inputs/SelectItem";
import { DatePicker } from "material-ui-pickers";
import InputComponent from "../../common/inputs/InputComponent";
import Expansion from "../../common/Expansion";
import {
  YMtoDate,
  dateToYM,
  validateEmail,
  validateRegister
} from "../../common/functions";
import SummaryAddingUser from "./SummaryAddingUser";
import { getString } from "../../translate";

const emailHelperMessage = language => {
  return getString("LOGIN_EMAIL_GIVE_CORRECT", language);
};

class UserForm extends React.Component {
  // static contextType = MyContext;
  state = {
    name: "",
    surname: "",
    email: "",
    password: "",
    disableSubmit: true,
    emailHelper: getString("LOGIN_EMAIL_GIVE_CORRECT", this.props.language),
    passwordHelper: getString("REGISTER_PASS_5", this.props.language),
    passwordHelper2: getString("REGISTER_PASS_DIFF", this.props.language),
    report: null,
    // report: {
    //   name: "Antoni",
    //   surname: "Maśoźeńskiewski",
    //   email: "dziewanowski@gmail.com",
    //   password: "Sd$#22D@#"
    // },
    accountInfoSent: null
  };

  componentWillReceiveProps(nextProps) {
    // console.log("form", nextProps);
    const { name, surname, email, password, password2 } = nextProps.values;
    if (nextProps !== this.props) {
      this.validate({ name, surname, email, password, password2 });
    }
  }

  validate = async ({ name, surname, email, password, password2 }) => {
    // console.log("validate", name, surname, email, password, password2);
    // const { email, password, password2 } = this.state;
    const validate = await validateRegister({
      email,
      password,
      password2
    });
    const {
      disableSubmit,
      emailHelper,
      passwordHelper,
      passwordHelper2
    } = validate;
    // console.log("validate", validate);

    this.setState({
      disableSubmit:
        this.props.auth.Company.accountType === "demo" ? true : disableSubmit,
      emailHelper,
      passwordHelper,
      passwordHelper2
    });
  };

  handleSubmit = async e => {
    const { values } = this.props;
    const result = await this.props.submit(e);
    // console.log("handleSubmit( in user form)", result);
    const report = Object.assign(result, {
      password: values.password,
      ediadd: "adding"
    });
    this.setState({ report });
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
      // value,
      handleAdd,
      action,
      addLabel,
      addFields,
      // disableSubmit,
      // suffix,
      // adding,
      validate,
      values,
      submit,
      activity,
      cancel,
      auth,
      language
    } = this.props;

    return (
      <Expansion title={getString("USER_ADD_LABEL", language)}>
        <div
          style={{
            display: "grid",
            gridGap: "2rem",
            gridTemplateColumns: `2fr minmax(400px, 1fr)`,
            padding: "1.3rem"
          }}
        >
          <div
            style={{
              display: "grid",
              gridGap: "2rem",
              gridTemplateRows: "auto",
              gridTemplateAreas:
                "'name surname surname' 'email password password2' 'buttons buttons buttons'",
              gridTemplateColumns: `minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr)`,
              padding: "1.3rem"
            }}
          >
            <div style={{ gridArea: "name" }}>
              <InputComponent
                // disabled={disabled}
                // key={i}
                name="name"
                label={getString("NAME", language)}
                type="text"
                edytuj={value => change("name", value, activity)}
                value={values.name || ""}
                // disabled={field2disabled}
              />
            </div>
            <div style={{ gridArea: "surname" }}>
              <InputComponent
                // disabled={disabled}
                // key={i}
                name="surname"
                label={getString("SURNAME", language)}
                type="text"
                edytuj={value => change("surname", value, activity)}
                value={values.surname || ""}
                // disabled={field2disabled}
              />
            </div>
            <div style={{ gridArea: "email" }}>
              <InputComponent
                // disabled={disabled}
                // key={i}
                name="email"
                label="Email"
                type="text"
                edytuj={value => change("email", value, activity)}
                value={values.email || ""}
                helperText={emailHelper}
                // disabled={field2disabled}
              />
            </div>
            <div style={{ gridArea: "password" }}>
              <InputComponent
                // disabled={disabled}
                // key={i}
                name="password"
                label={getString("LOGIN_PASS", language)}
                type="password"
                edytuj={value => change("password", value, activity)}
                value={values.password || ""}
                password
                helperText={passwordHelper}
                // disabled={field2disabled}
              />
            </div>
            <div style={{ gridArea: "password2" }}>
              <InputComponent
                // disabled={disabled}
                // key={i}
                name="password2"
                label={getString("CONFIRM_PASS", language)}
                type="password2"
                edytuj={value => change("password2", value, activity)}
                value={values.password2 || ""}
                password
                helperText={passwordHelper2}
                // disabled={field2disabled}
              />
            </div>
            {/* <InputComponent
                  disabled={disabled}
                  name="channel"
                  label={addLabel}
                  type="text"
                  edytuj={value =>
                    change(
                      addFields[0].dbField,
                      `${value.charAt(0).toUpperCase()}${value.slice(1)}`,
                      activity
                    )
                  }
                  value={value[addFields[0].dbField] || ""}
                  // disabled={field2disabled}
                /> */}
            {/* <AdditionalAddFields
                  fields={addFields}
                  change={change}
                  value={value}
                  disabled={disabled}
                  suffix={suffix}
                /> */}

            {/* <ButtonMy
                  onClick={action}
                  variant="contained"
                  color="primary"
                  disabled={!validateEdit(adding, validate)}
                >
                  <Add />
                </ButtonMy> */}
            <div style={{ gridArea: "buttons" }}>
              <FormButtons
                subDisable={disableSubmit}
                subLabel={
                  auth.Company.accountType === "demo"
                    ? getString("USER_ADD_CONFIRM_BUTTON_DEMO", language)
                    : getString("USER_ADD_CONFIRM_BUTTON", language)
                  //   modal && edit
                  //     ? "Potwierdź edycję"
                  //     : bonus > 0
                  //     ? `Dodaj premię ${formatNumber(bonus)} zł`
                  //     : "Potwierdź"
                }
                subAction={e => {
                  auth.Company.accountType === "demo"
                    ? console.log("demo")
                    : this.handleSubmit(e);
                }}
                cancelLabel={getString("CANCEL", language)}
                cancelAction={this.handleCancel}
              />
            </div>
          </div>
          {report && (
            <SummaryAddingUser
              report={report}
              cancel={this.nullingReport}
              send={this.handleSendAccountInfo}
              ok={accountInfoSent}
            />
          )}
        </div>
      </Expansion>
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

function mapStateToProps({ language }) {
  return { language };
}

export default connect(
  mapStateToProps,
  null
)(UserForm);

// export default UserForm;
