import React, { Component } from "react";
import { connect } from "react-redux";
import { startOfMonth, endOfMonth } from "date-fns";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";

import * as actions from "../actions";
import { dataToString, defineds, dynamicSort } from "../common/functions";
import MainFrame from "../common/MainFrame";
import SiteHeader from "../common/SiteHeader";
import CostsTable from "./CostsTable2Remote";
import ModalWindow from "./ModalWindow";
import CostsForm from "./CostsForm";
import DateRangePickerMy from "../common/DateRangePickerMy";
import CostsPodsumowanie from "./CostsPodsumowanie";

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
    // axios
    //   .get("/api/table/group")
    //   .then(result => this.setState({ groups: result.data }));
    // // .then(result => this.renderSelect(result.data));
    // axios
    //   .get("/api/table/category")
    //   .then(result => this.setState({ categories: result.data }));
    this.fetchCosts();
  }

  fetchCosts = range => {
    this.props.loading(true);
    console.log(range);
    const { startDate, endDate } = this.state.rangeselection;

    const poczatek = range ? range.rangeselection.startDate : startDate;
    const koniec = range ? range.rangeselection.endDate : endDate;

    console.log("fetchCosts()");
    axios
      .get(`/api/table/costs/${dataToString(poczatek)}_${dataToString(koniec)}`)
      .then(result => {
        const koszty = result.data;
        const nieUnikalneGrupy = koszty.map(el => {
          return { groupId: el.groupId, group: el.group.name };
        });
        koszty.map(el => Object.assign(el, { clicked: true }));
        this.setState({
          costs: koszty,
          chmurka_group: this.chmurka(koszty, "group"),
          chmurka_category: this.chmurka(koszty, "category")
        });
      })
      .then(() => this.props.loading(false));
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
    const none = { label: "Brak", value: "" };
    const doWyboru = select.map((elem, i) => ({
      label: elem.name,
      value: elem.id
    }));
    return doWyboru.sort(dynamicSort("label"));
  };

  changeRange = data => {
    const dataWystawienia = data.data_wystawienia;
    const startDate = startOfMonth(dataWystawienia);
    const endDate = endOfMonth(dataWystawienia);
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
    const { classes } = this.props;

    return (
      <MainFrame>
        <SiteHeader text={"Dodaj koszty"} />
        <ModalWindow
          open={this.state.openModal}
          close={this.handleClose}
          maxWidth={900}
        >
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
        </ModalWindow>
        <CostsForm
          fetchuj={() => this.fetchCosts()}
          groups={this.state.groups}
          categories={this.state.categories}
          changeRange={data => this.changeRange(data)}
          editedId={this.state.editedId}
        />
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
      </MainFrame>
    );
  }
}

Costs.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    actions
  )(Costs)
);
