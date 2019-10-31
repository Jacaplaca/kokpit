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

import { getString } from "../translate";

const emailHelperMessage = language => {
  return getString("LOGIN_EMAIL_GIVE_CORRECT", language);
};

class Login extends Component {
  state = {
    emailHelper: emailHelperMessage(this.props.language),
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
          emailHelper: getString(
            "LOGIN_EMAIL_GIVE_CORRECT",
            this.props.language
          ),
          errorEmail: false
        })
        : this.setState({ disabledButton: true });
    }
  };

  onChangePassword = password => {
    const { language } = this.props;
    this.setState({ password });
    this.state.disabledButton === true
      ? this.setState({
        emailHelper: emailHelperMessage(language),
        errorEmail: true
      })
      : this.setState({
        emailHelper: emailHelperMessage(language),
        errorEmail: false
      });
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
              // src={require(`../images/sf_logo_strona_retina.png`)}
              src={require(`../images/main_logo_web.png`)}
            />
          }
        >
          {/* {this.state.error} */}
          {this.props.formTemp[0] ? (
            <div style={{ display: !this.state.resetShow && "none" }}>
              {getString(this.props.formTemp[0].errors, this.props.language)}
              {this.props.formTemp[0].hasOwnProperty('email') && (
                <form method="POST" action="/auth/reset">
                  <input name="email" type="hidden" value={this.state.email} />
                  <Button
                    style={{ margin: 8 }}
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {getString("LOGIN_RESET_YES", this.props.language)}
                  </Button>
                  <Button
                    onClick={() => this.setState({ resetShow: false })}
                    style={{ margin: 8 }}
                    //type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {getString("LOGIN_RESET_NO", this.props.language)}
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
              helperText={
                this.state.disabledButton
                  ? emailHelperMessage(this.props.language)
                  : " "
              }
            />
            <InputComponent
              name="password"
              label={getString("LOGIN_PASS", this.props.language)}
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
                {getString("LOGIN_BUTTON", this.props.language)}
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

const mapStateToProps = ({ formTemp, language }) => {
  return { formTemp, language };
};

export default connect(
  mapStateToProps,
  actions
)(Login);
