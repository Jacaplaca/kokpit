import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class ResetPassword extends Component {
  state = {
    password1: '',
    password2: ''
  };

  componentWillMount = () => {
    this.props.fetchForm();
  };

  onChangePassword1 = event => {
    this.setState({ password1: event.target.value });
  };
  onChangePassword2 = event => {
    this.setState({ password2: event.target.value });
  };

  render() {
    return (
      <div>
        {this.props.formTemp[0] ? (
          <div>
            {this.props.formTemp[0].errors}
            {/* <Link to={'/auth/reset'}>Tak</Link> */}
          </div>
        ) : null}
        <form
          method="POST"
          action={`reset/token/${this.props.formTemp[0] &&
            'token' in this.props.formTemp[0] &&
            this.props.formTemp[0].token}`}>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Nowe hasło</label>
            <input
              onChange={this.onChangePassword1}
              name="password1"
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              aria-describedby="password1Help"
              placeholder="hasło"
              value={this.state.password1}
            />
          </div>
          <div className="form-group">
            <label htmlFor="exampleInputPassword2">Password</label>
            <input
              onChange={this.onChangePassword2}
              name="password2"
              type="password"
              className="form-control"
              id="exampleInputPassword2"
              aria-describedby="password1Help"
              placeholder="hasło"
              value={this.state.password2}
            />
          </div>
          <small id="password2Help" className="form-text text-muted">
            Ma być dokładnie takie same jak pierwsze.
          </small>
          <button type="submit" className="btn btn-primary">
            Zapisz nowe hasło
          </button>
        </form>
      </div>
    );
  }
}

const mapStateToProps = ({ formTemp }) => {
  return { formTemp };
};

export default connect(
  mapStateToProps,
  actions
)(ResetPassword);
