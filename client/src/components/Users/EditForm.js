import React from "react";
import FormButtons from "../../common/FormButtons";

import SelectItem from "../../common/inputs/SelectItem";
import { DatePicker } from "material-ui-pickers";
import InputComponent from "../../common/inputs/InputComponent";
import {
  YMtoDate,
  dateToYM,
  validateEmail,
  validateRegister,
  shallowEqual
} from "../../common/functions";
import SummaryAddingUser from "./SummaryAddingUser";
import ButtonMy from "../../common/ButtonMy";

class EditUser extends React.Component {
  // static contextType = MyContext;
  state = {
    name: "",
    surname: "",
    email: "",
    password: "",
    disableSubmit: true,
    // originalEmail: "",
    emailHelper: "Podaj prawidłowy adres email",
    passwordHelper: "Hasło powinno mieć conajmniej 5 znaków",
    passwordHelper2: "Hasła nie mogą się różnić",
    report: null,
    // report: {
    //   name: "Antoni",
    //   surname: "Maśoźeńskiewski",
    //   email: "dziewanowski@gmail.com",
    //   password: "Sd$#22D@#"
    // },
    accountInfoSent: null,
    changePassword: false
  };

  // componentDidMount = () => {
  //   this.setState({
  //     originalEmail: this.props.values.email
  //     // password: "",
  //     // password2: ""
  //   });
  // };

  componentWillReceiveProps(nextProps) {
    // console.log(
    //   "form",
    //   nextProps.values,
    //   this.props.values,
    //   shallowEqual(nextProps.values, this.props.values)
    // );
    const { name, surname, email, password, password2 } = nextProps.values;
    if (!shallowEqual(nextProps.values, this.props.values)) {
      this.validate(
        { name, surname, email, password, password2 },
        this.state.changePassword
      );
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { name, surname, email, password, password2 } = nextProps.values;
    if (nextState.changePassword !== this.state.changePassword) {
      this.validate(
        { name, surname, email, password, password2 },
        nextState.changePassword
      );
    }
  }

  validate = async (
    { name, surname, email, password, password2 },
    changePassword
  ) => {
    const { originalEmail } = this.props.values;
    // console.log(
    //   "validate",
    //   name,
    //   surname,
    //   email,
    //   password,
    //   password2,
    //   changePassword
    // );
    // const { email, password, password2 } = this.state;

    let validate;
    if (changePassword) {
      validate = await validateRegister({
        email,
        password,
        password2,
        originalEmail
      });
    } else {
      validate = await validateRegister({
        email,
        password: "cccccc",
        password2: "cccccc",
        originalEmail
      });
    }

    const {
      disableSubmit,
      emailHelper,
      passwordHelper,
      passwordHelper2
    } = validate;
    console.log("validate", validate);

    this.setState({
      disableSubmit,
      emailHelper,
      passwordHelper,
      passwordHelper2
    });
  };

  handleSubmit = async e => {
    const { values } = this.props;
    const result = await this.props.submit(e);
    // console.log("handleSubmit( in user form)", result);
    const report = Object.assign(result, { ediadd: "editing" });
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

  changePassword = () => {
    this.setState(state => {
      return {
        changePassword: !state.changePassword
      };
    });
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
      accountInfoSent,
      changePassword
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
      cancel
    } = this.props;

    return (
      <div>
        <div
          style={{
            // display: "grid",
            // gridGap: "2rem",
            // gridTemplateColumns: `2fr 1fr`,
            padding: "1rem"
          }}
        >
          {!report && (
            <div
              style={{
                display: "grid",
                gridGap: "2rem",
                gridTemplateRows: "auto",
                gridTemplateAreas:
                  "'name surname surname' 'email password password2'",
                gridTemplateColumns: `minmax(200px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr)`,
                padding: "0.8rem"
              }}
            >
              <div style={{ gridArea: "name" }}>
                <InputComponent
                  // disabled={disabled}
                  // key={i}
                  name="name"
                  label="Imię"
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
                  label="Nazwisko"
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

              {changePassword && (
                <div style={{ gridArea: "password" }}>
                  <InputComponent
                    // disabled={disabled}
                    // key={i}
                    name="password"
                    label="Hasło"
                    type="password"
                    edytuj={value => change("password", value, activity)}
                    value={values.password || ""}
                    password
                    helperText={passwordHelper}
                    // disabled={field2disabled}
                  />
                </div>
              )}
              {changePassword && (
                <div style={{ gridArea: "password2" }}>
                  <InputComponent
                    // disabled={disabled}
                    // key={i}
                    name="password2"
                    label="Potwierdź hasło"
                    type="password2"
                    edytuj={value => change("password2", value, activity)}
                    value={values.password2 || ""}
                    password
                    helperText={passwordHelper2}
                    // disabled={field2disabled}
                  />
                </div>
              )}
            </div>
          )}

          {report && (
            <SummaryAddingUser
              report={report}
              cancel={this.handleCancel}
              send={this.handleSendAccountInfo}
              ok={accountInfoSent}
              headline="Konto pracownika zostało pomyślnie zmienione"
              footer="Czy chcesz wysłać pracownikowi email z nowymi danymi dostępowymi do jego konta?"
            />
          )}
          {!report && (
            <div
              style={{
                gridArea: "buttons",
                display: "grid",
                gridTemplateColumns: "2fr 1fr"
              }}
            >
              {/* <div style={{ gridArea: "change" }}> */}

              {/* </div> */}
              <FormButtons
                subDisable={disableSubmit}
                subLabel={
                  "Zmień konto pracownika"
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
              <ButtonMy onClick={this.changePassword}>
                {changePassword ? "Nie zmieniaj hasła" : "Zmień hasło"}
              </ButtonMy>
            </div>
          )}
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

export default EditUser;
