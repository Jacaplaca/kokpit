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
    transactions: [],
    openModal: false
  };

  componentWillMount() {
    this.fetchTransactions();
  }

  // componentWillReceiveProps() {}

  handleClose = () => {
    this.setState({ openModal: false });
  };

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

  handleEdit = async id => {
    const result = await axios.get(`/api/id/transaction/${id}`);

    await this.addFetchToState(result);
  };

  addFetchToState = result => {
    console.log("res", result.data);
    // const {
    //   id,
    //   nr_dokumentu,
    //   data_wystawienia,
    //   nazwa_pozycji,
    //   kwota_netto,
    //   kwota_brutto,
    //   categoryId,
    //   groupId,
    //   category,
    //   group
    // } = result.data;
    // this.setState({
    //   id,
    //   nr_dokumentu,
    //   kwota_netto,
    //   kwota_brutto,
    //   nazwa_pozycji,
    //   data_wystawienia,
    //   categoryId,
    //   groupId,
    //   edited: true,
    //   categoryText: category.name,
    //   groupText: group.name
    // });
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
            // changeRange={data => this.changeRange(data)}
            // editedId={this.state.editedId}
            modal
            // duplicate={this.state.duplicate}
            closeModal={() => this.setState({ openModal: false })}
          />
        </ModalWindow>
        <SerwisForm fetch={this.fetchTransactions} />
        {this.state.transactions.length > 0 && (
          <TransactionList
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
