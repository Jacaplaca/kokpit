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
import AddCircle from "@material-ui/icons/AddCircle";
// import Channels from "../common/inputs/SelectFromDBForAdding";
import ButtonIconCircle from "../common/ButtonIconCircle";
import Confirmation from "./Confirmation";
import SelectOrAdd from "../common/inputs/SelectOrAdd";
import InputComponent from "../common/inputs/InputComponent";
import Channels from "./ChannelsProdConfig/Channels";

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

const channelsFetchUrl = "/api/table/channels";
let itemsFetchUrlBase = `/api/channels/items/`;

class ChanProdConf extends Component {
  state = {
    openModal: false,

    addChannelConfirmation: false,
    showAdd: false,
    whatToAdd: "",
    channels: [],
    items: [],
    insertedId: 0,
    itemForm: { name: "" },
    // channelId: 0,
    channel: { name: "", id: 0 },
    confirmation: false,
    confirmationField: null,
    field2disabled: true
  };

  handleOpenConfirmation = field => {
    this.setState({ confirmation: true, confirmationField: field });
  };

  handleCloseConfirmation = () => {
    this.setState({ confirmation: false });
  };

  // componentWillMount = async () => {
  //   await this.fetch();
  // };
  //
  // handleClose = () => {
  //   this.setState({ openModal: false });
  // };
  //
  // addFetchToState = result => {
  //   this.setState({ edit: result.data });
  // };
  //
  // handleOpenConfirmation = module => {
  //   this.setState({ [module]: true });
  // };
  //
  // handleCloseConfirmation = module => {
  //   this.setState({ [module]: false });
  // };
  //
  // handleShowAdd = (showAdd, whatToAdd) => {
  //   whatToAdd.length > 0
  //     ? this.setState({ showAdd, whatToAdd })
  //     : this.setState({ showAdd: false, whatToAdd });
  // };
  //
  // handleAdd = async e => {
  //   let url = "/api/sales_channel/";
  //   e.preventDefault();
  //   const { whatToAdd } = this.state;
  //   const resp = await fetch(url, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     credentials: "same-origin",
  //     body: JSON.stringify({
  //       name: `${whatToAdd.charAt(0).toUpperCase()}${whatToAdd.slice(1)}`
  //     })
  //   });
  //   this.handleCloseConfirmation("addChannelConfirmation");
  //   this.fetch();
  //   const response = await resp.json();
  //   this.setState({ insertedId: response.id });
  // };
  //
  // fetch = () => {
  //   axios.get(`/api/table/channels`).then(result => {
  //     const list = result.data.sort(dynamicSort("name"));
  //     this.setState({ list, isLoading: false });
  //   });
  // };
  handleChange = async (dbTable, showAdd, name, id) => {
    const { channel } = this.state;
    // let field2disabled;
    let list = [];
    console.log("handleChange", dbTable, showAdd, name, id);
    if (dbTable === "channel" && id !== 0) {
      console.log("handleChange wybrano channel i nie jest 0");
      const itemsFetchUrl = `${itemsFetchUrlBase}${id}`;
      list = await this.fetch(itemsFetchUrl, "items");
    }
    this.setState({ [dbTable]: { id, name }, items: list });
  };

  render() {
    const {
      showAdd,
      addChannelConfirmation,
      whatToAdd,
      channelId,
      channel,
      channels,
      items,
      confirmation,
      field2disabled
    } = this.state;
    return (
      <React.Fragment>
        <Paper>
          <Channels />
        </Paper>
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
)(ChanProdConf);
