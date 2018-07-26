import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../actions';

class Login extends Component {
  state = {
    email: ''
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
    console.log(this.state.formTemp);
    return (
      <div style={{ textAlign: 'center' }} className="container">
        {/* <div>asdfasf</div> */}
        {this.props.formTemp[0] ? (
          <div>
            {this.props.formTemp[0].errors}
            {/* <Link to={'/auth/reset'}>Tak</Link> */}
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
            Zaloguj się
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
)(Login);
