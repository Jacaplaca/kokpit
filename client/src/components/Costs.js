import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { startOfMonth, endOfMonth } from "date-fns";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import ExpansionWithAbsolute from "../common/ExpansionWithAbsolute";

import * as actions from "../actions";
import { dataToString, defineds, dynamicSort } from "../common/functions";
import MainFrameHOC from "../common/MainFrameHOC";
//import SiteHeader from "../common/SiteHeader";
import CostsTable from "./CostsTable2Remote";
import ModalWindow from "./ModalWindow";
import CostsForm from "./CostsForm";
import DateRangePickerMy from "../common/DateRangePickerMy";
import CostsPodsumowanie from "./CostsPodsumowanie";
import { getString } from "../translate";

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

class Costs extends Component {
  state = {
    // numberformat: '',
    openModal: false,
    id: "",
    nr_dokumentu: "",
    data_wystawienia: "",
    nazwa_pozycji: "",
    kwota_netto: "",
    // categoryId: { label: '', value: '' },
    // groupId: { label: '', value: '' },
    categoryId: "",
    groupId: "",
    groups: [],
    categories: [],
    costs: [],
    editedId: "",
    duplicate: false,
    edited: false,
    chmurka_group: [],
    chmurka_category: [],
    rangeselection: {
      startDate: defineds.startOfMonth,
      endDate: defineds.endOfMonth,
      key: "rangeselection"
    },
    submitIsDisable: true
  };

  componentWillMount() {
    this.fetchCosts();
  }

  resultToState = fetch => {
    const koszty = fetch.data;
    koszty.map(el => Object.assign(el, { clicked: true }));
    this.setState({
      costs: koszty,
      chmurka_group: this.chmurka(koszty, "group"),
      chmurka_category: this.chmurka(koszty, "category")
    });
  };

  fetchCosts = async range => {
    // console.log(
    //   `${defineds.startOfMonth} ${defineds.endOfMonth} last: ${
    //     defineds.startOfLastMonth
    //   } ${defineds.endOfLastMonth} `
    // );
    this.props.loading(true);
    const { startDate, endDate } = this.state.rangeselection;

    const poczatek = range ? range.rangeselection.startDate : startDate;
    const koniec = range ? range.rangeselection.endDate : endDate;

    const fetch = await axios.get(
      `/api/table/costs/${dataToString(poczatek)}_${dataToString(koniec)}`
    );
    // console.log("fetrch", fetch);
    await this.resultToState(fetch);
    await this.props.loading(false);
  };

  chmurka = (data, kolumna) => {
    const nieUnikalneGrupy = data.map(el => {
      return JSON.stringify({
        id: el[`${kolumna}Id`],
        name: el[kolumna].name,
        clicked: true
      });
    });
    const unikalneGrupyString = [...new Set(nieUnikalneGrupy)];
    return unikalneGrupyString.map(el => JSON.parse(el));
  };

  renderSelectNorm = select => {
    const none = (
      <MenuItem value="">
        <em>Brak</em>
      </MenuItem>
    );
    const doWyboru = select.map(elem => (
      <MenuItem key={select} value={elem.id}>
        {elem.name}
      </MenuItem>
    ));
    return [none, ...doWyboru];
  };

  renderSelect = select => {
    //const none = { label: "Brak", value: "" };
    const doWyboru = select.map(elem => ({
      label: elem.name,
      value: elem.id
    }));
    return doWyboru.sort(dynamicSort("label"));
  };

  changeRange = data => {
    console.log("data", data);
    const dataWystawienia = data.data_wystawienia;
    const startDate = startOfMonth(new Date(dataWystawienia));
    const endDate = endOfMonth(new Date(dataWystawienia));
    const rangeselection = { endDate, startDate, key: "rangeselection" };
    this.setState({ rangeselection });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeKwota = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleChangeSelect = name => value => {
    this.setState({
      [name]: value
    });
  };

  handleClose = () => {
    this.setState({ openModal: false });
  };

  costs = () => {
    const koszty = this.state.costs;
    const { startDate, endDate } = this.state.rangeselection;
    const kosztyFiltered = koszty.filter(x => {
      const data = new Date(x.data_wystawienia);
      return data >= startDate && data <= endDate;
    });
    const costsInt = kosztyFiltered.map(x =>
      Object.assign(x, {
        kwota_netto: parseFloat(x.kwota_netto),
        kwota_brutto: parseFloat(x.kwota_brutto)
      })
    );
    return costsInt;
  };

  handleSelect = ranges => {
    this.setState({
      ...ranges
    });
    this.fetchCosts(ranges);
  };

  render() {
    //const { classes } = this.props;

    return (
      <div>
        <ModalWindow
          open={this.state.openModal}
          close={this.handleClose}
          maxWidth={900}
        >
          <Paper>
            <CostsForm
              fetchuj={() => this.fetchCosts()}
              //groups={this.state.groups}
              //categories={this.state.categories}
              changeRange={data => this.changeRange(data)}
              editedId={this.state.editedId}
              modal
              duplicate={this.state.duplicate}
              closeModal={() => this.setState({ openModal: false })}
            />
          </Paper>
        </ModalWindow>
        <ExpansionWithAbsolute title="Dodawanie i edycja kosztów">
          <CostsForm
            fetchuj={() => this.fetchCosts()}
            groups={this.state.groups}
            categories={this.state.categories}
            changeRange={data => this.changeRange(data)}
            editedId={this.state.editedId}
          />
        </ExpansionWithAbsolute>
        {/* <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              <span
                style={{
                  fontWeight: "600"
                }}
              >
                Dodawanie i edycja kosztów
              </span>
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={{ display: "block" }}>
            <CostsForm
              fetchuj={() => this.fetchCosts()}
              groups={this.state.groups}
              categories={this.state.categories}
              changeRange={data => this.changeRange(data)}
              editedId={this.state.editedId}
            />
          </ExpansionPanelDetails>
        </ExpansionPanel> */}

        <DateRangePickerMy
          range={[this.state.rangeselection]}
          onChange={this.handleSelect}
        />
        <CostsPodsumowanie costs={this.costs()} />
        <Paper>
          <CostsTable
            costs={this.costs()}
            fetch={() => this.fetchCosts()}
            edit={id => {
              this.setState({
                openModal: true,
                editedId: id,
                duplicate: false
              });
            }}
            duplicate={id => {
              this.setState({ openModal: true, editedId: id, duplicate: true });
            }}
          />
        </Paper>
      </div>
    );
  }
}

Costs.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth, language }) {
  return { auth, language };
}

// export default withStyles(styles, { withTheme: true })(
//   connect(
//     mapStateToProps,
//     actions
//   )(Costs)
// );
export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    actions
  ),
  MainFrameHOC
)(Costs);
