import React, { Component } from "react";
// import { DateRange } from 'react-date-range';
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import {
  DateRangePicker,
  createStaticRanges,
  defaultStaticRanges
} from "react-date-range";
import { pl } from "react-date-range/src/locale/index";
import _ from "lodash";
import currency from "currency.js";
import { connect } from "react-redux";
import {
  addDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  addMonths,
  startOfWeek,
  endOfWeek,
  isSameDay,
  differenceInCalendarDays
} from "date-fns";

import Collapse from "rc-collapse";
import "rc-collapse/assets/index.css";
// import { pl } from 'date-fns/locale';
// import CurrencyInput from 'react-currency-input';
import NumberFormat from "react-number-format";
import InputMask from "react-input-mask";

import axios from "axios";
import PropTypes from "prop-types";
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
// import NoSsr from '@material-ui/core/NoSsr';
import Modal from "@material-ui/core/Modal";
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

import Chip from "@material-ui/core/Chip";
import { emphasize, fade } from "@material-ui/core/styles/colorManipulator";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import WorkIcon from "@material-ui/icons/Work";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import IconButton from "@material-ui/core/IconButton";
import FolderIcon from "@material-ui/icons/Folder";
import DeleteIcon from "@material-ui/icons/Delete";

import CostsTable from "./CostsTable2Remote";
import PieChart1 from "./PieChart1";

import CostsForm from "./CostsForm";

var Panel = Collapse.Panel;

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

const defineds = {
  startOfWeek: startOfWeek(new Date()),
  endOfWeek: endOfWeek(new Date()),
  startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
  endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
  startOfToday: startOfDay(new Date()),
  endOfToday: endOfDay(new Date()),
  startOfYesterday: startOfDay(addDays(new Date(), -1)),
  endOfYesterday: endOfDay(addDays(new Date(), -1)),
  startOfMonth: startOfMonth(new Date()),
  endOfMonth: endOfMonth(new Date()),
  startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
  endOfLastMonth: endOfMonth(addMonths(new Date(), -1))
};

const staticRanges = [
  // ...defaultStaticRanges,
  ...createStaticRanges([
    {
      label: "Dziś",
      range: () => ({
        startDate: defineds.startOfToday,
        endDate: defineds.endOfToday
      })
    },
    {
      label: "Wczoraj",
      range: () => ({
        startDate: defineds.startOfYesterday,
        endDate: defineds.endOfYesterday
      })
    },

    {
      label: "Bieżący tydzień",
      range: () => ({
        startDate: defineds.startOfWeek,
        endDate: defineds.endOfWeek
      })
    },
    {
      label: "Poprzedni tydzień",
      range: () => ({
        startDate: defineds.startOfLastWeek,
        endDate: defineds.endOfLastWeek
      })
    },
    {
      label: "Bieżący miesiąc",
      range: () => ({
        startDate: defineds.startOfMonth,
        endDate: defineds.endOfMonth
      })
    },
    {
      label: "Poprzedni miesiąc",
      range: () => ({
        startDate: defineds.startOfLastMonth,
        endDate: defineds.endOfLastMonth
      })
    }
  ])
];

const styles = theme => ({
  paper: {
    position: "absolute",
    //width: theme.spacing.unit * 50,
    //backgroundColor: theme.palette.background.paper,
    //boxShadow: theme.shadows[5],
    boxShadow: "0 0 150px #111"
    //padding: theme.spacing.unit * 4
  },
  input: {
    display: "flex",
    padding: 0
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  },
  accordionClass: {
    backgroundColor: fade(theme.palette.primary.main, 0.15)
    // borderColor: theme.palette.primary.main,
    // color: 'white'
  },
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
    edited: false,
    chmurka_group: [],
    chmurka_category: [],
    rangeselection: {
      // startDate: defineds.startOfMonth,
      // endDate: defineds.endOfMonth,
      startDate: defineds.startOfLastMonth,
      endDate: defineds.endOfLastMonth,
      key: "rangeselection"
    },
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
    axios
      .get("/api/table/group")
      .then(result => this.setState({ groups: result.data }));
    // .then(result => this.renderSelect(result.data));
    axios
      .get("/api/table/category")
      .then(result => this.setState({ categories: result.data }));
    this.fetchCosts();
  }

  fetchCosts = () => {
    console.log("fetchCosts()");
    axios.get("/api/table/costs").then(result => {
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
    });
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

  // onEdit = () => {
  //   const {
  //     id,
  //     nr_dokumentu,
  //     data_wystawienia,
  //     nazwa_pozycji,
  //     kwota_netto,
  //     categoryId,
  //     groupId
  //   } = this.state;
  //   const url = `/api/cost/edit/${id}`;
  //
  //   fetch(url, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     credentials: "same-origin",
  //     body: JSON.stringify({
  //       nr_dokumentu,
  //       data_wystawienia,
  //       nazwa_pozycji,
  //       kwota_netto,
  //       categoryId,
  //       groupId
  //     })
  //   })
  //     .then(() => {
  //       this.fetchCosts();
  //     })
  //     .then(() => {
  //       this.clearForm();
  //     });
  // };

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
    console.log(name);
    console.log(value);
    this.setState({
      [name]: value
    });
  };

  handleOpen = () => {
    this.setState({ openModal: true });
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

  getModalStyle = () => {
    return {
      top: `${50}%`,
      left: `${50}%`,
      transform: `translate(-${50}%, -${50}%)`
    };
  };

  render() {
    const { classes } = this.props;
    const selectionRange = {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection"
    };

    const { startDate, endDate } = this.state.rangeselection;

    const startDateString = new Intl.DateTimeFormat("pl-PL", {
      year: "numeric",
      month: "long",
      day: "2-digit"
    }).format(startDate);
    const endDateString = new Intl.DateTimeFormat("pl-PL", {
      year: "numeric",
      month: "long",
      day: "2-digit"
    }).format(endDate);

    return (
      <div className={classes.container}>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.openModal}
          onClose={this.handleClose}
        >
          <div style={this.getModalStyle()} className={classes.paper}>
            <CostsForm
              fetchuj={() => this.fetchCosts()}
              groups={this.state.groups}
              categories={this.state.categories}
              changeRange={data => this.changeRange(data)}
              editedId={this.state.editedId}
              modal
              closeModal={() => this.setState({ openModal: false })}
              // clearForm={() => this.setState({ editedId: "" })}
            />
          </div>
        </Modal>

        <div className="costsFormContainer" style={{ marginBottom: 20 }}>
          <CostsForm
            fetchuj={() => this.fetchCosts()}
            groups={this.state.groups}
            categories={this.state.categories}
            changeRange={data => this.changeRange(data)}
            editedId={this.state.editedId}

            // clearForm={() => this.setState({ editedId: "" })}
          />
        </div>

        <Paper
          className={classes.accordionMain}
          // style={{ marginBottom: 10 }}
        >
          <Collapse accordion={true}>
            <Panel
              header={
                <span style={{ fontWeight: "600" }}>
                  Zakres: {startDateString} - {endDateString}
                </span>
              }
              headerClass={classes.accordionClass}
              // style={{ color: 'white' }}
            >
              <DateRangePicker
                // initialFocusedRange={}
                locale={pl}
                // ranges={}
                inputRanges={[]}
                staticRanges={staticRanges}
                showSelectionPreview={true}
                ranges={[this.state.rangeselection]}
                onChange={this.handleSelect}
                moveRangeOnFirstSelection={false}
                months={2}
                direction="horizontal"
                rangeColors={["#303f9f"]}
              />
            </Panel>
          </Collapse>
        </Paper>
        <Paper
          className={classes.accordionMain}
          // style={{
          //   marginBottom: 10,
          //   border: '1px solid #000',
          //   color: 'white'
          // }}
        >
          <Collapse
            accordion={true}
            // activeKey="0" defaultActiveKey="0"
          >
            <Panel
              // key="0"
              header={<span style={{ fontWeight: "600" }}>Podsumowanie</span>}
              headerClass={classes.accordionClass}
              style={{ color: "white" }}
            >
              <div>
                <div style={{ width: "100%" }}>
                  <PieChart1
                    dane={this.sumOfKey(this.costs(), "category")}
                    label="Kategorie"
                    // group={this.sumOfKey(this.costs(), 'group')}
                  />
                </div>
                <div style={{ width: "100%" }}>
                  <PieChart1
                    // category={this.sumOfKey(this.costs(), 'category')}
                    dane={this.sumOfKey(this.costs(), "group")}
                    label="Grupy"
                  />
                </div>
              </div>
            </Panel>
          </Collapse>
        </Paper>
        <Paper>
          <CostsTable
            costs={this.costs()}
            fetch={() => this.fetchCosts()}
            edit={id => {
              this.setState({ openModal: true });
              this.setState({ editedId: id });
            }}
            // range={this.state.rangeselection}
          />
        </Paper>
        {/* <div>
          <Paper>
            <List component="nav" dense={true}>
              {this.renderCosts(this.state.costs)}
            </List>
          </Paper>
        </div> */}
      </div>
    );
  }
}

Costs.propTypes = {
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
  )(Costs)
);

// export default withStyles(styles)(Costs);
