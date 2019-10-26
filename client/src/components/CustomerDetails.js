import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
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

import InfoElement from "../common/InfoElement";
import CustomerDetailsSummary from "./CustomerDetailsSummary";

const tractorBrands = [
  // { id: 0, name: "Inna" },
  { id: 1, name: "Case" },
  { id: 2, name: "Claas" },
  { id: 3, name: "Deutz-Fahr" },
  { id: 4, name: "Fendt" },
  { id: 5, name: "Fiat" },
  { id: 6, name: "John Deere" },
  { id: 7, name: "Kubota" },
  { id: 8, name: "Lamborghini" },
  { id: 9, name: "Landini" },
  { id: 10, name: "Massey Ferguson" },
  { id: 11, name: "McCormick" },
  { id: 12, name: "New Holland" },
  { id: 13, name: "Renault" },
  { id: 14, name: "SAME" },
  { id: 15, name: "Ursus" },
  { id: 16, name: "Valtra" },
  { id: 17, name: "Zetor" }
];

const milkMaidBrands = [{ id: 1, name: "Delaval" }, { id: 2, name: "Gea" }];

const milkMaidTypes = [
  { id: 1, name: "Bańkowa" },
  { id: 2, name: "Halal" },
  { id: 3, name: "Przewodowa" }
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
    cultivator: [],
    addedByUsers: false
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
    console.log("TCL: CustomerDetails -> fetching -> data", data);
    const details = this.improveData(data.data);
    console.log("TCL: CustomerDetails -> fetching -> details", details);
    const inMonth = this.addedInMonth(data.data);
    const addedByUsers = this.addedRecordsByUsers(data.data);
    // console.log(details);
    const customersWithDetails = details.map(x => x.Customer.id);
    await this.setAsyncState({
      details,
      customersWithDetails,
      inMonth,
      addedByUsers
    });
    console.log("this.state.inMonth", inMonth);
  };

  addedInMonth = data => {
    const { auth } = this.props;
    return data
      .filter(z => auth.id === z.userId)
      .map(x => new Date(x.createdAt).getMonth())
      .filter(y => y === new Date().getMonth()).length;
  };

  addedRecordsByUsers = data => {
    const today = new Date();
    const todayMonth = today.getMonth();
    const todayYear = today.getYear();
    let todayMonthMinusOne = 0;
    let todayYearMinusOne = 0;
    if (todayMonth == 0) {
      todayMonthMinusOne = 11;
      todayYearMinusOne = todayYear - 1;
    } else {
      todayMonthMinusOne = todayMonth - 1;
      todayYearMinusOne = todayYear;
    }
    let activeUsers = data.map(record => record.User.id);
    activeUsers = [...new Set(activeUsers)];
    let usersRecordsDates = {};
    let usersSummary = {};
    let usersSummaryArray = [];
    data.forEach(record => {
      // const month = new Date();
      const recordDate = new Date(record.createdAt);
      const recordMonth = recordDate.getMonth();
      const recordYear = recordDate.getYear();
      if (record.User.id in usersRecordsDates) {
        usersRecordsDates[record.User.id].push([recordYear, recordMonth]);
      } else {
        usersRecordsDates = {
          ...usersRecordsDates,
          [record.User.id]: [[recordYear, recordMonth]]
        };
      }
    });
    activeUsers.forEach(user => {
      // const recordDate = new Date(record.createdAt);
      // const recordMonth = recordDate.getMonth();
      // const recordYear = recordDate.getYear();
      let all = 0;
      let thisMonth = 0;
      let prevMonth = 0;
      let employee = "";
      usersRecordsDates[user].forEach(month => {
        const userRecords = data.filter(record => record.User.id == user);
        employee = userRecords[0].employee;
        all = all + 1;
        if (month.join(",") == [todayYear, todayMonth].join(",")) {
          thisMonth = thisMonth + 1;
        } else if (
          month.join(",") == [todayYearMinusOne, todayMonthMinusOne].join(",")
        ) {
          prevMonth = prevMonth + 1;
        }
      });
      usersSummaryArray.push({ user, all, thisMonth, prevMonth, employee });

      // var d = new Date("2020-01-05");
      // console.log(d.setMonth(d.getMonth() - 1));
      // console.log("TCL: CustomerDetails -> usersRecordsDates", usersRecordsDates);
    });
    return usersSummaryArray;
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
      address: `${chosenRow.Customer.adr_Kod} ${chosenRow.Customer.adr_Miejscowosc}`,
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
        <InfoElement published={"2019 7 19"} duration={14}>
          <div>
            <h6>Najnowsze zmiany:</h6>
            <ul style={{ fontSize: 11.55 }}>
              <li>Dodany Claas do marek traktorów i kombajnów </li>
              <li>
                Po kliknięciu na listę dodanych wpisów, pokazuje się informacja
                o klikniętym wpisie. Aby wrócić wystarczy wcisnąć ESC lub
                kliknąć myszą poza okienkiem z informacją.
              </li>
              <li>Dodana ilość krów i ilość świń </li>
              <li>
                Każdy użytkownik widzi tylko tych klientów, których sam dodał.
                Konto sklepu na Kilińskiego widzi wszystkich.
              </li>
              <li>Dodana możliwość dodawania informacji o dojarkach. </li>
              <li>
                Dodany licznik pokazujący ilość wypełnionych przez danego
                użytkownika.
              </li>
              {/* <p>Okienko będzie sie pojawiało do sierpnia</p> */}
            </ul>
          </div>
        </InfoElement>

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
        {auth.role != "master" && (
          <div style={{ textAlign: "center", paddingTop: 15 }}>
            W obecnym miesiącu wypełniłeś{" "}
            <span style={{ fontWeight: 800 }}> {inMonth} </span>
            szt. nowych ankiet o klientach
          </div>
        )}
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
        {this.state.addedByUsers && auth.role == "master" && (
          <CustomerDetailsSummary data={this.state.addedByUsers} />
        )}
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
