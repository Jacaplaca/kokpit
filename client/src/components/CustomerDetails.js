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
// import ModalWindow from "./ModalWindow";
import ModalWithHooks from "../common/ModalWithHooks";
import Summary from "./CustomerDetails/Summary";

import CustomerForm from "./CustomerDetails/CustomerForm";
import CustomerDetailsList from "./Products/ProductsList";
import ExpansionWithAbsolute from "../common/ExpansionWithAbsolute";

const tractorBrands = [
  // { id: 0, name: "Inna" },
  { id: 1, name: "Case" },
  { id: 2, name: "Deutz-Fahr" },
  { id: 3, name: "New Holland" },
  { id: 4, name: "Fendt" },
  { id: 5, name: "Massey Ferguson" },
  { id: 6, name: "Fiat" },
  { id: 7, name: "Lamborghini" },
  { id: 8, name: "Landini" },
  { id: 9, name: "Renault" },
  { id: 10, name: "SAME" },
  { id: 11, name: "Zetor" },
  { id: 12, name: "John Deere" },
  { id: 13, name: "Kubota" },
  { id: 14, name: "McCormick" },
  { id: 15, name: "Ursus" },
  { id: 16, name: "Valtra" }
];

const milkMaidBrands = [{ id: 1, name: "Gea" }, { id: 2, name: "Delaval" }];

const milkMaidTypes = [
  { id: 1, name: "Bańkowa" },
  { id: 2, name: "Przewodowa" },
  { id: 3, name: "Halal" }
];

const scheme = [{ type: "", brand: "", otherBrand: "", howMany: 1, id: 0 }];

class CustomerDetails extends Component {
  state = {
    details: null,
    edited: null,
    customersWithDetails: null,
    openForm: true,
    inMonth: 0,
    showDetails: false,
    customerName: "",
    address: "",
    phone: "",
    meadow: "",
    field: "",
    cows: "",
    pigs: "",
    tractor: [],
    harvester: [],
    milk: [],
    agro: [],
    cultivator: []
  };

  componentWillMount() {
    this.fetching();
    this.setState({
      openForm: this.props.auth.role === "master" ? false : true
    });
  }

  modifyMachine = machine => {
    const brands = tractorBrands.map(x => x.name);
    const mod = machine.map(x => {
      return Object.assign(x, {
        brand: brands.includes(x.brand) ? x.brand : "",
        otherBrand: brands.includes(x.brand) ? "" : x.brand,
        isOK: true
      });
    });
    return mod.length > 0 ? [...mod] : [...scheme];
    // return [...mod];
  };

  modifyCultivator = machine => {
    const cultMod = machine.map(x =>
      Object.assign(x, { brand: "", otherBrand: x.brand, isOK: true })
    );
    return cultMod.length > 0 ? [...cultMod] : [...scheme];
  };

  modifyAgro = machine => {
    const agroMod = machine.map(x =>
      Object.assign(x, {
        brand: "",
        otherBrand: x.model,
        type: "",
        isOK: true
      })
    );
    return agroMod.length > 0 ? [...agroMod] : [...scheme];
  };

  fetching = async () => {
    const data = await axios.get("/api/customerdetail/");
    const details = this.improveData(data.data);
    const inMonth = this.addedInMonth(data.data);
    // console.log(details);
    const customersWithDetails = details.map(x => x.Customer.id);
    await this.setAsyncState({ details, customersWithDetails, inMonth });
    console.log("this.state.inMonth", inMonth);
  };

  addedInMonth = data => {
    const { auth } = this.props;
    return data
      .filter(z => auth.id === z.userId)
      .map(x => new Date(x.createdAt).getMonth())
      .filter(y => y === new Date().getMonth()).length;
  };

  handleEdit = async id => {
    const data = await axios.get(`/api/customerdetail/${id}`);
    // this.setState({ showDetails: false });
    console.log("handleedit", id, data);
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
        qMilks: 0,
        employee: `${x.User.name} ${x.User.surname}`
      };
      const toIter = [
        "Tractors",
        "Harvesters",
        "Cultivators",
        "Agros",
        "Milks"
      ];
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

  hideDetails = () => {
    this.setState({ showDetails: false, customerName: "" });
  };

  showDetails = (row, event) => {
    console.log("clickOnRow", row, event.target["scope"]);
    const chosenRow = this.state.details.filter(x => x.id === row)[0];
    this.setState({
      showDetails: event.target["scope"] === "row",
      customerName: chosenRow.Customer.name,
      address: `${chosenRow.Customer.adr_Kod} ${
        chosenRow.Customer.adr_Miejscowosc
      }`,
      phone: chosenRow.phone,
      meadow: chosenRow.meadow,
      field: chosenRow.field,
      cows: chosenRow.cows,
      pigs: chosenRow.pigs,

      tractor: this.modifyMachine(chosenRow.Tractors),

      harvester: this.modifyMachine(chosenRow.Harvesters),
      milk: this.modifyMachine(chosenRow.Milks),

      agro: this.modifyAgro(chosenRow.Agros),
      cultivator: this.modifyCultivator(chosenRow.Cultivators)
    });
  };

  render() {
    const {
      details,
      edited,
      customersWithDetails,
      openForm,
      inMonth,
      showDetails,
      customerName,
      address,
      phone,
      meadow,
      field,
      cows,
      pigs,
      tractor,
      harvester,
      milk,
      cultivator,
      agro
    } = this.state;
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
            scheme={scheme}
            tractorBrands={tractorBrands}
            milkMaidBrands={milkMaidBrands}
            milkMaidTypes={milkMaidTypes}
            modifyMachine={this.modifyMachine}
            modifyCultivator={this.modifyMachine}
            modifyAgro={this.modifyAgro}
          />
        </ExpansionWithAbsolute>
        <div style={{ textAlign: "center", paddingTop: 15 }}>
          W obecnym miesiącu wypełniłeś{" "}
          <span style={{ fontWeight: 800 }}> {inMonth} </span>
          szt. nowych ankiet o klientach
        </div>
        <ModalWithHooks
          maxWidth={1000}
          openModal={showDetails}
          handleCloseModal={this.hideDetails}
        >
          {/* <div>Summary</div> */}
          <Summary
            data={{
              name: customerName,
              address,
              phone,
              field,
              meadow,
              cows,
              pigs,
              tractor,
              harvester,
              milk,
              cultivator,
              agro
            }}
          />
        </ModalWithHooks>
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
              clickOnRow={(row, event) => this.showDetails(row, event)}
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
                  id: "cows",
                  numeric: false,
                  disablePadding: true,
                  label: "Krowy",
                  textAlign: "center"
                },
                {
                  id: "pigs",
                  numeric: true,
                  disablePadding: true,
                  label: "Świnie",
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
                  id: "qMilks",
                  numeric: true,
                  disablePadding: true,
                  label: "Dojarki",
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
