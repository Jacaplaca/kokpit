import React, { Component } from "react";
import axios from "axios";
import CenteringComponent from "../common/CenteringComponent";
import InputComponent from "../common/inputs/InputComponent";
import FormButtons from "../common/FormButtons";
import { validateEmail } from "../common/functions";

import { connect } from "react-redux";
import * as actions from "../actions";

class Register extends Component {
  state = {
    email:
      this.props.formTemp.length > 0
        ? this.props.formTemp[0].email
        : "zzz@zzz.com",
    password: "zzzzzz",
    password2: "zzzzzz",
    disableSubmit: true,
    emailHelper: "Podaj prawidłowy adres email",
    passwordHelper: "Hasło powinno mieć conajmniej 5 znaków",
    passwordHelper2: "Hasła nie mogą się różnić"
  };

  componentWillMount = () => {
    this.props.fetchForm();
  };

  componentDidUpdate = prevProps => {
    // console.log("did update");
    // console.log(this.props);
    if (
      this.state.email === "" &&
      this.props.formTemp.length > 0 &&
      this.props.formTemp[0].email !== this.state.email
    ) {
      this.setState({ email: this.props.formTemp[0].email });
    }
  };

  cleanForm = () => {
    this.setState({ email: "", password: "", password2: "" });
  };

  onChange = (value, field) => {
    console.log("onChange", value, field);
    this.setState({ [field]: value }, () => this.validate());
  };

  validate = async () => {
    const { email, password, password2 } = this.state;
    const goodEmail = "Podaj prawidłowy adres email";
    const wrongEmail = "Podany email jest już wykorzystany";
    const badPass = `Hasło powinno mieć conajmniej 5 znaków. Brakuje: ${6 -
      password.length}`;
    const goodPass = "Im dłuższe i bardziej skomplikowane hasło tym lepiej";
    const badPass2 = "Hasła nie mogą się różnić";
    const goodPass2 = "Hasła są identyczne";
    let validates = [];
    let freeEmail = false;
    const validEmail = validateEmail(email);
    let emailHelper = goodEmail;
    let passwordHelper = badPass;
    let passwordHelper2 = badPass2;
    if (validEmail) {
      freeEmail = await this.emailFree(email);
      freeEmail ? (emailHelper = goodEmail) : (emailHelper = wrongEmail);
    }
    const passwordValid = password.length > 5;
    const password2Valid = password === password2;
    passwordValid ? (passwordHelper = goodPass) : (passwordHelper = badPass);
    passwordValid && password2Valid
      ? (passwordHelper2 = goodPass2)
      : (passwordHelper2 = badPass2);
    validates.push(freeEmail);
    validates.push(passwordValid);
    validates.push(password2Valid);
    this.setState({
      disableSubmit: validates.includes(false),
      emailHelper,
      passwordHelper,
      passwordHelper2
    });
  };

  emailFree = async email => {
    const body = { email };
    const result = await axios.get(`/auth/email/${email}`);
    return result.data.free;
  };

  onSubmit = async () => {
    const { email, password } = this.state;
    const url = "/auth/register";
    let form = { email, password };
    // form = Object.assign(form, { role: "master" });
    // console.log("form", form);
    const body = JSON.stringify(form);
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body
    });
    // const response = await resp.json();
    resp.ok && this.props.history.push("/");
    // console.log("result", resp);
  };

  render() {
    const { disableSubmit, email, password, password2 } = this.state;
    return (
      <CenteringComponent>
        <form method="POST" action="/auth/register">
          <div className="form-group">
            {/* <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              onChange={this.onChangeEmail}
              name="email"
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Podaj adres email"
              value={this.state.email}
            /> */}

            <InputComponent
              name="email"
              label="Adres email"
              type="email"
              edytuj={value => this.onChange(value, "email")}
              value={email}
              error={this.state.errorEmail}
              helperText={this.state.emailHelper}
            />
            {/*
            <small id="emailHelp" className="form-text text-muted">
              We'll never share your email with anyone else.
            </small> */}
          </div>
          <div className="form-group">
            {/* <label htmlFor="exampleInputPassword1">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
            /> */}

            <InputComponent
              name="password"
              label="Hasło"
              type="password"
              edytuj={value => this.onChange(value, "password")}
              value={password}
              error={this.state.errorPassword}
              helperText={this.state.passwordHelper}
              password
            />
            <InputComponent
              name="password2"
              label="Potwierdź hasło"
              type="password2"
              edytuj={value => this.onChange(value, "password2")}
              value={password2}
              error={this.state.errorPassword2}
              helperText={this.state.passwordHelper2}
              password
            />
          </div>
          {/* <button type="submit" className="btn btn-primary">
            Zarejestruj się
          </button> */}
          <FormButtons
            subDisable={disableSubmit}
            subLabel={
              "Załóż konto"
              //   modal && edit
              //     ? "Potwierdź edycję"
              //     : bonus > 0
              //     ? `Dodaj premię ${formatNumber(bonus)} zł`
              //     : "Potwierdź"
            }
            subAction={this.onSubmit}
            cancelLabel={"Anuluj"}
            cancelAction={() => {
              console.log("clear");
            }}
          />
        </form>
      </CenteringComponent>
    );
  }
}

function mapStateToProps({ formTemp }) {
  return { formTemp };
}

export default connect(
  mapStateToProps,
  actions
)(Register);
