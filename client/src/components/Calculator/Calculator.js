import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import { compose } from "redux";
import { startOfMonth, endOfMonth } from "date-fns";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import * as actions from "../../actions";
import { defineds } from "../../common/functions";
// import MainFrameHOC from "../../common/MainFrameHOC";
import { dataToString, durationLabel } from "../../common/functions";
//import SiteHeader from "../common/SiteHeader";
import ModalWindow from "../ModalWindow";
import DateRangePickerMy from "../../common/DateRangePickerMy";
import SerwisForm from "./SerwisForm";
// import InputSelectBaza from "../../common/inputs/InputSelectBaza";
// import TransactionList from "./TransactionList";
import Summary from "./Summary";
import { greyBackground } from "../../globalStyles";
import ProductsList from "../Products/ProductsList";
import ButtonMy from "../../common/ButtonMy";
import DurationWithButton from "../../common/DurationWithButton";

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
    allTransactions: [],
    openModal: false,
    editedId: null,
    edit: null,
    rangeselection: {
      startDate: defineds.startOfLastMonth,
      endDate: defineds.endOfMonth,
      key: "rangeselection"
    },
    openModalDuration: false
  };

  componentWillMount = async () => {
    const { role, id: user_id, name, surname } = this.props.auth;
    const { channelId } = this.props;
    // const {users} = this.props
    // console.log(
    //   "Caluculator componentWillMount(), channelId",
    //   channelId,
    //   this.props.auth
    // );

    if (role === "master") {
      if (channelId === 0) {
        // console.log("calc cwm");
        await this.setAsyncState({ employee: { id: 0, name: "" } });
        await this.fetchAllChannelUsers();
        await this.fetchAllTransactionsInRange();
      } else {
        await this.setAsyncState({ employee: { id: 0, name: "" } });
        await this.fetchChannelUsers();
        await this.fetchAllTransactionsInRange();
      }
    } else {
      await this.setAsyncState({
        employee: { id: user_id, name: `${name} ${surname}` }
      });
    }
    // console.log("calc cwm state", this.state.employee);

    // const dates = []
    await this.fetchTransactions();
    // await this.fetchChannels();
  };
  setAsyncState = newState =>
    new Promise(resolve => this.setState(newState, () => resolve()));

  changeRange = data => {
    let { rangeselection } = this.state;
    const durStart = new Date(rangeselection.startDate).getTime();
    const durEnd = new Date(rangeselection.endDate).getTime();
    const dataTrans = new Date(data.date).getTime();
    console.log(
      "data",
      new Date(data.date).getTime() >= durStart,
      new Date(data.date).getTime() <= durStart,
      new Date(data.date).getTime() >= durEnd,
      new Date(data.date).getTime() <= durEnd
    );
    let startDate = rangeselection.startDate;
    let endDate = rangeselection.endDate;
    if (dataTrans >= durEnd) {
      endDate = endOfMonth(new Date(dataTrans));
      if (dataTrans <= durStart) {
        startDate = startOfMonth(new Date(dataTrans));
      }
    } else if (dataTrans <= durStart) {
      startDate = startOfMonth(new Date(dataTrans));
      if (dataTrans >= durEnd) {
        endDate = endOfMonth(new Date(dataTrans));
      }
    }
    // const startDate = startOfMonth(new Date(dataWystawienia));
    // const endDate = endOfMonth(new Date(dataWystawienia));
    rangeselection = { endDate, startDate, key: "rangeselection" };
    this.handleSelect({ rangeselection });
    // this.setState({ rangeselection });
  };

  handleClose = () => {
    this.setState({ openModal: false });
  };

  handleSelect = ranges => {
    console.log("handleSelect", ranges);
    // const { startDate, endDate } = ranges.rangeselection;
    this.setState(
      {
        ...ranges
      },
      () => {
        this.fetchTransactions();
      }
    );
    // this.setState({
    //   transactions: this.handleDateFilter(
    //     this.state.transactionsUnfiltered,
    //     startDate,
    //     endDate
    //   )
    // });
  };

  handleDateFilter = (array, startDate, endDate) => {
    const arrayFiltered = array.filter(x => {
      const data = new Date(x.date);
      // console.log("data", data, data.getTime(), startDate, startDate.getTime());
      return (
        // data.getTime() >= startDate.getTime() + 2 * 60 * 60 * 1000 &&
        data.getTime() >= new Date(dataToString(startDate)).getTime() &&
        // data.getTime() <= endDate.getTime() + 2 * 60 * 60 * 1000
        data.getTime() <= new Date(dataToString(endDate)).getTime()
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

    const fetched = await axios.get(
      `/api/transactions/${channelId}/${id}/${startDate}/${endDate}`
    );
    // console.log("fetchedtransactions", fetched.data);
    // const transactions = this.handleDateFilter(
    //   fetched.data,
    //   startDate,
    //   endDate
    // );
    this.setState({ transactions: [], transactionsUnfiltered: [] }, () => {
      this.setState({
        transactions: fetched.data,
        transactionsUnfiltered: fetched.data
      });
    });
    await this.fetchAllTransactionsInRange();
    await loading(false);
  };

  fetchAllTransactionsInRange = async range => {
    const { channelId } = this.props;
    const { startDate, endDate } = this.state.rangeselection;
    const fetched = await axios.get(
      `/api/transactions/${channelId}/${dataToString(startDate)}/${dataToString(
        endDate
      )}`
    );
    // console.log("fetched all transactions", fetched.data);
    this.setState({ allTransactions: fetched.data });
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
    // console.log("empIds", empIds);
    empIds.includes(user_id)
      ? this.setState({
          employees,
          employee: { id: user_id, name: `${surname}, ${name}` }
        })
      : this.setState({ employees });
    await loading(false);
  };

  fetchAllChannelUsers = async () => {
    const {
      // channelId,
      loading,
      auth: { user_id, name, surname, role }
      // show
    } = this.props;
    loading(true);
    // const { startDate, endDate } = this.state.rangeselection;

    const fetched = await axios.get(`/api/allchannelusers/`);
    const employees = fetched.data.map(x =>
      Object.assign(x, { name: `${x.surname}, ${x.name}` })
    );
    // console.log("calculator", employees);

    const empIds = employees.map(x => x.id);
    // console.log("empIds", empIds);
    empIds.includes(user_id)
      ? this.setState({
          employees,
          employee:
            role === "master"
              ? { id: 0, name: "" }
              : { id: user_id, name: `${surname}, ${name}` }
        })
      : this.setState({ employees });
    await loading(false);
  };

  handleEdit = async id => {
    const result = await axios.get(`/api/transaction/${id}`);

    await this.addFetchToState(result);
  };

  handleDelete = async id => {
    await axios.post(`/api/transaction/delete/${id}`);
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

  handleChangeItem = (item, show) => {
    console.log("handleChangeItem", item, show);
    let itemId;
    let transactions;
    if (item && show) {
      itemId = item.id;
      console.log("handle changeItem", item, itemId, show, itemId === 0);
      // itemId = item["Item.id"];
      if (itemId === 0) {
        console.log("handleChange(), in 0 item id");
        transactions = this.state.transactionsUnfiltered;
      } else {
        transactions = this.state.transactionsUnfiltered.filter(
          x => x.itemId === itemId
        );
      }
    } else {
      transactions = this.state.transactionsUnfiltered;
    }
    console.log("handleChangeItem()", item);
    this.setState({ transactions, item });
  };

  handleEmptyEmployee = async () => {
    await this.setAsyncState({ employee: { id: 0, name: "" } });
    await this.fetchTransactions();
  };

  render() {
    const { channelId, auth, show } = this.props;
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
            changeItem={this.handleChangeItem}
            czysc={this.handleEmptyEmployee}
            users={employees}
            user={employee}
            userId={employee.id}
            channelId={channelId}
            fetch={this.fetchTransactions}
            edit={this.state.edit}
            editClean={() => this.setState({ edit: null })}
            changeRange={data => this.changeRange(data)}
            // editedId={this.state.editedId}
            modal
            // duplicate={this.state.duplicate}
            closeModal={() =>
              this.setState({ openModal: false, edit: null, editedId: null })
            }
          />
        </ModalWindow>
        <div
          style={{
            // paddingTop: 115,
            paddingBottom: 20,
            backgroundColor: greyBackground
          }}
        >
          <SerwisForm
            show={show}
            changeItem={this.handleChangeItem}
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
            changeRange={data => this.changeRange(data)}
            // edit={this.state.edit}
          />
        </div>
        <DurationWithButton
          onChange={this.handleSelect}
          range={this.state.rangeselection}
        />
        <div>
          {show && (
            <Summary
              transactions={this.state.allTransactions}
              show={show}
              channelId={channelId}
            />
          )}
          {this.state.transactions.length > 0 && (
            <div
              style={{
                paddingTop: 1,
                paddingBottom: 15,
                backgroundColor: greyBackground
              }}
            >
              {/* <TransactionList
                // show={show}
                // item={item}
                channelId={channelId}
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
              /> */}
              <Paper>
                <ProductsList
                  defaultSort="id"
                  searchSum="bonus"
                  searchColumns={[
                    "cityName",
                    "customer",
                    "date",
                    "bonus",
                    { User: ["name", "surname"] },
                    { Places: ["name"] },
                    { ItemTrans: ["name"] },
                    { ChannelTrans: ["name"] }
                  ]}
                  conditionOne={channelId === 0}
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
                  rowType="transactions"
                  headRow={[
                    {
                      id: "date",
                      numeric: false,
                      disablePadding: false,
                      label: "Data"
                    },
                    {
                      id: "ItemTrans.name",
                      numeric: false,
                      disablePadding: true,
                      label: "Towar/Usługa"
                    },
                    {
                      id: "quantity",
                      numeric: true,
                      disablePadding: false,
                      label: "Ilość",
                      textAlign: "center"
                    },
                    {
                      id: "cityName",
                      numeric: false,
                      disablePadding: false,
                      label: "Lokalizacja"
                    },
                    {
                      id: "customer",
                      numeric: false,
                      disablePadding: false,
                      label: "Klient"
                    },
                    {
                      id: "sell",
                      numeric: true,
                      disablePadding: false,
                      label: "Cena jedn."
                    },
                    {
                      id: "gross",
                      numeric: true,
                      disablePadding: false,
                      label: "Wartość brutto"
                    },
                    {
                      id: "bonus",
                      numeric: true,
                      disablePadding: false,
                      label: "Premia"
                    },
                    // auth.role === "master" && {
                    {
                      id: "User.name",
                      numeric: false,
                      disablePadding: false,
                      label: "Pracownik",
                      hide: auth.role !== "master"
                    },
                    {
                      id: "ChannelTrans.name",
                      numeric: false,
                      disablePadding: false,
                      label: "System",
                      hide: channelId !== 0 || auth.role !== "master"
                    }
                  ]}
                />
              </Paper>
            </div>
          )}
        </div>
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
