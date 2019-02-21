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
import { dataToString, defineds, dynamicSort } from "../common/functions";
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
    transactions: []
  };

  componentWillMount() {
    this.fetchTransactions();
  }

  componentWillReceiveProps() {}

  fetchTransactions = async range => {
    // console.log(
    //   `${defineds.startOfMonth} ${defineds.endOfMonth} last: ${
    //     defineds.startOfLastMonth
    //   } ${defineds.endOfLastMonth} `
    // );
    this.props.loading(true);
    // const { startDate, endDate } = this.state.rangeselection;

    // const poczatek = range ? range.rangeselection.startDate : startDate;
    // const koniec = range ? range.rangeselection.endDate : endDate;

    const transactions = await axios.get(`/api/table/transactions`);

    this.setState({ transactions: transactions.data });
    // await this.resultToState(fetch);
    await this.props.loading(false);
  };

  render() {
    return (
      <React.Fragment>
        <SerwisForm />
        {this.state.transactions.length > 0 && (
          <TransactionList transactions={this.state.transactions} />
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
