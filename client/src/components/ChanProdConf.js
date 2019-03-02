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
import Channels from "../common/inputs/SelectFromDBForAdding";
import ButtonIconCircle from "../common/ButtonIconCircle";
import Confirmation from "./Confirmation";
import SelectOrAdd from "../common/inputs/SelectOrAdd";
import InputComponent from "../common/inputs/InputComponent";

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

class ChanProdConf extends Component {
  state = {
    openModal: false,

    addChannelConfirmation: false,
    showAdd: false,
    whatToAdd: "",
    list: [],
    insertedId: 0,
    itemForm: { name: "" },
    channelId: 0
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
  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };

  render() {
    const {
      showAdd,
      addChannelConfirmation,
      whatToAdd,
      channelId
    } = this.state;
    return (
      <React.Fragment>
        <SelectOrAdd
          fetchUrl={`/api/table/channels`}
          changeId={id => this.handleChange("channelId", id)}
          // form={this.state.itemForm}
          label="kanał sprzedaży"
          labelOdmieniony="kanał sprzedaży"
          // modal
          // child={<UnitForm form={this.state.itemForm} />}
        />
        <SelectOrAdd
          fetchUrl={`/api/channels/items/${channelId}`}
          changeId={id => this.handleChange("item", id)}
          // form={this.state.itemForm}
          label="Produkt lub usługa"
          labelOdmieniony="produkt lub usługę"
          modal
          // child={<UnitForm form={this.state.itemForm} />}
        >
          <InputComponent
            name="unit"
            label="Jednostka"
            type="text"
            edytuj={unit => this.setState({ itemForm: { name: unit } })}
            value={this.state.itemForm.unit}
          />
        </SelectOrAdd>
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
