import React, { Component } from "react";
import { connect } from "react-redux";

import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import Key from "@material-ui/icons/VpnKey";

import EmailValidator from "email-validator";

import PropTypes from "prop-types";
import * as actions from "../actions";

import InputComponent from "../common/inputs/InputComponent";
import CenteringComponent from "../common/CenteringComponent";

const emailHelperMessage = "Adres email podany przy rejestracji";

class Login extends Component {
  state = {
    emailHelper: emailHelperMessage,
    disabledButton: true,
    errorEmail: false,
    email: "",
    password: "",
    resetShow: true
  };

  componentWillMount = () => {
    this.props.fetchForm();
  };

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    const { email: emailPrev } = prevState;
    const { email } = this.state;
    if (
      this.state.email === "" &&
      this.props.formTemp.length > 0 &&
      this.props.formTemp[0].email !== this.state.email
    ) {
      this.setState({ email: this.props.formTemp[0].email });
    }

    if (email !== emailPrev) {
      EmailValidator.validate(email)
        ? this.setState({
            disabledButton: false,
            emailHelper: emailHelperMessage,
            errorEmail: false
          })
        : this.setState({ disabledButton: true });
    }
  };

  onChangePassword = password => {
    this.setState({ password });
    this.state.disabledButton === true
      ? this.setState({
          emailHelper: "Podaj prawidłowy adres email",
          errorEmail: true
        })
      : this.setState({ emailHelper: emailHelperMessage, errorEmail: false });
  };

  render() {
    return (
      <React.Fragment>
        <CenteringComponent
          head={
            <img
              style={{
                maxWidth: 270,
                maxHeight: 270,
                marginBottom: 20
              }}
              src={require(`../images/sf_logo_strona_retina.png`)}
            />
          }
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
            <Input name="email" type="email" value={this.state.email} hidden />
            <InputComponent
              name="email"
              label="Email"
              type="email"
              edytuj={email => this.setState({ email })}
              value={this.state.email}
              error={this.state.errorEmail}
              helperText={this.state.emailHelper}
            />
            <InputComponent
              name="password"
              label="Password"
              type="password"
              edytuj={password => this.onChangePassword(password)}
              value={this.state.password}
              password
            />
            <Input
              name="password"
              type="password"
              value={this.state.password}
              hidden
            />
            <div style={{ width: "100%", marginTop: 40 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={this.state.disabledButton}
              >
                Zaloguj się
                <Key style={{ marginLeft: 10 }} />
              </Button>
            </div>
          </form>
        </CenteringComponent>
      </React.Fragment>
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
