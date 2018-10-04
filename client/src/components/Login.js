import React, { Component } from "react";
import { connect } from "react-redux";

import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import Key from "@material-ui/icons/VpnKey";

import PropTypes from "prop-types";
import * as actions from "../actions";

import InputComponent from "../common/inputs/InputComponent";
import ButtonMy from "../common/ButtonMy";

class Login extends Component {
  state = {
    email: ""
  };

  componentWillMount = () => {
    this.props.fetchForm();
  };

  componentDidUpdate = () => {
    if (
      this.state.email === "" &&
      this.props.formTemp.length > 0 &&
      this.props.formTemp[0].email !== this.state.email
    ) {
      this.setState({ email: this.props.formTemp[0].email });
    }
  };

  onChangeEmail = event => {
    this.setState({ email: event.target.value });
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
          {this.props.formTemp[0] ? (
            <div>
              {this.props.formTemp[0].errors}
              {"email" in this.props.formTemp[0] && (
                <form method="POST" action="/auth/reset">
                  <input name="email" type="hidden" value={this.state.email} />
                  <button type="submit" className="btn btn-primary">
                    Tak
                  </button>
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
            />
            <InputComponent
              name="password"
              label="Password"
              type="password"
              edytuj={password => this.setState({ password })}
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
              <Button type="submit" variant="contained" color="primary">
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
