import React, { Component } from "react";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";

import * as actions from "../actions";
import { dataToString, defineds, dynamicSort } from "../common/functions";
import MainFrameHOC from "../common/MainFrameHOC";
//import SiteHeader from "../common/SiteHeader";

import CustomerForm from "./CustomerDetails/CustomerForm";
import CustomerDetailsList from "./Products/ProductsList";
import ExpansionWithAbsolute from "../common/ExpansionWithAbsolute";

class CustomerDetails extends Component {
  state = {
    details: null,
    edited: null,
    customersWithDetails: null,
    openForm: true
  };

  componentWillMount() {
    this.fetching();
    this.setState({
      openForm: this.props.auth.role === "master" ? false : true
    });
  }

  fetching = async () => {
    const data = await axios.get("/api/customerdetail/");
    const details = this.improveData(data.data);
    // console.log(details);
    const customersWithDetails = details.map(x => x.Customer.id);
    await this.setAsyncState({ details, customersWithDetails });
  };

  handleEdit = async id => {
    const data = await axios.get(`/api/customerdetail/${id}`);
    // console.log("handleedit", id, data);
    const edited = this.improveData(data.data);
    console.log("edit", edited);
    // console.log(this.improveData(details));
    await this.setAsyncState({ openForm: true });
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

  improveData = data =>
    data.map(x => {
      let machines = {
        name: x.Customer.name,
        kod: x.Customer.adr_Kod,
        city: x.Customer.adr_Miejscowosc,
        qAgros: 0,
        qCultivators: 0,
        qHarvesters: 0,
        qTractors: 0,
        employee: `${x.User.name} ${x.User.surname}`
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

  delete = async ids => {
    const deleteUrl = "/api/customerdetail/destroy/";
    await axios.post(`${deleteUrl}${ids}`);
    this.fetching();
    // this.handleOpenConfirmation();
    // this.setState({ confirmationAction: this.remove });
  };

  render() {
    const { details, edited, customersWithDetails, openForm } = this.state;
    const { auth } = this.props;
    return (
      <div>
        <ExpansionWithAbsolute
          title="Dodawanie i edycja informacji o klientach"
          open={openForm}
        >
          <CustomerForm
            edited={edited}
            cleanEdit={this.handleClean}
            fetching={this.fetching}
            filledCustomers={customersWithDetails}
          />
        </ExpansionWithAbsolute>
        {details && (
          <Paper style={{ padding: 20, marginTop: "1.3rem" }}>
            <CustomerDetailsList
              searchColumns={[
                "name",
                "kod",
                "city",
                "phone",
                { User: ["name", "surname"] }
              ]}
              delete={this.delete}
              transactions={details}
              headCols={[]}
              rowType="customerDetails"
              edit={this.handleEdit}
              clickOnRow={row => console.log("clickOnRow", row)}
              headRow={[
                {
                  id: "name",
                  numeric: false,
                  disablePadding: true,
                  label: "Klient"
                },
                {
                  id: "kod",
                  numeric: false,
                  disablePadding: true,
                  label: "kod"
                },
                {
                  id: "city",
                  numeric: false,
                  disablePadding: true,
                  label: "Miejscowość"
                },
                {
                  id: "phone",
                  numeric: false,
                  disablePadding: true,
                  label: "Nr tel.",
                  textAlign: "center"
                },
                {
                  id: "field",
                  numeric: false,
                  disablePadding: true,
                  label: "Pola.",
                  textAlign: "center"
                },
                {
                  id: "meadow",
                  numeric: true,
                  disablePadding: true,
                  label: "Łąki",
                  textAlign: "center"
                },
                {
                  id: "qTractors",
                  numeric: true,
                  disablePadding: true,
                  label: "Traktory",
                  textAlign: "center"
                },
                {
                  id: "qHarvesters",
                  numeric: true,
                  disablePadding: true,
                  label: "Kombajny",
                  textAlign: "center"
                },
                {
                  id: "qCultivators",
                  numeric: true,
                  disablePadding: true,
                  label: "Siewniki",
                  textAlign: "center"
                },
                {
                  id: "qAgros",
                  numeric: true,
                  disablePadding: true,
                  label: "Inne",
                  textAlign: "center"
                },
                {
                  id: "employee",
                  numeric: true,
                  disablePadding: true,
                  label: "Pracownik",
                  hide: auth.role !== "master",
                  textAlign: "center"
                },
                {
                  id: "employee",
                  numeric: true,
                  disablePadding: true,
                  label: "",
                  // hide: auth.role !== "master",
                  hideSort: true,
                  hideRightBorder: true,
                  textAlign: "center"
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
          </Paper>
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

function mapStateToProps({ auth }) {
  return {
    auth,
    help: "Moduł do zarządzania szczegółowymi informacjami o klientach."
  };
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    null
  ),
  MainFrameHOC
)(CustomerDetails);
