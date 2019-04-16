import React, { Component } from "react";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import * as actions from "../actions";
import Send from "@material-ui/icons/Send";
//import Edit from "@material-ui/icons/Edit";
import Cancel from "@material-ui/icons/Clear";

import ButtonMy from "../common/ButtonMy";
import SiteHeader from "../common/SiteHeader";
import InputComponent from "../common/inputs/InputComponent";
import InputSelectBaza from "../common/inputs/InputSelectBaza";
import InputData from "../common/inputs/InputData";
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
    data_wystawienia: "2019-04-11",
    nazwa_pozycji: "a",
    kwota_netto: "95",
    kwota_brutto: "115",
    categoryId: "",
    groupId: "",
    groups: [],
    categories: [],
    costs: [],
    edited: false,
    chmurka_group: [],
    chmurka_category: [],
    submitIsDisable: true,

    categoryText: "",
    groupText: ""
  };

  componentWillMount() {
    this.state.id !== this.props.editedId &&
      this.handleEdit(this.props.editedId);
  }

  componentDidUpdate(prevProps, prevState) {
    const porownanie = [
      [this.state.nr_dokumentu, prevState.nr_dokumentu],
      [this.state.data_wystawienia, prevState.data_wystawienia],
      [this.state.nazwa_pozycji, prevState.nazwa_pozycji],
      [this.state.kwota_netto, prevState.kwota_netto],
      [this.state.kwota_brutto, prevState.kwota_brutto],
      [this.state.categoryId, prevState.categoryId],
      [this.state.groupId, prevState.groupId]
    ];
    if (
      porownanie.some(x => x[0] !== x[1]) &&
      porownanie.every(x => x[0] !== "")
    ) {
      this.setState({ submitIsDisable: false });
    } else if (
      porownanie.some(x => x[0] !== x[1]) &&
      porownanie.some(x => x[0] === "")
    ) {
      this.setState({ submitIsDisable: true });
    } else {
      return;
    }
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
    this.setState({
      id: "",
      nr_dokumentu: "",
      data_wystawienia: "",
      nazwa_pozycji: "",
      kwota_netto: "",
      kwota_brutto: "",
      categoryId: "",
      groupId: "",
      edited: false,
      categoryText: "",
      groupText: ""
    });
    this.props.modal && this.props.closeModal();
    // this.props.clearForm;
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
    this.setState({
      id,
      nr_dokumentu,
      kwota_netto,
      kwota_brutto,
      nazwa_pozycji,
      data_wystawienia,
      categoryId,
      groupId,
      edited: true,
      categoryText: category.name,
      groupText: group.name
    });
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

  handleSelect = ranges => {
    this.setState({
      ...ranges
    });
  };

  render() {
    const { classes, duplicate, modal, submitCheck } = this.props;
    const { edited, submitIsDisable } = this.state;

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
                edytuj={nr_dokumentu => this.setState({ nr_dokumentu })}
                value={this.state.nr_dokumentu}
              />
            </Grid>
            <Grid item xs={4}>
              <InputData
                id="date"
                name="data_wystawienia"
                //disabled={modal ? true : false}
                label="Data wystawienia"
                //error={this.state.errorKiedy}
                //label="Kiedy"
                type="date"
                edytuj={data_wystawienia => this.setState({ data_wystawienia })}
                value={this.state.data_wystawienia}
              />
            </Grid>
            <Grid item xs={4}>
              <InputComponent
                name="nazwa_pozycji"
                label="Nazwa pozycji"
                type="text"
                edytuj={nazwa_pozycji => this.setState({ nazwa_pozycji })}
                value={this.state.nazwa_pozycji}
              />
            </Grid>
          </Grid>
          <Grid container spacing={24}>
            <Grid item xs={4}>
              <InputSelectBaza
                daty={datyDoRaportu => this.setState({ datyDoRaportu })}
                wybrano={category => {
                  category && this.setState({ categoryId: category.id });
                }}
                edytuj={categoryText => {
                  this.setState({ categoryText });
                }}
                czysc={() =>
                  this.setState({ categoryId: "", categoryText: "" })
                }
                value={this.state.categoryText}
                label="Kategorie"
                placeholder="Kategorie kosztowe"
                przeszukuje="category"
              />
            </Grid>
            <Grid item xs={4}>
              <InputSelectBaza
                daty={datyDoRaportu => this.setState({ datyDoRaportu })}
                wybrano={group => {
                  group && this.setState({ groupId: group.id });
                }}
                edytuj={groupText => {
                  this.setState({ groupText });
                }}
                czysc={() => this.setState({ groupId: "", groupText: "" })}
                value={this.state.groupText}
                label="Grupy"
                placeholder="Grupy kosztowe"
                przeszukuje="group"
              />
            </Grid>
            <Grid item xs={2}>
              <InputComponent
                name="kwota_netto"
                label="Kwota netto"
                type="text"
                edytuj={kwota_netto => this.setState({ kwota_netto })}
                value={this.state.kwota_netto.replace(".", ",")}
                // kwota
                format="zl"
              />
            </Grid>
            <Grid item xs={2}>
              <InputComponent
                name="kwota_brutto"
                label="Kwota brutto"
                type="text"
                edytuj={kwota_brutto => this.setState({ kwota_brutto })}
                value={this.state.kwota_brutto.replace(".", ",")}
                // kwota
                format="zl"
              />
            </Grid>
          </Grid>
          <ButtonMy
            progress
            disabled={submitIsDisable}
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
