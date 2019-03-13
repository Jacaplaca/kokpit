import React, { Component } from "react";
// import { Formik } from "formik";

import { connect } from "react-redux";
import { compose } from "redux";
// import { startOfMonth, endOfMonth } from "date-fns";

import Slide from "@material-ui/core/Slide";
import axios from "axios";
// import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
// import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import ChevronRight from "@material-ui/icons/ChevronRight";

import * as actions from "../actions";
// import {
//   dataToString,
//   defineds,
//   dynamicSort,
//   timeDiff
// } from "../common/functions";
import MainFrameHOC from "../common/MainFrameHOC";
//import SiteHeader from "../common/SiteHeader";
// import CostsTable from "./CostsTable2Remote";
// import ModalWindow from "./ModalWindow";
// import CostsForm from "./CostsForm";
// import DateRangePickerMy from "../common/DateRangePickerMy";
// import CostsPodsumowanie from "./CostsPodsumowanie";
// import SerwisForm from "./SerwisForm";
// import TransactionList from "./TransactionList";
// import AddCircle from "@material-ui/icons/AddCircle";
// import Channels from "../common/inputs/SelectFromDBForAdding";
// import ButtonIconCircle from "../common/ButtonIconCircle";
// import Confirmation from "./Confirmation";
// import SelectOrAdd from "../common/inputs/SelectOrAdd";
// import InputComponent from "../common/inputs/InputComponent";
import EditableList from "../common/EditableList";
import ChannelsPickToolbar from "./Products/ChannelsPickToolbar";
import ProductsList from "../components/Products/ProductsList";
import ProductForm from "../components/Products/ProductForm";
// import ItemsConfig from "./ChannelsProdConfig/ItemsConfig";

const postUrl = "/api/item/";
const fetchItemsUrl = "api/allitem/channel";
const fetchChannels = "/api/table/channels";
const editUrl = "/api/item/edit/id/";

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

class Products extends Component {
  state = {
    clickedChannel: 1,
    clickedItem: 1,
    itemsConfig: false,
    channels: [],
    items: [],
    adding: { name: "", unit: "" },
    editing: { name: "", unit: "" },
    disableSubmit: true,
    editedId: 0
  };

  componentWillMount = async () => {
    await this.urlToState(fetchChannels, "channels");
    this.itemsToState(fetchItemsUrl, "items");
  };

  urlToState = async (url, name) => {
    const result = await this.fetch(url);
    // console.log("list", JSON.stringify(list));

    this.setState({
      [name]: result
    });
  };

  itemsToState = async (url, name) => {
    console.log("itemsToState()", url, name);
    const result = await this.fetch(url);
    // console.log("itemsToState", this.addChannelsToItems(result));

    this.setState({
      [name]: this.addChannelsToItems(result).reverse()
    });
  };

  handleChange = (dbField, value, inState) => {
    const { adding, editing } = this.state;
    const values = Object.assign(this.state[inState], {
      [dbField]: value
    });
    console.log("han", dbField, value, inState, values);
    this.setState({
      [inState]: values,
      disableSubmit: this.validate(values)
    });
  };

  validate = values => {
    let valids = [];
    for (var key in values) {
      if (values.hasOwnProperty(key)) {
        if (values[key] !== "") {
          valids.push(true);
        } else {
          valids.push(false);
        }
      }
    }
    return valids.includes(false);
  };

  addChannelsToItems = result => {
    console.log("addChannelsToItems()");
    const { channels } = this.state;
    // console.log("addFetchToItems", result, channels);
    let items = [];
    for (let item of result) {
      let modItem = {};
      for (let channel of channels) {
        const channInItem = item.SalesChannels.filter(
          sch => sch.id === channel.id
        );
        modItem = Object.assign(item, {
          [channel.id]: channInItem.length > 0 ? 1 : 0
        });
      }
      items.push(modItem);
    }

    return items;

    // return result.map(item => {
    //   return channels.map(channel => {
    //     const channInItem = item.SalesChannels.filter(
    //       sch => sch.id === channel.id
    //     );
    //     return Object.assign(item, {
    //       [`${channel.id}`]: channInItem.length > 0 ? 1 : 0
    //     });
    //   });
    // });
  };

  fetch = async url => {
    const list = await axios.get(url);
    return list.data;
    // return list.data.sort(dynamicSort("name"));
  };

  showItemsConfig = () => {
    this.setState(state => ({ itemsConfig: true }));
  };

  hideItemsConfig = () => {
    this.setState(state => ({ itemsConfig: false }));
  };

  switchItemsConfig = () => {
    this.setState(state => ({ itemsConfig: !state.itemsConfig }));
  };

  handleClickOnRow = (comp, row) => {
    this.setState({ [comp]: row });
    if (comp === "clickedChannel") {
      this.hideItemsConfig();
    } else if (comp === "clickedItem") {
      if (row === this.state.clickedItem) {
        this.switchItemsConfig();
      } else {
        this.showItemsConfig();
      }
    }
  };

  handleClickOnChannel = async (item, channel) => {
    console.log("handleClickOnChannel()", item, channel);
    await axios.post(`/api/channel/${channel}/item/${item}`);
    this.itemsToState("api/allitem/channel", "items");
  };

  handleSubmit = async e => {
    const { adding, editing, editedId } = this.state;
    // const { fetchUrl, postUrl, editUrl, clickedRow } = this.props;

    let body;
    let sendingUrl;
    if (editedId === 0) {
      body = adding;
      sendingUrl = postUrl;
    } else {
      body = editing;
      sendingUrl = `${editUrl}/${editedId}`;
    }
    // body = Object.assign(body, { clickedRow });
    body = JSON.stringify(body);
    const id = await this.handleAddToDb(e, sendingUrl, body, fetchItemsUrl);
    console.log("handlepost", id);
    this.itemsToState(fetchItemsUrl, "items");
    this.setState({
      isLoading: false,
      addedId: { id },
      adding: { name: "", unit: "" },
      editedId: 0,
      editing: { name: "", unit: "" }
    });
  };

  handleAddToDb = async (e, postUrl, body, getUrl) => {
    console.log("handleAddToDb()");

    e.preventDefault();
    // const { whatToAdd } = this.state;
    // console.log("handleAddToDb()", whatToAdd, postUrl);
    const resp = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body
    });

    const response = await resp.json();
    return response.id;
    // this.setState({ insertedId: response.id });
  };

  handleEdit = id => {
    const { items, editedId } = this.state;
    const editedItem = items.filter(item => item.id === id);
    this.setState({
      editedId: editedId === 0 ? id : 0,
      editing: { name: editedItem[0].name, unit: editedItem[0].unit }
    });
  };
  // this.handleCloseConfirmation();
  render() {
    const {
      clickedChannel,
      clickedItem,
      itemsConfig,
      adding,
      disableSubmit,
      editedId,
      editing
    } = this.state;
    return (
      <React.Fragment>
        <Paper>
          <ProductForm
            // disabled={disabled}
            action={this.handleConfirmPosting}
            change={this.handleChange}
            values={adding}
            addLabel="Dodaj kanał sprzedaży"
            submit={this.handleSubmit}
            disableSubmit={disableSubmit}
            // suffix={suffix}
            // adding={adding}
            // validate={validate}
            // addFields={[{ dbField: "name", label: "Nazwa", type: "string" }]}
          />
        </Paper>
        <div
          style={{
            marginTop: "1rem",
            display: "grid",
            // gridGap: "1rem",
            // gridTemplateColumns: "1fr 2fr",
            gridTemplateRows: "100%",
            minHeight: "82vh"
          }}
        >
          {/* <EditableList
              switchSomething={this.showItemsConfig}
              editUrl="/api/channel_item/edit/id/"
              removeUrl="/api/channel_item/remove/"
              disabled={clickedChannel <= 0}
              addLabel="Dodaj produkt lub usługę"
              listLabel="Lista produktów i usług"
              fetchUrl={`/api/channels/items/${clickedChannel}`}
              postUrl={`/api/channel_item/${clickedChannel}`}
              clickedRow={clickedItem}
              clickOnRow={clickedRow =>
                this.handleClickOnRow("clickedItem", clickedRow)
              }
              addFields={[
                { dbField: "name", label: "Nazwa", type: "string" },
                { dbField: "unit", label: "Jednostka", type: "string" }
              ]}
              validate={["name", "unit"]}
              toolbar={<ChannelsPickToolbar toolbar={this.state.channels} />}
              channels={this.state.channels}
            /> */}
          {this.state.items.length > 0 && (
            <ProductsList
              // delete={this.handleDelete}
              transactions={this.state.items}
              headCols={this.state.channels}
              edit={this.handleEdit}
              clickOnChannel={this.handleClickOnChannel}
              editedId={editedId}
              change={this.handleChange}
              values={editing}
            />
          )}
          {/* <Paper> */}

          {/* </Paper> */}
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
  ),
  MainFrameHOC
)(Products);
