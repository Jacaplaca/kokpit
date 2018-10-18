import React, { Component } from "react";
import { connect } from "react-redux";

import Paper from "@material-ui/core/Paper";
//import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import Key from "@material-ui/icons/VpnKey";
import { withStyles } from "@material-ui/core/styles";
import EmailValidator from "email-validator";
import PropTypes from "prop-types";
import * as actions from "../actions";

import InputComponent from "../common/inputs/InputComponent";

const emailHelperMessage = "Adres email podany przy rejestracji";

const styles = theme => ({
  root: {
    // height: 250,
    width: "100%",
    // flexGrow: 1,
    marginBottom: theme.spacing.unit / 2
  },
  container: {
    position: "relative"
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
    maxHeight: 300,
    overflowY: "auto",
    background: "white",
    boxShadow: theme.shadows[5]
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  divider: {
    height: theme.spacing.unit * 1
  }
  // input: {
  //   margin: 44
  // }
});

class Login extends Component {
  state = {
    emailHelper: emailHelperMessage,
    isSubmitDisabled: true,
    errorEmail: false,
    email: "",
    password: "",
    resetShow: true,
    hidePassword: true
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
      this.canSubmit();
    });
  };

  canSubmit = () => {
    const { email, password } = this.state;
    const goodEmail = EmailValidator.validate(email);
    const somePass = password.length > 0;

    if (somePass && goodEmail) {
      this.setState({
        isSubmitDisabled: false,
        emailHelper: emailHelperMessage,
        errorEmail: false
      });
    } else if (goodEmail && !somePass) {
      this.setState({ isSubmitDisabled: true });
    } else if (!goodEmail && somePass) {
      this.setState({
        emailHelper: "Podaj prawidłowy adres email",
        errorEmail: true,
        isSubmitDisabled: true
      });
    } else if (!goodEmail && !somePass) {
      this.setState({
        isSubmitDisabled: true,
        emailHelper: emailHelperMessage,
        errorEmail: false
      });
    } else {
      this.setState({ isSubmitDisabled: true });
    }
  };

  passwordVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
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
              type="string"
              //edytuj={password => this.onChangePassword(password)}
              edytuj={this.handleChange}
              value={this.state.password}
              password={this.state.hidePassword}
              passwordVisibility={this.passwordVisibility}
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

// export default connect(
//   mapStateToProps,
//   actions
// )(Login);

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    actions
  )(Login)
);
