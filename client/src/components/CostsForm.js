import React, { Component } from "react";
import { connect } from "react-redux";

import NumberFormat from "react-number-format";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Select from "react-select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Send from "@material-ui/icons/Send";
import Edit from "@material-ui/icons/Edit";
import Cancel from "@material-ui/icons/Clear";

import { dynamicSort } from "../common/functions";

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        }
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

const components = {
  // Option,
  Control,
  // NoOptionsMessage,
  Placeholder
  //SingleValue,
  //MultiValue,
  //ValueContainer,
  //Menu,
};

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

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  // console.log(props);

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.formattedValue.replace(/ /g, "")
          }
        });
      }}
      decimalSeparator=","
      thousandSeparator=" "
      decimalScale={2}
      suffix="  zł"
    />
  );
}

class CostsForm extends Component {
  state = {
    id: "",
    nr_dokumentu: "",
    data_wystawienia: "",
    nazwa_pozycji: "",
    kwota_netto: "",
    categoryId: "",
    groupId: "",
    groups: [],
    categories: [],
    costs: [],
    edited: false,
    chmurka_group: [],
    chmurka_category: [],
    submitIsDisable: true
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
    this.props.modal && this.props.closeModal();
    // this.props.clearForm;
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

  handleEdit = id => {
    axios.get(`/api/id/cost/${id}`).then(result => {
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
    const { classes } = this.props;

    return (
      <Paper style={{ padding: 20 }}>
        <form onSubmit={e => this.handleSubmit(e)}>
          <FormControl
            className={classes.formControl}
            aria-describedby="name-helper-text"
          >
            <InputLabel htmlFor="name-helper">Nr dokumentu</InputLabel>
            <Input
              name="nr_dokumentu"
              id="name-helper"
              value={this.state.nr_dokumentu}
              onChange={this.handleChange}
            />
          </FormControl>
          <FormControl
            className={classes.formControl}
            aria-describedby="name-helper-text"
          >
            <TextField
              name="data_wystawienia"
              id="date"
              label="Data wystawienia"
              type="date"
              // defaultValue="2017-05-24"
              value={this.state.data_wystawienia}
              className={classes.textField}
              onChange={this.handleChange}
              InputLabelProps={{
                shrink: true
              }}
            />
          </FormControl>
          <FormControl
            className={classes.formControl}
            aria-describedby="name-helper-text"
          >
            <InputLabel htmlFor="name-helper">Nazwa pozycji</InputLabel>
            <Input
              name="nazwa_pozycji"
              id="name-helper"
              value={this.state.nazwa_pozycji}
              onChange={this.handleChange}
              style={{ width: 300 }}
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <TextField
              className={classes.formControl}
              name="kwota_netto"
              label="Kwota netto"
              value={this.state.kwota_netto.replace(".", ",")}
              onChange={this.handleChangeKwota("kwota_netto")}
              id="formatted-numberformat-input"
              InputProps={{
                inputComponent: NumberFormatCustom
              }}
            />
          </FormControl>
          <div style={{ display: "flex" }}>
            <div style={{ width: 410, marginRight: 22 }}>
              <InputLabel htmlFor="categoryId">Kategoria</InputLabel>
              <Select
                placeholder="Wybierz..."
                components={components}
                classes={classes}
                name="categoryId"
                id="categoryId"
                value={this.state.categoryId}
                onChange={this.handleChangeSelect("categoryId")}
                className={classes.selectEmpty}
                options={this.renderSelect(this.props.categories)}
              />
            </div>
            <div style={{ width: 305 }}>
              <InputLabel htmlFor="age-required">Grupa</InputLabel>
              <Select
                placeholder="Wybierz..."
                name="groupId"
                components={components}
                classes={classes}
                options={this.renderSelect(this.props.groups)}
                value={this.state.groupId}
                onChange={this.handleChangeSelect("groupId")}
              />
            </div>
          </div>
          {!this.state.edited ? (
            <Button
              disabled={this.state.submitIsDisable}
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Dodaj koszt
              <Send style={{ marginLeft: 10 }} />
            </Button>
          ) : (
            <Button
              disabled={this.state.submitIsDisable}
              onClick={() => this.onEdit()}
              variant="contained"
              color="primary"
              className={classes.button}
            >
              Edytuj koszt
              <Edit style={{ marginLeft: 10 }} />
            </Button>
          )}
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
