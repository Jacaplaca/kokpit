import React, { Component } from "react";
// import { DateRange } from 'react-date-range';
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import _ from "lodash";
import currency from "currency.js";
import { connect } from "react-redux";
import { startOfMonth, endOfMonth } from "date-fns";

import NumberFormat from "react-number-format";

import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
// import NoSsr from '@material-ui/core/NoSsr';
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
// import Select from '@material-ui/core/Select';
import Select from "react-select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Send from "@material-ui/icons/Send";
import Edit from "@material-ui/icons/Edit";
import Cancel from "@material-ui/icons/Clear";

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
  // accordionClass: {
  //   backgroundColor: fade(theme.palette.primary.main, 0.15)
  //   // borderColor: theme.palette.primary.main,
  //   // color: 'white'
  // },
  button: {
    margin: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
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
  },
  mojChipClickedRoot: {
    color: "white",
    margin: theme.spacing.unit / 2,
    backgroundColor: theme.palette.primary.main
  },
  mojChipRoot: {
    margin: theme.spacing.unit / 2,
    backgroundColor: "lightgray"
  },
  mojChipClicked: {
    "&:hover, &:focus": {
      margin: theme.spacing.unit / 2,
      backgroundColor: "lightgray"
    },
    "&:active": {
      color: "white",
      margin: theme.spacing.unit / 2,
      backgroundColor: theme.palette.primary.main
    }
  },
  mojChip: {
    "&:hover, &:focus": {
      color: "white",
      margin: theme.spacing.unit / 2,
      backgroundColor: theme.palette.primary.main
    },
    "&:active": {
      margin: theme.spacing.unit / 2,
      backgroundColor: "lightgray"
    }
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
      // removeFormatting={formattedValue => `{}`}
      decimalSeparator=","
      thousandSeparator=" "
      // format="### ### ### ###"
      decimalScale={2}
      // prefix="$"
      suffix="  zł"
    />
  );
}

class CostsForm extends Component {
  state = {
    // numberformat: '',
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
    edited: false,
    chmurka_group: [],
    chmurka_category: [],
    submitIsDisable: true
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

  componentWillReceiveProps(nextProps) {
    this.state.id !== nextProps.editedId && this.handleEdit(nextProps.editedId);
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
    // this.props.clearForm;
  };

  // componentWillMount() {
  //   axios
  //     .get("/api/table/group")
  //     .then(result => this.setState({ groups: result.data }));
  //   // .then(result => this.renderSelect(result.data));
  //   axios
  //     .get("/api/table/category")
  //     .then(result => this.setState({ categories: result.data }));
  //   this.fetchCosts();
  // }

  // fetchCosts = () => {
  //   axios.get("/api/table/costs").then(result => {
  //     const koszty = result.data;
  //     const nieUnikalneGrupy = koszty.map(el => {
  //       return { groupId: el.groupId, group: el.group.name };
  //     });
  //     koszty.map(el => Object.assign(el, { clicked: true }));
  //     this.setState({
  //       costs: koszty,
  //       chmurka_group: this.chmurka(koszty, "group"),
  //       chmurka_category: this.chmurka(koszty, "category")
  //     });
  //   });
  // };

  // chmurka = (data, kolumna) => {
  //   const nieUnikalneGrupy = data.map(el => {
  //     return JSON.stringify({
  //       id: el[`${kolumna}Id`],
  //       name: el[kolumna].name,
  //       clicked: true
  //     });
  //   });
  //   const unikalneGrupyString = [...new Set(nieUnikalneGrupy)];
  //   return unikalneGrupyString.map(el => JSON.parse(el));
  // };

  // onlyUnique = (value, index, self) => {
  //   return self.indexOf(value) === index;
  // };

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

  dynamicSort = property => {
    let sortOrder = 1;
    if (property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function(a, b) {
      const result =
        a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
      return result * sortOrder;
    };
  };

  renderSelect = select => {
    const none = { label: "Brak", value: "" };
    const doWyboru = select.map((elem, i) => ({
      label: elem.name,
      value: elem.id
    }));
    return doWyboru.sort(this.dynamicSort("label"));
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
    console.log("on edit");
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
        // this.fetchCosts();
        this.props.fetchuj();
      })
      .then(() => {
        this.clearForm();
      });
  };

  handleSubmit = e => {
    const { user_id, clientId } = this.props.auth;
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
    console.log(name);
    console.log(value);
    this.setState({
      [name]: value
    });
  };

  // handleChipClick = (data, kolumna) => () => {
  //   let koszty;
  //   let drugaKolumna;
  //   let porownanie = [];
  //   let zmodyfikowaneChip = [];
  //   switch (kolumna) {
  //     case "category":
  //       drugaKolumna = "group";
  //       break;
  //     case "group":
  //       drugaKolumna = "category";
  //       break;
  //     default:
  //   }
  //
  //   this.setState(state => {
  //     const chipData = [...state[`chmurka_${kolumna}`]];
  //     const chipToClick = chipData.indexOf(data);
  //     data.clicked = data.clicked ? false : true;
  //     chipData[chipToClick] = data;
  //     return { [`chmurka_${kolumna}`]: chipData };
  //   });
  //   this.setState(state => {
  //     koszty = [...state.costs];
  //     koszty.map(el => {
  //       if (el[`${kolumna}Id`] !== data.id) {
  //         return el;
  //       } else {
  //         return Object.assign(el, { clicked: el.clicked ? false : true });
  //       }
  //     });
  //   });
  //   this.setState(state => {
  //     const chipData = [...state[`chmurka_${drugaKolumna}`]];
  //     const drugaKolumnaFalse = koszty.map(el => {
  //       if (!el.clicked) {
  //         return el[drugaKolumna].name;
  //       } else {
  //         return null;
  //       }
  //     });
  //     const jestTrue = drugaKolumnaFalse.map(el =>
  //       koszty.filter(x => x[drugaKolumna].name === el && x.clicked === true)
  //     );
  //     const porownanie = drugaKolumnaFalse.map((x, i) => {
  //       const dlugoscJestTrue = jestTrue[i].length;
  //       return { name: x, powtarza: dlugoscJestTrue };
  //     });
  //
  //     porownanie.map(x => {
  //       if (x.name !== null && x.powtarza === 0) {
  //         chipData.map(y => {
  //           if (y.name === x.name) {
  //             return zmodyfikowaneChip.push({
  //               id: y.id,
  //               name: y.name,
  //               clicked: false
  //             });
  //           } else {
  //             return zmodyfikowaneChip.push({
  //               id: y.id,
  //               name: y.name,
  //               clicked: true
  //             });
  //           }
  //         });
  //       } else if (x.name !== null && x.powtarza > 0) {
  //         zmodyfikowaneChip = chipData.map(y => {
  //           if (y.name === x.name) {
  //             // console.log(x.name);
  //             return { id: y.id, name: y.name, clicked: true };
  //           } else {
  //             return { id: y.id, name: y.name, clicked: false };
  //           }
  //         });
  //       }
  //     });
  //   });
  // };

  costs = () => {
    const koszty = this.state.costs;
    const { startDate, endDate } = this.state.rangeselection;
    const kosztyFiltered = koszty.filter(x => {
      const data = new Date(x.data_wystawienia);
      return data >= startDate && data <= endDate;
    });
    const costsInt = kosztyFiltered.map(x =>
      Object.assign(x, {
        kwota_netto: parseFloat(x.kwota_netto)
      })
    );
    return costsInt;
  };

  handleSelect = ranges => {
    this.setState({
      ...ranges
    });
  };

  sumOfKey = (data, key) => {
    let dane;
    let sorting;
    switch (key) {
      case "category":
        dane = _(data)
          .groupBy("category.name")
          .map((v, k) => {
            const suma = _.sumBy(v, "kwota_netto");
            return {
              name: k,
              value: Math.round(suma),
              value_format: `${currency(Math.round(suma), {
                separator: " ",
                decimal: ","
              }).format()}`
            };
          })
          .value();

        sorting = dane.sort(function(a, b) {
          return a.value - b.value;
        });

        return sorting.reverse();

        break;
      case "group":
        dane = _(data)
          .groupBy("group.name")
          .map((v, k) => {
            const suma = _.sumBy(v, "kwota_netto");
            return {
              name: k,
              value: suma,
              value_format: `${currency(Math.round(suma), {
                separator: " ",
                decimal: ","
              }).format()}`
            };
          })
          .value();

        sorting = dane.sort(function(a, b) {
          return a.value - b.value;
        });

        return sorting.reverse();

        break;
      default:
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper style={{ padding: 20, marginBottom: 20 }}>
        <form
          onSubmit={e => this.handleSubmit(e)}
          // method="POST"
          // action="/api/cost/"
        >
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
            {/* <FormHelperText id="name-helper-text">
            Some important helper text
          </FormHelperText> */}
          </FormControl>
          <FormControl
            className={classes.formControl}
            aria-describedby="name-helper-text"
          >
            {/* <InputLabel htmlFor="name-helper">Name</InputLabel> */}
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
            {/* <FormHelperText id="name-helper-text">
            Some important helper text
          </FormHelperText> */}
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
            {/* <FormHelperText id="name-helper-text">
            Some important helper text
          </FormHelperText> */}
          </FormControl>

          <FormControl className={classes.formControl}>
            {/* <InputLabel htmlFor="adornment-password">Kwota netto</InputLabel> */}
            <TextField
              className={classes.formControl}
              name="kwota_netto"
              label="Kwota netto"
              value={this.state.kwota_netto.replace(".", ",")}
              // onChange={this.handleChange}
              // value={this.state.kwota_netto}
              onChange={this.handleChangeKwota("kwota_netto")}
              id="formatted-numberformat-input"
              InputProps={{
                inputComponent: NumberFormatCustom
              }}
              // endAdornment={
              //   <InputAdornment position="end">PLN</InputAdornment>
              // }
            />
            {/* <Input
                name="kwota_netto"
                id="adornment-password"
                // type={this.state.showPassword ? 'text' : 'password'}
                value={this.state.kwota_netto.replace('.', ',')}
                onChange={this.handleChange}
                style={{ width: 150 }}
                endAdornment={
                  <InputAdornment position="end">PLN</InputAdornment>
                }
              /> */}
          </FormControl>
          <div style={{ display: "flex" }}>
            <div style={{ width: 410, marginRight: 22 }}>
              {/* <FormControl required className={classes.formControl}> */}
              <InputLabel htmlFor="categoryId">Kategoria</InputLabel>
              <Select
                // label="Kategoria"
                placeholder="Wybierz..."
                components={components}
                classes={classes}
                name="categoryId"
                // label="asdf"
                id="categoryId"
                // defaultValue="asdf"
                // InputLabelProps={{
                //   shrink: true
                // }}
                // value={this.state.age}
                value={this.state.categoryId}
                // value="Brak"
                onChange={this.handleChangeSelect("categoryId")}
                // name="age"
                // inputProps={{
                //   id: 'age-required'
                // }}
                className={classes.selectEmpty}
                // style={{ width: 200 }}
                options={this.renderSelect(this.props.categories)}
                // options={[
                //   { label: 'aa', value: 1 },
                //   { label: 'bb', value: 2 }
                // ]}
              >
                {/* {this.renderSelect(this.state.categories)} */}
              </Select>
              {/* <FormHelperTex  t>Required</FormHelperText> */}
              {/* </FormControl> */}
            </div>
            <div style={{ width: 305 }}>
              {/* <FormControl required className={classes.formControl}> */}
              <InputLabel htmlFor="age-required">Grupa</InputLabel>
              {/* <NoSsr> */}
              <Select
                placeholder="Wybierz..."
                name="groupId"
                components={components}
                classes={classes}
                // classes={classes}
                // styles={selectStyles}
                options={this.renderSelect(this.props.groups)}
                // components={components}
                value={this.state.groupId}
                onChange={this.handleChangeSelect("groupId")}
                // placeholder="Search a country"
              />
              {/* <Select
      name="groupId"
      id="age-required"
      value={this.state.groupId}
      onChange={this.handleChange}
      className={classes.selectEmpty}
      style={{ width: 200 }}>
      {this.renderSelect(this.state.groups)}
    </Select> */}
              {/* </NoSsr> */}
              {/* <FormHelperTex  t>Required</FormHelperText> */}
              {/* </FormControl> */}
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
              // type="submit"
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
