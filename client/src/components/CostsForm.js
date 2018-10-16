import React, { Component } from "react";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import * as actions from "../actions";
import Send from "@material-ui/icons/Send";
import Cancel from "@material-ui/icons/Clear";
import ButtonMy from "../common/ButtonMy";
import SiteHeader from "../common/SiteHeader";
import InputComponent from "../common/inputs/InputComponent";
import InputSelectBaza from "../common/inputs/InputSelectBaza";
const styles = theme => ({
  input: {
    display: "flex",
    padding: 0
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  },
  button: {
    margin: theme.spacing.unit
  },
  container: {
    display: "inline-block",
    flexWrap: "nowrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  },
  formControl: {
    margin: theme.spacing.unit
  }
});

class CostsForm extends Component {
  state = {
    id: "",
    nr_dokumentu: "a",
    data_wystawienia: "2018-10-01",
    nazwa_pozycji: "a",
    kwota_netto: "1",
    kwota_brutto: "2",
    categoryId: "",
    groupId: "",
    groups: [],
    categories: [],
    costs: [],
    edited: false,
    chmurka_group: [],
    chmurka_category: [],
    isSubmitDisabled: true,

    categoryIdText: "",
    groupIdText: ""
  };

  componentWillMount() {
    this.state.id !== this.props.editedId &&
      this.handleEdit(this.props.editedId);
  }

  czyWypelniony = () => {
    const arr = [
      this.state.id,
      this.state.nr_dokumentu,
      this.state.data_wystawienia,
      this.state.nazwa_pozycji,
      this.state.kwota_netto,
      this.state.kwota_brutto,
      this.state.categoryId,
      this.state.groupId
    ];
    return arr.some(x => x);
  };

  clearForm = () => {
    this.setState(
      {
        id: "",
        nr_dokumentu: "",
        data_wystawienia: "",
        nazwa_pozycji: "",
        kwota_netto: "",
        kwota_brutto: "",
        categoryId: "",
        groupId: "",
        edited: false,
        categoryIdText: "",
        groupIdText: ""
      },
      () => this.canSubmit()
    );
    this.props.modal && this.props.closeModal();
  };

  handleEdit = async id => {
    const result = await axios.get(`/api/id/cost/${id}`);

    await this.addFetchToState(result);
  };

  addFetchToState = result => {
    const {
      id,
      nr_dokumentu,
      data_wystawienia,
      nazwa_pozycji,
      kwota_netto,
      kwota_brutto,
      categoryId,
      groupId,
      category,
      group
    } = result.data;
    this.setState(
      {
        id,
        nr_dokumentu,
        kwota_netto,
        kwota_brutto,
        nazwa_pozycji,
        data_wystawienia,
        categoryId,
        groupId,
        edited: true,
        categoryIdText: category.name,
        groupIdText: group.name
      },
      () => this.canSubmit()
    );
  };

  onEdit = async () => {
    this.props.submit(true);
    const {
      id,
      nr_dokumentu,
      data_wystawienia,
      nazwa_pozycji,
      kwota_netto,
      kwota_brutto,
      categoryId,
      groupId
    } = this.state;
    const url = `/api/cost/edit/${id}`;

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        nr_dokumentu,
        data_wystawienia,
        nazwa_pozycji,
        kwota_netto,
        kwota_brutto,
        categoryId,
        groupId
      })
    });
    await this.props.fetchuj();
    await this.clearForm();
    await this.props.submit(false);
  };

  handleSubmit = async e => {
    this.props.submit(true);
    e.preventDefault();
    const {
      nr_dokumentu,
      data_wystawienia,
      nazwa_pozycji,
      kwota_netto,
      kwota_brutto,
      categoryId,
      groupId
    } = this.state;
    const url = "/api/cost";

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        nr_dokumentu,
        data_wystawienia,
        nazwa_pozycji,
        kwota_netto,
        kwota_brutto,
        categoryId,
        groupId
      })
    });
    const data = await resp.json();
    await this.props.changeRange(data);
    await this.props.fetchuj();
    await this.clearForm();
    await this.props.submit(false);
  };

  handleChange = event => {
    const { name, value, type, text } = event.target;
    const label = `${name}Text`;

    if (type === "inputSelectBaza" && typeof value === "string") {
      this.setState({ [name]: "", [label]: value }, () => {
        this.canSubmit();
      });
    } else if (type === "inputSelectBaza" && typeof value === "number") {
      this.setState({ [name]: value, [label]: text }, () => {
        this.canSubmit();
      });
    } else {
      this.setState({ [name]: value }, () => {
        this.canSubmit();
      });
    }
  };

  canSubmit = () => {
    const porownanie = [
      this.state.nr_dokumentu,
      this.state.data_wystawienia,
      this.state.nazwa_pozycji,
      this.state.kwota_netto,
      this.state.kwota_brutto,
      this.state.categoryId,
      this.state.groupId
    ];

    if (porownanie.every(x => x !== "")) {
      this.setState({ isSubmitDisabled: false });
    } else {
      this.setState({ isSubmitDisabled: true });
    }
  };

  render() {
    const { classes, duplicate, modal, submitCheck } = this.props;
    const { edited, isSubmitDisabled } = this.state;

    return (
      <Paper style={{ padding: 20 }}>
        {modal && (
          <SiteHeader text={duplicate ? "Utwórz nowy koszt" : "Edytuj koszt"} />
        )}
        <form>
          <Grid container spacing={24}>
            <Grid item xs={4}>
              <InputComponent
                name="nr_dokumentu"
                label="Nr dokumentu"
                type="text"
                edytuj={this.handleChange}
                value={this.state.nr_dokumentu}
              />
            </Grid>
            <Grid item xs={4}>
              <InputComponent
                name="data_wystawienia"
                label="Data wystawienia"
                type="date"
                edytuj={this.handleChange}
                value={this.state.data_wystawienia}
              />
            </Grid>
            <Grid item xs={4}>
              <InputComponent
                name="nazwa_pozycji"
                label="Nazwa pozycji"
                type="text"
                edytuj={this.handleChange}
                value={this.state.nazwa_pozycji}
              />
            </Grid>
          </Grid>
          <Grid container spacing={24}>
            <Grid item xs={4}>
              <InputSelectBaza
                name="categoryId"
                wybrano={this.handleChange}
                value={this.state.categoryIdText}
                label="Kategorie"
                placeholder="Kategorie kosztowe"
                baza="category"
              />
            </Grid>
            <Grid item xs={4}>
              <InputSelectBaza
                wybrano={this.handleChange}
                value={this.state.groupIdText}
                label="Grupy"
                placeholder="Grupy kosztowe"
                name="groupId"
                baza="group"
              />
            </Grid>
            <Grid item xs={2}>
              <InputComponent
                name="kwota_netto"
                label="Kwota netto"
                type="text"
                edytuj={this.handleChange}
                value={this.state.kwota_netto.replace(".", ",")}
                kwota
              />
            </Grid>
            <Grid item xs={2}>
              <InputComponent
                name="kwota_brutto"
                label="Kwota brutto"
                type="text"
                edytuj={this.handleChange}
                value={this.state.kwota_brutto.replace(".", ",")}
                kwota
              />
            </Grid>
          </Grid>
          <ButtonMy
            progress
            disabled={isSubmitDisabled}
            onClick={e => {
              if (edited && !duplicate) {
                this.onEdit();
              } else if ((edited && duplicate) || !edited) {
                this.handleSubmit(e);
              }
            }}
          >
            {duplicate
              ? "Dodaj koszt"
              : edited
                ? "Edytuj koszt"
                : "Dodaj koszt"}
            {!submitCheck && <Send style={{ marginLeft: 10 }} />}
          </ButtonMy>
          {this.czyWypelniony() && (
            <ButtonMy colorMy="gray" onClick={() => this.clearForm()}>
              Anuluj
              <Cancel style={{ marginLeft: 10 }} />
            </ButtonMy>
          )}
        </form>
      </Paper>
    );
  }
}

CostsForm.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ submit: submitCheck }) {
  return { submitCheck };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    actions
  )(CostsForm)
);
