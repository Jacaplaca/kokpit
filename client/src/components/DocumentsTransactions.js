import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import { startOfMonth, endOfMonth } from "date-fns";
import differenceInCalendarDays from "date-fns/difference_in_calendar_days";
import { defineds, dataToString, durationLabel } from "../common/functions";
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
import DurationWithButton from "../common/DurationWithButton";
import { getString } from "../translate";

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
    openModal: false,
    rangeselection: {
      startDate: defineds.startOfLastMonth,
      endDate: defineds.endOfMonth,
      key: "rangeselection"
    }
  };

  componentWillMount = async () => {
    this.fetching();
  };

  setAsyncState = newState =>
    new Promise(resolve => this.setState(newState, () => resolve()));

  fetching = async () => await this.urlToState(fetchItemsUrl);

  urlToState = async url => {
    const result = await this.fetch(url);
    const {
      rangeselection: { startDate, endDate }
    } = this.state;
    await this.setAsyncState({
      items: this.handleDateFilter(result, startDate, endDate),
      itemsUnfilter: result
    });

    // console.log("list", JSON.stringify(list));
    // for (let name of names) {
    //   this.setState({
    //     [name]: result
    //   });
    // }
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

  handleSelect = ranges => {
    console.log("handleSelect", ranges);
    const { startDate, endDate } = ranges.rangeselection;
    this.setState(
      {
        ...ranges
      },
      () => {
        // this.fetchTransactions();
        // return
        this.setState({
          items: this.handleDateFilter(
            this.state.itemsUnfilter,
            startDate,
            endDate
          )
        });
      }
    );
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
    console.log("arrayFiltered", arrayFiltered);
    return arrayFiltered;
  };

  changeRange = data => {
    let { rangeselection } = this.state;
    const durStart = new Date(rangeselection.startDate).getTime();
    const durEnd = new Date(rangeselection.endDate).getTime();
    const dataTrans = new Date(data.date).getTime();
    console.log(
      "changeRange",
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

  render() {
    const {
      items,
      channel,
      label,
      edited,
      openModal,
      rangeselection
    } = this.state;
    const {
      auth: { role },
      language
    } = this.props;
    return (
      <div>
        <ModalWindow open={openModal} close={this.handleClose} maxWidth={900}>
          <DocumentTransactionForm
            fetching={this.fetching}
            edited={edited}
            clear={this.clearEdited}
            changeRange={data => this.changeRange(data)}
          />
        </ModalWindow>
        <div style={{ marginBottom: 20 }}>
          <DocumentTransactionForm
            fetching={this.fetching}
            edited={{ id: 0 }}
            clear={this.clearEdited}
            changeRange={data => this.changeRange(data)}
          />
        </div>
        <DurationWithButton
          onChange={this.handleSelect}
          range={rangeselection}
        />
        {items && items.length > 0 && (
          <Paper>
            {/* <SimpleProductList data={data} /> */}
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
              labelList={getString("DOC_TRANS_TABLE_LABEL", language)}
              rowType={"documents_transactions"}
              headCols={[]}
              headRow={[
                {
                  id: "date",
                  numeric: false,
                  disablePadding: true,
                  label: getString("DOC_TRANS_TABLE_DATE", language)
                  // textAlign: "center"
                },
                {
                  id: "documents_nr",
                  numeric: false,
                  disablePadding: true,
                  label: getString("DOC_TRANS_TABLE_NO", language)
                },
                {
                  id: "ammount",
                  numeric: true,
                  disablePadding: true,
                  label: getString("DOC_TRANS_TABLE_AMMOUNT", language)
                },
                {
                  id: "Customer",
                  numeric: true,
                  disablePadding: true,
                  label: getString("DOC_TRANS_TABLE_CUSTOMER", language)
                },
                role === "master" && {
                  id: "surname",
                  numeric: false,
                  disablePadding: true,
                  label: getString("DOC_TRANS_TABLE_USER", language),
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

function mapStateToProps({ auth, language }) {
  return {
    language,
    auth,
    help: getString("DOC_TRANS_TABLE_HELP", language)
  };
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    actions
  ),
  MainFrameHOC
)(DocumentsTransactions);
