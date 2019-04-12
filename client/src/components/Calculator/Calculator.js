import React, { Component } from "react";

import { connect } from "react-redux";
import { compose } from "redux";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import * as actions from "../../actions";
import { defineds } from "../../common/functions";
import MainFrameHOC from "../../common/MainFrameHOC";
//import SiteHeader from "../common/SiteHeader";
import ModalWindow from "../ModalWindow";
import DateRangePickerMy from "../../common/DateRangePickerMy";
import SerwisForm from "./SerwisForm";
import TransactionList from "./TransactionList";
import InputSelectBaza from "../../common/inputs/InputSelectBaza";

const styles = theme => ({
  input: {
    display: "flex",
    padding: 0
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  }
});

class Calculator extends Component {
  state = {
    employees: [],
    employee: { id: 0, name: "" },
    channels: null,
    transactions: [],
    transactionsUnfiltered: [],
    openModal: false,
    editedId: null,
    edit: null,
    rangeselection: {
      startDate: defineds.startOfMonth,
      endDate: defineds.endOfMonth,
      key: "rangeselection"
    }
  };

  componentWillMount = async () => {
    const { role, user_id, name, surname } = this.props.auth;
    // const {users} = this.props

    if (role === "master") {
      await this.setAsyncState({ employee: { id: 0, name: "" } });
      await this.fetchChannelUsers();
    } else {
      await this.setAsyncState({
        employee: { id: user_id, name: `${name} ${surname}` }
      });
    }

    // const dates = []
    await this.fetchTransactions();
    // await this.fetchChannels();
  };
  setAsyncState = newState =>
    new Promise(resolve => this.setState(newState, () => resolve()));

  handleClose = () => {
    this.setState({ openModal: false });
  };

  handleSelect = ranges => {
    const { startDate, endDate } = ranges.rangeselection;
    this.setState({
      ...ranges
    });
    this.setState({
      transactions: this.handleDateFilter(
        this.state.transactionsUnfiltered,
        startDate,
        endDate
      )
    });
  };

  handleDateFilter = (array, startDate, endDate) => {
    const arrayFiltered = array.filter(x => {
      const data = new Date(x.date);
      return (
        data.getTime() > startDate.getTime() &&
        data.getTime() < endDate.getTime()
      );
    });
    return arrayFiltered;
  };

  // fetchChannels = async () => {
  //   const channels = await axios.get(`/api/channelusers`);
  //   this.setState({ channels: channels.data });
  // };

  fetchTransactions = async range => {
    const { channelId, loading } = this.props;
    const {
      employee: { id }
    } = this.state;
    loading(true);
    const { startDate, endDate } = this.state.rangeselection;

    const fetched = await axios.get(`/api/transactions/${channelId}/${id}`);
    const transactions = this.handleDateFilter(
      fetched.data,
      startDate,
      endDate
    );
    this.setState({ transactions, transactionsUnfiltered: fetched.data });
    await loading(false);
  };

  fetchChannelUsers = async () => {
    const {
      channelId,
      loading,
      auth: { user_id, name, surname }
    } = this.props;
    loading(true);
    // const { startDate, endDate } = this.state.rangeselection;

    const fetched = await axios.get(`/api/channelusers/${channelId}`);
    const employees = fetched.data.map(x =>
      Object.assign(x, { name: `${x.surname}, ${x.name}` })
    );
    // console.log("calculator", employees);

    const empIds = employees.map(x => x.id);
    empIds.includes(user_id)
      ? this.setState({
          employees,
          employee: { id: user_id, name: `${surname}, ${name}` }
        })
      : this.setState({ employees });
    await loading(false);
  };

  handleEdit = async id => {
    const result = await axios.get(`/api/transaction/${id}`);

    await this.addFetchToState(result);
  };

  handleDelete = async id => {
    const result = await axios.post(`/api/transaction/delete/${id}`);
    this.fetchTransactions();
  };

  addFetchToState = result => {
    const { id, name, surname } = result.data.User;
    this.setState({
      edit: result.data,
      employee: { id, name: `${name} ${surname}` }
    });
  };

  handleChooseEmployee = async employee => {
    await this.setAsyncState({ employee });
    await this.fetchTransactions();
  };

  handleEmptyEmployee = async () => {
    await this.setAsyncState({ employee: { id: 0, name: "" } });
    await this.fetchTransactions();
  };

  render() {
    const { channelId, auth } = this.props;
    const { employees, employee } = this.state;
    return (
      <React.Fragment>
        <ModalWindow
          open={this.state.openModal}
          close={this.handleClose}
          maxWidth={900}
        >
          <SerwisForm
            loggedUser={auth}
            wybrano={this.handleChooseEmployee}
            edytuj={value =>
              this.setState({ employee: { name: value, id: 0 } })
            }
            czysc={this.handleEmptyEmployee}
            users={employees}
            user={employee}
            userId={employee.id}
            channelId={channelId}
            fetch={this.fetchTransactions}
            edit={this.state.edit}
            editClean={() => this.setState({ edit: null })}
            // changeRange={data => this.changeRange(data)}
            // editedId={this.state.editedId}
            modal
            // duplicate={this.state.duplicate}
            closeModal={() =>
              this.setState({ openModal: false, edit: null, editedId: null })
            }
          />
        </ModalWindow>

        <SerwisForm
          loggedUser={auth}
          wybrano={this.handleChooseEmployee}
          edytuj={value => this.setState({ employee: { name: value, id: 0 } })}
          czysc={this.handleEmptyEmployee}
          users={employees}
          user={employee}
          userId={employee.id}
          channelId={channelId}
          fetch={this.fetchTransactions}
          // edit={this.state.edit}
        />
        <DateRangePickerMy
          range={[this.state.rangeselection]}
          onChange={this.handleSelect}
        />
        {this.state.transactions.length > 0 && (
          <TransactionList
            userId={employee.id}
            delete={this.handleDelete}
            transactions={this.state.transactions}
            edit={id => {
              this.setState({
                openModal: true,
                editedId: id,
                duplicate: false
              });
              this.handleEdit(id);
            }}
          />
        )}
      </React.Fragment>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    actions
  )
  // MainFrameHOC
)(Calculator);
