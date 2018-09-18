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
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
// import NoSsr from '@material-ui/core/NoSsr';
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

import {
  dataToString,
  podzielUnikalnymi,
  dynamicSort
} from "../common/functions";

import { emphasize, fade } from "@material-ui/core/styles/colorManipulator";

import PlanerRaportyForm from "./PlanerRaportyForm";
import PlanerLista from "./PlanerLista";
import ModalWindow from "./ModalWindow";

//poprawic wyszukiwanie po miescie bo dziwnie pokazuje lubartow ze jest w powiecie zaganskim, pewnie ma to zwiazek z tym że niektore wyniki pokazuje jako pierwsze

const Panel = Collapse.Panel;

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
    width: "100%",
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

class PlanerRaporty extends Component {
  state = {
    // numberformat: '',
    aktywnosci: [],
    id: "",
    nr_dokumentu: "",
    data_wystawienia: "",
    nazwa_pozycji: "",
    kwota_netto: "",

    start: "",
    // categoryId: { label: '', value: '' },
    // groupId: { label: '', value: '' },
    categoryId: "",
    groupId: "",
    groups: [],
    categories: [],
    costs: [],
    editedId: "",
    city: "",
    rangeselection: {
      // startDate: defineds.startOfMonth,
      // endDate: defineds.endOfMonth,
      startDate: defineds.startOfMonth,
      endDate: defineds.endOfMonth,
      key: "rangeselection"
    },
    edited: false,
    submitIsDisable: true,
    openModal: false,
    expanded: ""
  };

  componentWillMount() {
    this.fetchRaporty();
  }

  fetchRaporty = range => {
    console.log(range);
    const { startDate, endDate } = this.state.rangeselection;

    const poczatek = range ? range.rangeselection.startDate : startDate;
    const koniec = range ? range.rangeselection.endDate : endDate;
    axios
      .get(
        `/api/table/planerRaporty/${dataToString(poczatek)}_${dataToString(
          koniec
        )}`
      )
      .then(result => {
        console.log(result);
        const podzielone = podzielUnikalnymi(
          result.data,
          "kiedy"
          //this.state.expanded
        );
        this.setState({
          aktywnosci: []
        });
        this.setState({
          // aktywnosci: _.keyBy(result.data, "kiedy")
          aktywnosci: podzielone.sort(dynamicSort("kiedy")).reverse()
        });
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
    console.log(name);
    console.log(value);
    this.setState({
      [name]: value
    });
  };

  handleSelect = ranges => {
    this.setState({
      ...ranges
    });
    this.fetchRaporty(ranges);
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
        <PlanerRaportyForm
          editedId={this.state.editedId}
          expanded={expanded => this.setState({ expanded })}
          fetchuj={() => this.fetchRaporty()}
        />
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
        <Paper className={classes.accordionMain} />
        <Paper>
          <PlanerLista
            aktywnosci={this.state.aktywnosci}
            edit={id => {
              this.setState({ openModal: true });
              this.setState({ editedId: id });
            }}
            //delete={id => console.log(id)}
            fetchuj={() => this.fetchRaporty()}
            expanded={this.state.expanded}
            wyslanoDoPlanu={expanded => this.setState({ expanded })}
            component="planerRaporty"
            // edit={id => console.log(id)}
          />
        </Paper>
        <ModalWindow open={this.state.openModal} close={this.handleClose}>
          <PlanerRaportyForm
            modal
            editedId={this.state.editedId}
            closeModal={() => this.setState({ openModal: false })}
            fetchuj={() => this.fetchRaporty()}
            expanded={expanded => this.setState({ expanded })}
          />
        </ModalWindow>
      </div>
    );
  }
}

PlanerRaporty.propTypes = {
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
  )(PlanerRaporty)
);
