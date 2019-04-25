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

const fetchItemsUrl = "api/invoices";

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

class Invoices extends Component {
  state = {
    items: null,
    itemsUnfilter: null,
    channel: ""
  };

  componentWillMount = async () => {
    await this.urlToState(fetchItemsUrl, ["items", "itemsUnfilter"]);
  };

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
    const list = await axios.get(url);
    const integers = list.data.map(x =>
      Object.assign(x, {
        pozostalo_do_zaplacenia: parseFloat(x.pozostalo_do_zaplacenia),
        overdue: differenceInCalendarDays(
          new Date(),
          new Date(x.termin_platnosci)
        )
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

  render() {
    const { items, channel, label } = this.state;
    const {
      auth: { role }
    } = this.props;
    return (
      <div>
        {items && items.length > 0 && (
          <Paper>
            {/* <SimpleProductList data={data} /> */}
            <ProductsList
              searchSum="pozostalo_do_zaplacenia"
              searchColumns={[
                "nr_pelny",
                "klient",
                { User: ["name", "surname"] },
                "overdue",
                "pozostalo_do_zaplacenia",
                "termin_platnosci"
              ]}
              disableEdit
              disableDelete
              // clickOnChannel={this.handleClickOnChannel}
              // delete={this.handleDelete}
              transactions={items}
              // headCols={this.state.channels}
              // edit={this.handleEdit}
              clickOnRow={this.handleRowClick}
              // editedId={editedId}
              // change={this.handleChange}
              // values={editing}
              // value={value}
              // disableSubmit={disableSubmit["editing"]}
              // onSubmit={this.handleSubmit}
              labelList={`Faktury z ponad 15 dniami zaległosci`}
              rowType={"invoices"}
              headCols={[]}
              headRow={[
                {
                  id: "nr_pelny",
                  numeric: false,
                  disablePadding: true,
                  label: "Nr pełny"
                },
                {
                  id: "termin_platnosci",
                  numeric: false,
                  disablePadding: true,
                  label: "Termin płat. ",
                  textAlign: "center"
                },
                {
                  id: "pozostalo_do_zaplacenia",
                  numeric: true,
                  disablePadding: true,
                  label: "Kwota"
                },
                {
                  id: "klient",
                  numeric: true,
                  disablePadding: true,
                  label: "Klient"
                },
                {
                  id: "overdue",
                  numeric: true,
                  disablePadding: true,
                  label: "Po terminie",
                  textAlign: "center"
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

// export default Invoices;

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
)(Invoices);
