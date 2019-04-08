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
    // const dates = []
    await this.fetchTransactions();
    // await this.fetchChannels();
  };

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
    loading(true);
    const { startDate, endDate } = this.state.rangeselection;

    const fetched = await axios.get(`/api/transactions/${channelId}`);
    const transactions = this.handleDateFilter(
      fetched.data,
      startDate,
      endDate
    );
    this.setState({ transactions, transactionsUnfiltered: fetched.data });
    await loading(false);
  };

  handleEdit = async id => {
    const result = await axios.get(`/api/id/transaction/${id}`);
    await this.addFetchToState(result);
  };

  handleDelete = async id => {
    const result = await axios.post(`/api/transaction/remove/${id}`);
    this.fetchTransactions();
  };

  addFetchToState = result => {
    this.setState({ edit: result.data });
  };

  render() {
    const { channelId } = this.props;
    return (
      <React.Fragment>
        <ModalWindow
          open={this.state.openModal}
          close={this.handleClose}
          maxWidth={900}
        >
          <SerwisForm
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