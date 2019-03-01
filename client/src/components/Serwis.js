import React, { Component } from "react";
import { Formik } from "formik";

import { connect } from "react-redux";
import { compose } from "redux";
import { startOfMonth, endOfMonth } from "date-fns";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";

import * as actions from "../actions";
import {
  dataToString,
  defineds,
  dynamicSort,
  timeDiff
} from "../common/functions";
import MainFrameHOC from "../common/MainFrameHOC";
//import SiteHeader from "../common/SiteHeader";
import CostsTable from "./CostsTable2Remote";
import ModalWindow from "./ModalWindow";
import CostsForm from "./CostsForm";
import DateRangePickerMy from "../common/DateRangePickerMy";
import CostsPodsumowanie from "./CostsPodsumowanie";
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

class Serwis extends Component {
  state = {
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
    // const dates = range
    //   .map(x => x.date)
    //   .sort((a, b) => new Date(b) - new Date(a));
    // const min = dates[dates.length - 1];
    // const max = dates[0];
    // console.log("fetchuje w cwm", min, max);
    // console.log(
    //   `${defineds.startOfMonth} ${defineds.endOfMonth} last: ${
    //     defineds.startOfLastMonth
    //   } ${defineds.endOfLastMonth} `
    // // );
    // const startDate = defineds.startOfMonth
    // const endDate = defineds.endOfLastMonth
    // const rangeselection = { endDate, startDate, key: "rangeselection" };
    // this.setState({ rangeselection });
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

  fetchTransactions = async range => {
    this.props.loading(true);
    const { startDate, endDate } = this.state.rangeselection;

    const fetched = await axios.get(`/api/table/transactions`);
    const transactions = this.handleDateFilter(
      fetched.data,
      startDate,
      endDate
    );
    this.setState({ transactions, transactionsUnfiltered: fetched.data });
    await this.props.loading(false);
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
    return (
      <React.Fragment>
        <ModalWindow
          open={this.state.openModal}
          close={this.handleClose}
          maxWidth={900}
        >
          <SerwisForm
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
  ),
  MainFrameHOC
)(Serwis);
