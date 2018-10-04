import React, { Component } from "react";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import Button from "@material-ui/core/Button";
import Send from "@material-ui/icons/Send";
import Edit from "@material-ui/icons/Edit";
import Cancel from "@material-ui/icons/Clear";

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
    nr_dokumentu: "",
    data_wystawienia: "",
    nazwa_pozycji: "",
    kwota_netto: "",
    kwota_brutto: "",
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      nr_dokumentu: nr_dokumentu_prevState,
      data_wystawienia: data_wystawienia_prevState,
      nazwa_pozycji: nazwa_pozycji_prevState,
      kwota_netto: kwota_netto_prevState,
      kwota_brutto: kwota_brutto_prevState,
      categoryId: categoryId_prevState,
      groupId: groupId_prevState
    } = prevState;
    const {
      nr_dokumentu,
      data_wystawienia,
      nazwa_pozycji,
      kwota_netto,
      kwota_brutto,
      categoryId,
      groupId
    } = this.state;
    if (
      (nr_dokumentu !== nr_dokumentu_prevState ||
        data_wystawienia !== data_wystawienia_prevState ||
        nazwa_pozycji !== nazwa_pozycji_prevState ||
        kwota_netto !== kwota_netto_prevState ||
        kwota_brutto !== kwota_brutto_prevState ||
        categoryId !== categoryId_prevState ||
        groupId !== groupId_prevState) &&
      (nr_dokumentu !== "" &&
        data_wystawienia !== "" &&
        nazwa_pozycji !== "" &&
        kwota_netto !== "" &&
        kwota_brutto !== "" &&
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
        kwota_brutto !== kwota_brutto_prevState ||
        categoryId !== categoryId_prevState ||
        groupId !== groupId_prevState) &&
      (nr_dokumentu === "" ||
        data_wystawienia === "" ||
        nazwa_pozycji === "" ||
        kwota_netto === "" ||
        kwota_brutto === "" ||
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
      kwota_brutto,
      categoryId,
      groupId
    } = this.state;
    if (
      id ||
      nr_dokumentu ||
      data_wystawienia ||
      nazwa_pozycji ||
      kwota_netto ||
      kwota_brutto ||
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

  handleEdit = id => {
    axios.get(`/api/id/cost/${id}`).then(result => {
      const {
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
    });
  };

  onEdit = () => {
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

    fetch(url, {
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
    })
      .then(() => {
        this.props.fetchuj();
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
      kwota_brutto,
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
        kwota_brutto,
        categoryId,
        groupId
      })
    })
      .then(resp => resp.json())
      .then(data => this.props.changeRange(data))
      .then(() => {
        // this.fetchCosts();
        this.props.fetchuj();
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
    const { classes, duplicate, modal } = this.props;
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
                kwota
              />
            </Grid>
            <Grid item xs={2}>
              <InputComponent
                name="kwota_brutto"
                label="Kwota brutto"
                type="text"
                edytuj={kwota_brutto => this.setState({ kwota_brutto })}
                value={this.state.kwota_brutto.replace(".", ",")}
                kwota
              />
            </Grid>
          </Grid>
          <Button
            disabled={submitIsDisable}
            onClick={e => {
              if (edited && !duplicate) {
                this.onEdit();
              } else if ((edited && duplicate) || !edited) {
                this.handleSubmit(e);
              }
            }}
            variant="contained"
            color="primary"
            className={classes.button}
          >
            {duplicate
              ? "Dodaj koszt"
              : edited
                ? "Edytuj koszt"
                : "Dodaj koszt"}
            <Send style={{ marginLeft: 10 }} />
          </Button>
          {this.czyWypelniony() && (
            <Button
              variant="contained"
              className={classes.button}
              onClick={() => this.clearForm()}
            >
              Anuluj
              <Cancel style={{ marginLeft: 10 }} />
            </Button>
          )}
        </form>
      </Paper>
    );
  }
}

CostsForm.propTypes = {
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
  )(CostsForm)
);

// export default withStyles(styles)(Costs);
