import React, { Component } from 'react';
import { connect } from 'react-redux';

import FormControl from '@material-ui/core/FormControl';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Key from '@material-ui/icons/VpnKey';

import PropTypes from 'prop-types';
import * as actions from '../actions';

class Login extends Component {
  state = {
    email: ''
  };

  componentWillMount = () => {
    this.props.fetchForm();
  };

  componentDidUpdate = () => {
    if (
      this.state.email === '' &&
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
      <div style={{ textAlign: 'center', padding: 20 }}>
        <Paper
          style={{
            textAlign: 'center',
            width: 500,
            padding: 30,
            margin: 'auto'
          }}>
          {this.props.formTemp[0] ? (
            <div>
              {this.props.formTemp[0].errors}
              {'email' in this.props.formTemp[0] && (
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
            <FormControl
              // className={classes.formControl}
              aria-describedby="name-helper-text">
              <InputLabel htmlFor="email">Email</InputLabel>
              <Input
                onChange={this.onChangeEmail}
                name="email"
                type="email"
                value={this.state.email}
                // name="nazwa_pozycji"
                id="email"
                // value={this.state.nazwa_pozycji}
                // onChange={this.handleChange}
                style={{ width: 300 }}
              />
              {/* <FormHelperText id="name-helper-text">
        Some important helper text
      </FormHelperText> */}
            </FormControl>
            <FormControl
              style={{ marginTop: 20 }}
              // className={classes.formControl}
              aria-describedby="name-helper-text">
              <InputLabel htmlFor="pass">Password</InputLabel>
              <Input
                name="password"
                type="password"
                // name="nazwa_pozycji"
                id="pass"
                // value={this.state.nazwa_pozycji}
                // onChange={this.handleChange}
                style={{ width: 300 }}
              />
              {/* <FormHelperText id="name-helper-text">
        Some important helper text
      </FormHelperText> */}
            </FormControl>
            {/* <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              onChange={this.onChangeEmail}
              name="email"
              type="email"
              value={this.state.email}
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Podaj adres email"
            />
            <small id="emailHelp" className="form-text text-muted">
              We&apos;ll never share your email with anyone else.
            </small>
          </div> */}
            {/* <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
            />
          </div> */}
            {/* <button type="submit" className="btn btn-primary">
            Zaloguj się
          </button> */}
            <div style={{ width: '100%', marginTop: 40 }}>
              <Button
                // style={{mar}}
                type="submit"
                variant="contained"
                color="primary"
                // className={classes.button}
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
