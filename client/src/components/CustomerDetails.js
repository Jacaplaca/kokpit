import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";

import * as actions from "../actions";
import { dataToString, defineds, dynamicSort } from "../common/functions";
import MainFrameHOC from "../common/MainFrameHOC";
//import SiteHeader from "../common/SiteHeader";

import CustomerForm from "./CustomerDetails/CustomerForm";
import CustomerDetailsList from "./Products/ProductsList";

class CustomerDetails extends Component {
  state = {
    details: null,
    edited: null
  };

  componentWillMount() {
    this.fetching();
  }

  fetching = async () => {
    const data = await axios.get("/api/customerdetail/");
    const details = this.countMachines(data.data);
    // console.log(this.countMachines(details));
    await this.setAsyncState({ details });
  };

  handleEdit = async id => {
    const data = await axios.get(`/api/customerdetail/${id}`);
    console.log("handleedit", id, data);
    const edited = this.countMachines(data.data);
    console.log("edit", edited);
    // console.log(this.countMachines(details));
    await this.setAsyncState({ edited });

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

  countMachines = data =>
    data.map(x => {
      let machines = {
        qAgros: 0,
        qCultivators: 0,
        qHarvesters: 0,
        qTractors: 0
      };
      const toIter = ["Tractors", "Harvesters", "Cultivators", "Agros"];
      // console.log("x", x);
      for (let machine of toIter) {
        const nameOfMachine = machine;
        for (let mach of x[machine]) {
          machines[`q${nameOfMachine}`] =
            machines[`q${nameOfMachine}`] + mach.howMany;
        }
      }
      // const newOb = Object.assign(x, machines);
      // console.log("newOb", newOb);
      return Object.assign(x, machines);
    });

  setAsyncState = newState =>
    new Promise(resolve => this.setState(newState, () => resolve()));

  handleClean = () => {
    this.setState({ edited: null });
  };

  render() {
    const { details, edited } = this.state;
    return (
      <div>
        <CustomerForm edited={edited} cleanEdit={this.handleClean} />
        {details && (
          <CustomerDetailsList
            transactions={details}
            headCols={[]}
            rowType="customerDetails"
            edit={this.handleEdit}
            clickOnRow={row => console.log("clickOnRow", row)}
            headRow={[
              {
                id: "name",
                numeric: false,
                disablePadding: false,
                label: "Imię"
              },
              {
                id: "surname",
                numeric: false,
                disablePadding: false,
                label: "Nazwisko"
              },
              {
                id: "address",
                numeric: false,
                disablePadding: false,
                label: "Adres"
              },
              {
                id: "phone",
                numeric: true,
                disablePadding: false,
                label: "Nr tel."
              },
              {
                id: "field",
                numeric: true,
                disablePadding: false,
                label: "Pola."
              },
              {
                id: "meadow",
                numeric: true,
                disablePadding: false,
                label: "Łąki"
              },
              {
                id: "qTractors",
                numeric: true,
                disablePadding: false,
                label: "Traktory"
              },
              {
                id: "qHarvesters",
                numeric: true,
                disablePadding: false,
                label: "Kombajny"
              },
              {
                id: "qCultivators",
                numeric: true,
                disablePadding: false,
                label: "Siewniki"
              },
              {
                id: "qAgros",
                numeric: true,
                disablePadding: true,
                label: "Inne"
              }
              // {
              //   id: "to",
              //   numeric: false,
              //   disablePadding: true,
              //   label: "Do"
              // },
              // {
              //   id: "bonusType",
              //   numeric: false,
              //   disablePadding: true,
              //   label: "Typ"
              // },
              // {
              //   id: "bonus",
              //   numeric: true,
              //   disablePadding: true,
              //   label: "Prowizja"
              // }
            ]}
          />
        )}
      </div>
    );
  }
}

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

export default compose(
  withStyles(styles, { withTheme: true }),
  // connect(
  //   mapStateToProps,
  //   actions
  // ),
  MainFrameHOC
)(CustomerDetails);
