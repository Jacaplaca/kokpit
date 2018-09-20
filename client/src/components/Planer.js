import React, { Component } from "react";
import { startOfMonth, endOfMonth } from "date-fns";
import { connect } from "react-redux";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import {
  dataToString,
  podzielUnikalnymi,
  dynamicSort,
  defineds
} from "../common/functions";
import SiteHeader from "../common/SiteHeader";
import PlanerAktywnosciForm from "./PlanerAktywnosciForm";
import PlanerLista from "./PlanerLista";
import ModalWindow from "./ModalWindow";

import DateRangePickerMy from "../common/DateRangePickerMy";

const styles = theme => ({
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  },
  container: {
    width: "100%",
    display: "inline-block",
    flexWrap: "nowrap"
  }
});

class Planer extends Component {
  state = {
    // numberformat: '',
    aktywnosci: [],
    id: "",
    nr_dokumentu: "",
    data_wystawienia: "",
    nazwa_pozycji: "",
    kwota_netto: "",

    start: "",
    categoryId: "",
    groupId: "",
    groups: [],
    categories: [],
    costs: [],
    editedId: "",
    city: "",
    rangeselection: {
      startDate: defineds.startOfMonth,
      endDate: defineds.endOfMonth,
      key: "rangeselection"
    },
    edited: false,
    submitIsDisable: true,
    openModal: false,
    expanded: ""
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      nr_dokumentu: nr_dokumentu_prevState,
      data_wystawienia: data_wystawienia_prevState,
      nazwa_pozycji: nazwa_pozycji_prevState,
      kwota_netto: kwota_netto_prevState,
      categoryId: categoryId_prevState,
      groupId: groupId_prevState
    } = prevState;
    const {
      nr_dokumentu,
      data_wystawienia,
      nazwa_pozycji,
      kwota_netto,
      categoryId,
      groupId
    } = this.state;
    if (
      (nr_dokumentu !== nr_dokumentu_prevState ||
        data_wystawienia !== data_wystawienia_prevState ||
        nazwa_pozycji !== nazwa_pozycji_prevState ||
        kwota_netto !== kwota_netto_prevState ||
        categoryId !== categoryId_prevState ||
        groupId !== groupId_prevState) &&
      (nr_dokumentu !== "" &&
        data_wystawienia !== "" &&
        nazwa_pozycji !== "" &&
        kwota_netto !== "" &&
        (categoryId ? categoryId.value !== "" : categoryId !== "") &&
        (groupId ? groupId.value !== "" : groupId !== ""))
      // categoryId.value !== '' &&
      // groupId.value !== ''
    ) {
      this.setState({ submitIsDisable: false });
    } else if (
      (nr_dokumentu !== nr_dokumentu_prevState ||
        data_wystawienia !== data_wystawienia_prevState ||
        nazwa_pozycji !== nazwa_pozycji_prevState ||
        kwota_netto !== kwota_netto_prevState ||
        categoryId !== categoryId_prevState ||
        groupId !== groupId_prevState) &&
      (nr_dokumentu === "" ||
        data_wystawienia === "" ||
        nazwa_pozycji === "" ||
        kwota_netto === "" ||
        (categoryId ? categoryId.value === "" : categoryId === "") ||
        (groupId ? groupId.value === "" : groupId === ""))
    ) {
      this.setState({ submitIsDisable: true });
    } else {
      return;
    }
  }

  czyWypelniony = () => {
    const {
      id,
      nr_dokumentu,
      data_wystawienia,
      nazwa_pozycji,
      kwota_netto,
      categoryId,
      groupId
    } = this.state;
    if (
      id ||
      nr_dokumentu ||
      data_wystawienia ||
      nazwa_pozycji ||
      kwota_netto ||
      categoryId ||
      groupId
    ) {
      return true;
    } else {
      return false;
    }
  };

  clearForm = () => {
    this.setState({
      id: "",
      nr_dokumentu: "",
      data_wystawienia: "",
      nazwa_pozycji: "",
      kwota_netto: "",
      categoryId: "",
      groupId: "",
      edited: false
    });
  };

  componentWillMount() {
    this.fetchAktywnosci();
  }

  fetchAktywnosci = range => {
    const { startDate, endDate } = this.state.rangeselection;
    const poczatek = range ? range.rangeselection.startDate : startDate;
    const koniec = range ? range.rangeselection.endDate : endDate;
    axios
      .get(
        `/api/table/planerAktywnosci/${dataToString(poczatek)}_${dataToString(
          koniec
        )}`
      )
      .then(result => {
        const podzielone = podzielUnikalnymi(result.data, "kiedy");
        this.setState({
          aktywnosci: []
        });
        this.setState({
          aktywnosci: podzielone.sort(dynamicSort("kiedy")).reverse()
        });
      });
  };

  handleEdit = id => {
    axios.get(`/api/cost/${id}`).then(result => {
      const {
        nr_dokumentu,
        data_wystawienia,
        nazwa_pozycji,
        kwota_netto,
        category,
        group
      } = result.data;
      this.setState({
        id,
        nr_dokumentu,
        kwota_netto,
        nazwa_pozycji,
        data_wystawienia,
        categoryId: { label: category.name, value: category.id },
        groupId: { label: group.name, value: group.id },
        edited: true
      });
    });
  };

  onEdit = () => {
    const {
      id,
      nr_dokumentu,
      data_wystawienia,
      nazwa_pozycji,
      kwota_netto,
      categoryId,
      groupId
    } = this.state;
    const url = `/api/cost/edit/${id}`;

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        nr_dokumentu,
        data_wystawienia,
        nazwa_pozycji,
        kwota_netto,
        categoryId,
        groupId
      })
    })
      .then(() => {
        this.fetchAktywnosci();
      })
      .then(() => {
        this.clearForm();
      });
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      nr_dokumentu,
      data_wystawienia,
      nazwa_pozycji,
      kwota_netto,
      categoryId,
      groupId
    } = this.state;
    const url = "/api/cost";

    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        nr_dokumentu,
        data_wystawienia,
        nazwa_pozycji,
        kwota_netto,
        categoryId,
        groupId
      })
    })
      .then(resp => resp.json())
      .then(data => {
        const dataWystawienia = data.data_wystawienia;
        const startDate = startOfMonth(dataWystawienia);
        const endDate = endOfMonth(dataWystawienia);
        const rangeselection = { endDate, startDate, key: "rangeselection" };
        this.setState({ rangeselection });
      })
      .then(() => {
        this.fetchAktywnosci();
      })
      .then(() => {
        this.clearForm();
      });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChangeKwota = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleClose = () => {
    this.setState({ openModal: false });
  };

  handleChangeSelect = name => value => {
    this.setState({
      [name]: value
    });
  };

  handleSelect = ranges => {
    this.setState({
      ...ranges
    });
    this.fetchAktywnosci(ranges);
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <SiteHeader text={"Zaplanuj aktywności"} />
        <PlanerAktywnosciForm
          editedId={this.state.editedId}
          expanded={expanded => this.setState({ expanded })}
          fetchuj={() => this.fetchAktywnosci()}
        />
        <DateRangePickerMy
          range={[this.state.rangeselection]}
          onChange={this.handleSelect}
        />
        <Paper>
          <PlanerLista
            wyslijDoPlanuButton
            aktywnosci={this.state.aktywnosci}
            edit={id => {
              this.setState({ openModal: true });
              this.setState({ editedId: id });
            }}
            delete={id => console.log(id)}
            fetchuj={() => this.fetchAktywnosci()}
            expanded={this.state.expanded}
            wyslanoDoPlanu={expanded => this.setState({ expanded })}
            component="akt"
            // edit={id => console.log(id)}
          />
        </Paper>
        <ModalWindow
          open={this.state.openModal}
          close={this.handleClose}
          maxWidth={900}
        >
          <PlanerAktywnosciForm
            modal
            editedId={this.state.editedId}
            closeModal={() => this.setState({ openModal: false })}
            fetchuj={() => this.fetchAktywnosci()}
            expanded={expanded => this.setState({ expanded })}
          />
        </ModalWindow>
      </div>
    );
  }
}

Planer.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth };
}

// export default connect(mapStateToProps)(Header);

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps
    // actions
  )(Planer)
);
