import React, { Component } from "react";
import _ from "lodash";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
// import { connect } from "react-redux";
// import { compose } from "redux";
// import { withStyles } from "@material-ui/core/styles";
// import * as actions from "../actions";
// import MainFrameHOC from "../common/MainFrameHOC";
import ProductsList from "../components/Products/ProductsList";
// import ProductForm from "../components/Products/ProductForm";
import ModalWindow from "../components/ModalWindow";

// const MyContext = React.createContext();

class FormWithListClicks extends Component {
  state = {
    clickedChannel: 1,
    clickedItem: 1,
    itemsConfig: false,
    channels: [],
    items: [],
    adding: {},
    editing: {},
    disableSubmit: { adding: true, editing: true },
    editedId: 0,
    openModal: false
  };

  componentWillMount = async () => {
    const { fetchChannels, items } = this.props;
    this.createEmptyFields();
    fetchChannels && (await this.urlToState(fetchChannels, "channels"));
    await this.itemsToState(this.props.fetchItemsUrl, "items");
    items(this.state.items);
  };

  createEmptyFields = () => {
    const { formFields } = this.props;
    let adding = {};
    let editing = {};
    for (let field of formFields) {
      Object.assign(adding, { [field]: "" });
      Object.assign(editing, { [field]: "" });
    }
    this.setState({
      adding,
      editing,
      disableSubmit: { adding: true, editing: true }
    });
  };

  urlToState = async (url, name) => {
    const result = await this.fetch(url);
    // console.log("list", JSON.stringify(list));

    this.setState({
      [name]: result
    });
  };

  itemsToState = async (url, name) => {
    const result = await this.fetch(url);
    // console.log("itemsToState", this.addChannelsToItems(result));
    this.props.itemsToState && this.props.itemsToState(result);
    await this.setAsyncState({
      [name]: this.addChannelsToItems(result).reverse()
    });
  };

  handleChange = async (dbField, value, inState) => {
    const modyfied = _.clone(this.state[inState]);
    const disableSubmitState = _.clone(this.state.disableSubmit);
    const values = Object.assign(modyfied, {
      [dbField]: value
    });
    const disableSubmit = Object.assign(disableSubmitState, {
      [inState]: this.validate(values)
    });
    // this.setState({
    //   [inState]: values,
    //   disableSubmit
    // });
    await this.setAsyncState({ [inState]: values, disableSubmit });
  };

  setAsyncState = newState =>
    new Promise(resolve => this.setState(newState, () => resolve()));

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
    const { headRow, includeAs } = this.props;
    let keysValue = [];
    let fieldLength = {};
    for (var property in headRow) {
      if (headRow.hasOwnProperty(property)) {
        keysValue.push(headRow[property].id);
      }
    }
    for (let key of keysValue) {
      fieldLength = Object.assign(fieldLength, { [key]: [] });
    }
    const { channels } = this.state;
    // console.log("addFetchToItems", result, channels);
    if (channels.length > 0) {
      let items = [];
      for (let item of result) {
        for (let key of keysValue) {
          // fieldLength[key]
          // fieldLength = Object.assign(fieldLength, {[key]: item[key].length})
          fieldLength[key].push(item[key].length);
        }
        let modItem = {};
        for (let channel of channels) {
          const channInItem = item[includeAs].filter(
            sch => sch.id === channel.id
          );
          modItem = Object.assign(item, {
            [channel.id]: channInItem.length > 0 ? 1 : 0
          });
        }

        for (let key of keysValue) {
          modItem = Object.assign(item, {
            [`${key}_max`]: Math.max(...fieldLength[key])
          });
        }

        // console.log("addChannelsToItems()", keysValue, fieldLength, modItem);
        delete modItem[includeAs];
        items.push(modItem);
      }

      return items;
    } else {
      return result;
    }
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
    console.log("clicke on row");
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
    await axios.post(
      `/api/${this.props.manyOne}/${channel}/${this.props.manyTwo}/${item}`
    );
    await this.itemsToState(this.props.fetchItemsUrl, "items");
    console.log("this.state.FormWithListClicks", this.state);
  };

  handleSubmit = async e => {
    const { adding, editing, editedId } = this.state;
    console.log("handleSubmit", adding, editing, editedId);
    // const { fetchUrl, postUrl, editUrl, clickedRow } = this.props;

    let body;
    let sendingUrl;
    if (editedId === 0) {
      body = adding;
      sendingUrl = this.props.postUrl;
    } else {
      body = editing;
      sendingUrl = `${this.props.editUrl}/${editedId}`;
    }
    // body = Object.assign(body, { clickedRow });
    body = JSON.stringify(body);
    const justAdded = await this.handleAddToDb(
      e,
      sendingUrl,
      body,
      this.props.fetchItemsUrl
    );
    // console.log("handlepost", id);
    this.itemsToState(this.props.fetchItemsUrl, "items");
    this.setState(
      {
        isLoading: false,
        addedId: { id: justAdded.id },
        // justAdded,
        // adding: { name: "", unit: "" },
        // editing: { name: "", unit: "" }
        editedId: 0
      },
      () => {
        this.createEmptyFields();
      }
    );

    return justAdded;
  };

  handleAddToDb = async (e, postUrl, body, getUrl) => {
    console.log("handleAddToDb()", postUrl, body, getUrl);

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
    console.log("response", response);
    return response;
    // this.setState({ insertedId: response.id });
  };

  handleEdit = id => {
    const { items, editedId } = this.state;
    const { editFields, editedIdSend } = this.props;
    const editedItem = items.filter(item => item.id === id);
    // console.log("editedItem", editedItem);
    let editing = {};
    for (let field of editFields) {
      if (field === "password" || field === "password2") {
        Object.assign(editing, { [field]: "" });
      } else if (field === "email") {
        Object.assign(editing, {
          [field]: editedItem[0][field],
          originalEmail: editedItem[0][field]
        });
      } else {
        Object.assign(editing, { [field]: editedItem[0][field] });
      }
    }
    editedIdSend && editedIdSend(id);
    this.setState({
      editedId: editedId !== 0 ? (editedId === id ? 0 : id) : id,
      openModal: true,
      // editedId: editedId !== 0 || editedId !== id ? id : 0,
      // editing: { name: editedItem[0].name, unit: editedItem[0].unit }
      editing
    });
  };

  handleDelete = async selected => {
    // console.log("handleDelete");
    await axios.post(`${this.props.deleteUrl}${selected}`);
    this.itemsToState(this.props.fetchItemsUrl, "items");
    // this.handleOpenConfirmation();
    // this.setState({ confirmationAction: this.remove });
  };

  handleCancel = () => {
    this.createEmptyFields();
    this.setState({ openModal: false, editedId: 0 });
  };
  // this.handleCloseConfirmation();
  render() {
    const {
      headRow,
      rowType,
      children,
      rowClick,
      leftBar,
      overlaps,
      disableDelete,
      disableEdit,
      labelList,
      clicked,
      searchColumns
    } = this.props;
    const {
      clickedChannel,
      clickedItem,
      itemsConfig,
      adding,
      disableSubmit,
      editedId,
      editing,
      value
      // justAdded
    } = this.state;
    // console.log("reactchio", this.props.clicked);
    const childrenWithProps = React.Children.map(children, (child, i) => {
      // console.log("child", child, i);
      if (i !== 1) {
        return (
          <div>
            {React.cloneElement(child, {
              values: adding,
              change: this.handleChange,
              disableSubmit: disableSubmit["adding"],
              submit: this.handleSubmit,
              cancel: this.handleCancel
              // justAdded
            })}
          </div>
        );
      } else {
        return (
          <ModalWindow
            open={this.state.openModal}
            // close={this.handleClose}
            maxWidth={1000}
          >
            <div style={{ backgroundColor: "white" }}>
              {React.cloneElement(child, {
                values: editing,
                change: this.handleChange,
                disableSubmit: disableSubmit["editing"],
                submit: this.handleSubmit,
                cancel: this.handleCancel
                // justAdded
              })}
            </div>
          </ModalWindow>
        );
      }
    });
    return (
      <React.Fragment>
        {childrenWithProps}
        <div
          style={{
            marginTop: "1rem",
            // display: "grid",
            // gridGap: "1rem",
            // gridTemplateColumns: "1fr 2fr",
            gridTemplateRows: "100%"
            // minHeight: "82vh"
          }}
        >
          {this.state.items.length > 0 && (
            <ProductsList
              searchColumns={searchColumns}
              clickedRow={clicked}
              overlaps={overlaps}
              leftBar={leftBar}
              clickOnChannel={this.handleClickOnChannel}
              delete={this.handleDelete}
              transactions={this.state.items}
              headCols={this.state.channels}
              edit={this.handleEdit}
              clickOnRow={rowClick}
              editedId={editedId}
              change={this.handleChange}
              values={editing}
              value={value}
              disableSubmit={disableSubmit["editing"]}
              onSubmit={this.handleSubmit}
              labelList={labelList}
              headRow={headRow}
              rowType={rowType}
              disableDelete={disableDelete}
              disableEdit={disableEdit}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

// function mapStateToProps({ auth }) {
//   return { auth };
// }
//
// export default compose(
//   withStyles(styles, { withTheme: true }),
//   connect(
//     mapStateToProps,
//     actions
//   ),
//   MainFrameHOC
// )(FormWithListClicks);

FormWithListClicks.defaultProps = {
  labelList: "Lista",
  items: () => {}
};

export default FormWithListClicks;
