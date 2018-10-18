import React, { Component } from "react";
import { connect } from "react-redux";

import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import Key from "@material-ui/icons/VpnKey";

import EmailValidator from "email-validator";

import PropTypes from "prop-types";
import * as actions from "../actions";

import InputComponent from "../common/inputs/InputComponent";

const emailHelperMessage = "Adres email podany przy rejestracji";

class Login extends Component {
  state = {
    emailHelper: emailHelperMessage,
    isSubmitDisabled: true,
    errorEmail: false,
    email: "",
    password: "",
    resetShow: true
  };

  componentWillMount = () => {
    this.props.fetchForm();
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    const { email } = this.state;
    if (
      email === "" &&
      this.props.formTemp.length > 0 &&
      this.props.formTemp[0].email !== email
    ) {
      this.setState({ email: this.props.formTemp[0].email });
    }
  };

  handleChange = event => {
    //console.log(event);
    const { name, value } = event.target;
    this.setState({ [name]: value }, () => {
      this.canSubmit(name);
    });
  };

  canSubmit = name => {
    const { email, password } = this.state;
    password.length > 0 && EmailValidator.validate(email)
      ? this.setState({
          isSubmitDisabled: false,
          emailHelper: emailHelperMessage,
          errorEmail: false
        })
      : this.setState({ isSubmitDisabled: true });

    name === "password" && this.state.isSubmitDisabled === true
      ? this.setState({
          emailHelper: "Podaj prawidłowy adres email",
          errorEmail: true
        })
      : this.setState({ emailHelper: emailHelperMessage, errorEmail: false });
  };

  render() {
    return (
      <div
        style={{
          textAlign: "center",
          //padding: 20
          height: "100%",
          position: "relative",
          overflow: "auto"
        }}
      >
        <Paper
          style={{
            textAlign: "center",
            width: 500,
            padding: 30,
            margin: 0,
            position: "absolute",
            top: "40%",
            left: "50%",
            //-ms-transform: translate(-50%, -50%);
            transform: "translate(-40%, -50%)"
          }}
        >
          {/* {this.state.error} */}
          {this.props.formTemp[0] ? (
            <div style={{ display: !this.state.resetShow && "none" }}>
              {this.props.formTemp[0].errors}
              {"email" in this.props.formTemp[0] && (
                <form method="POST" action="/auth/reset">
                  <input name="email" type="hidden" value={this.state.email} />
                  <Button
                    style={{ margin: 8 }}
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Tak
                  </Button>
                  <Button
                    onClick={() => this.setState({ resetShow: false })}
                    style={{ margin: 8 }}
                    //type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Nie
                  </Button>
                </form>
              )}
            </div>
          ) : null}
          <form method="POST" action="/auth/login">
            <InputComponent
              name="email"
              label="Email"
              type="email"
              //edytuj={email => this.setState({ email })}
              edytuj={this.handleChange}
              value={this.state.email}
              error={this.state.errorEmail}
              helperText={this.state.emailHelper}
            />
            <InputComponent
              name="password"
              label="Password"
              type="password"
              //edytuj={password => this.onChangePassword(password)}
              edytuj={this.handleChange}
              value={this.state.password}
              password
            />
            <div style={{ width: "100%", marginTop: 40 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={this.state.isSubmitDisabled}
              >
                Zaloguj się
                <Key style={{ marginLeft: 10 }} />
              </Button>
            </div>
          </form>
        </Paper>
      </div>
    );
  }
}

Login.propTypes = {
  fetchForm: PropTypes.func,
  formTemp: PropTypes.array
};

const mapStateToProps = ({ formTemp }) => {
  return { formTemp };
};

export default connect(
  mapStateToProps,
  actions
)(Login);
