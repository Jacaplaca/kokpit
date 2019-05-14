import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import differenceInCalendarDays from "date-fns/difference_in_calendar_days";
import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import * as actions from "../actions";
import MainFrameHOC from "../common/MainFrameHOC";

import FormWithListClicks from "../common/FormWithListClicks";
import Form from "../components/Users/Form";
import EditUserForm from "../components/Users/EditForm";
import ModalWindow from "./ModalWindow";
import ProductsList from "./Products/ProductsList";
import DocumentTransactionForm from "./DocumentsTransactions/Form";

const fetchItemsUrl = "api/documentstransactions";

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

class DocumentsTransactions extends Component {
  state = {
    items: null,
    itemsUnfilter: null,
    channel: "",
    edited: { id: 0 },
    openModal: false
  };

  componentWillMount = async () => {
    this.fetching();
  };

  setAsyncState = newState =>
    new Promise(resolve => this.setState(newState, () => resolve()));

  fetching = async () =>
    await this.urlToState(fetchItemsUrl, ["items", "itemsUnfilter"]);

  urlToState = async (url, names) => {
    const result = await this.fetch(url);
    // console.log("list", JSON.stringify(list));
    for (let name of names) {
      this.setState({
        [name]: result
      });
    }
  };

  fetch = async url => {
    const result = await axios.get(url);
    const integers = result.data.map(x =>
      Object.assign(x, {
        ammount: parseFloat(x.ammount_netto),
        name: x.User.name,
        surname: x.User.surname,
        customer: x.Customer.name
      })
    );
    return integers;
    // return list.data.sort(dynamicSort("name"));
  };

  handleRowClick = id => {
    console.log("id", id);
    // const { itemsUnfilter } = this.state;
    // let filteredItems = [];
    // let name;
    // for (let item of itemsUnfilter) {
    //   const channels = item.SalesChannels;
    //   for (let channel of channels) {
    //     if (channel.id === id) {
    //       name = channel.name;
    //       filteredItems.push(item);
    //     }
    //   }
    // }
    //
    // // const channel =
    // //   filteredItems[0] &&
    // //   filteredItems[0].SalesChannels[0] &&
    // //   filteredItems[0].SalesChannels[0].name;
    //
    // this.setState({
    //   items: filteredItems,
    //   channel: ` w ${name}`
    // });
  };

  handleClickOnItem = id => {
    console.log("id id", id);
  };

  handleEdit = async id => {
    const data = await axios.get(`/api/documentstransactions/${id}`);
    console.log("handledit", id, data);
    await this.setAsyncState({ openModal: true });
    // console.log("handleedit", id, data);
    // const edited = this.improveData(data.data);
    // console.log("edit", edited);
    // console.log(this.improveData(details));
    await this.setAsyncState({
      openForm: true,
      edited: data.data
    });
    // await this.setAsyncState({ edited: data.data });

    // const { items, editedId } = this.state;
    // const { editFields, editedIdSend } = this.props;
    // const editedItem = items.filter(item => item.id === id);
    // console.log("editedItem", editedItem);
    // let editing = {};
    // for (let field of editFields) {
    //   if (field === "password" || field === "password2") {
    //     Object.assign(editing, { [field]: "" });
    //   } else if (field === "email") {
    //     Object.assign(editing, {
    //       [field]: editedItem[0][field],
    //       originalEmail: editedItem[0][field]
    //     });
    //   } else {
    //     Object.assign(editing, { [field]: editedItem[0][field] });
    //   }
    // }
    // editedIdSend && editedIdSend(id);
    // this.setState({
    //   editedId: editedId !== 0 ? (editedId === id ? 0 : id) : id,
    //   openModal: true,
    //   // editedId: editedId !== 0 || editedId !== id ? id : 0,
    //   // editing: { name: editedItem[0].name, unit: editedItem[0].unit }
    //   editing
    // });
  };

  handleDelete = async ids => {
    const deleteUrl = "/api/documentstransactions/delete/";
    await axios.post(`${deleteUrl}${ids}`);
    this.fetching();
    // this.handleOpenConfirmation();
    // this.setState({ confirmationAction: this.remove });
  };

  clearEdited = () => this.setState({ edited: { id: 0 }, openModal: false });

  handleClose = () => {
    this.setState({ openModal: false });
  };

  render() {
    const { items, channel, label, edited, openModal } = this.state;
    const {
      auth: { role }
    } = this.props;
    return (
      <div>
        <ModalWindow open={openModal} close={this.handleClose} maxWidth={900}>
          <DocumentTransactionForm
            fetching={this.fetching}
            edited={edited}
            clear={this.clearEdited}
          />
        </ModalWindow>
        <div style={{ marginBottom: 20 }}>
          <DocumentTransactionForm
            fetching={this.fetching}
            edited={{ id: 0 }}
            clear={this.clearEdited}
          />
        </div>
        {items && items.length > 0 && (
          <Paper>
            {/* <SimpleProductList data={data} /> */}
            <div>Moduł w opracowaniu</div>
            <ProductsList
              defaultSort="id"
              searchSum="ammount"
              searchColumns={[
                "documents_nr",
                "date",
                "ammount",
                { User: ["name", "surname"] },
                { Customer: ["adr_kod", "adr_miejscowosc", "name"] }
              ]}
              // disableEdit
              // disableDelete
              // clickOnChannel={this.handleClickOnChannel}
              delete={this.handleDelete}
              transactions={items}
              clickedRow={null}
              // headCols={this.state.channels}
              edit={this.handleEdit}
              clickOnRow={this.handleRowClick}
              // editedId={editedId}
              // change={this.handleChange}
              // values={editing}
              // value={value}
              // disableSubmit={disableSubmit["editing"]}
              // onSubmit={this.handleSubmit}
              labelList={`Faktury / transakcje`}
              rowType={"documents_transactions"}
              headCols={[]}
              headRow={[
                {
                  id: "date",
                  numeric: false,
                  disablePadding: true,
                  label: "Data transakcji"
                  // textAlign: "center"
                },
                {
                  id: "documents_nr",
                  numeric: false,
                  disablePadding: true,
                  label: "Nr dokmentu"
                },
                {
                  id: "ammount",
                  numeric: true,
                  disablePadding: true,
                  label: "Kwota netto"
                },
                {
                  id: "Customer",
                  numeric: true,
                  disablePadding: true,
                  label: "Klient"
                },
                role === "master" && {
                  id: "surname",
                  numeric: false,
                  disablePadding: true,
                  label: "Pracownik",
                  hideRightBorder: true
                }
                // {
                //   id: "unit",
                //   numeric: false,
                //   disablePadding: true,
                //   label: "Jednostka"
                // }
              ]}
            />
          </Paper>
        )}
      </div>
    );
  }
}

// export default DocumentsTransactions;

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
)(DocumentsTransactions);
