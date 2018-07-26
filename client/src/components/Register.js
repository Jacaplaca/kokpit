import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class Register extends Component {
  state = {
    email: this.props.formTemp.length > 0 ? this.props.formTemp[0].email : ''
  };

  componentWillMount = () => {
    this.props.fetchForm();
  };

  componentDidUpdate = prevProps => {
    console.log('did update');
    console.log(this.props);
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
      <div style={{ textAlign: 'center' }} className="container">
        <form method="POST" action="/auth/register">
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Email address</label>
            <input
              onChange={this.onChangeEmail}
              name="email"
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Podaj adres email"
              value={this.state.email}
            />
            <small id="emailHelp" className="form-text text-muted">
              We'll never share your email with anyone else.
            </small>
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword1">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Zarejestruj się
          </button>
        </form>
      </div>
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
