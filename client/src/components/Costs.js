import React, { Component } from 'react';
// import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {
  DateRangePicker,
  createStaticRanges,
  defaultStaticRanges
} from 'react-date-range';
import { pl } from 'react-date-range/src/locale/index';
import _ from 'lodash';
import currency from 'currency.js';

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
} from 'date-fns';

import Collapse from 'rc-collapse';
import 'rc-collapse/assets/index.css';
// import { pl } from 'date-fns/locale';

import axios from 'axios';
import PropTypes from 'prop-types';
import {
  withStyles,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Send from '@material-ui/icons/Send';
import Edit from '@material-ui/icons/Edit';
import Cancel from '@material-ui/icons/Clear';

import Chip from '@material-ui/core/Chip';
import { emphasize, fade } from '@material-ui/core/styles/colorManipulator';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';

import CostsTable from './CostsTable2Remote';
import PieChart1 from './PieChart1';

var Panel = Collapse.Panel;

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
      label: 'Dziś',
      range: () => ({
        startDate: defineds.startOfToday,
        endDate: defineds.endOfToday
      })
    },
    {
      label: 'Wczoraj',
      range: () => ({
        startDate: defineds.startOfYesterday,
        endDate: defineds.endOfYesterday
      })
    },

    {
      label: 'Bieżący tydzień',
      range: () => ({
        startDate: defineds.startOfWeek,
        endDate: defineds.endOfWeek
      })
    },
    {
      label: 'Poprzedni tydzień',
      range: () => ({
        startDate: defineds.startOfLastWeek,
        endDate: defineds.endOfLastWeek
      })
    },
    {
      label: 'Bieżący miesiąc',
      range: () => ({
        startDate: defineds.startOfMonth,
        endDate: defineds.endOfMonth
      })
    },
    {
      label: 'Poprzedni miesiąc',
      range: () => ({
        startDate: defineds.startOfLastMonth,
        endDate: defineds.endOfLastMonth
      })
    }
  ])
];

const styles = theme => ({
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
    display: 'inline-block',
    flexWrap: 'nowrap'
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
    color: 'white',
    margin: theme.spacing.unit / 2,
    backgroundColor: theme.palette.primary.main
  },
  mojChipRoot: {
    margin: theme.spacing.unit / 2,
    backgroundColor: 'lightgray'
  },
  mojChipClicked: {
    '&:hover, &:focus': {
      margin: theme.spacing.unit / 2,
      backgroundColor: 'lightgray'
    },
    '&:active': {
      color: 'white',
      margin: theme.spacing.unit / 2,
      backgroundColor: theme.palette.primary.main
    }
  },
  mojChip: {
    '&:hover, &:focus': {
      color: 'white',
      margin: theme.spacing.unit / 2,
      backgroundColor: theme.palette.primary.main
    },
    '&:active': {
      margin: theme.spacing.unit / 2,
      backgroundColor: 'lightgray'
    }
  }
});

class Costs extends Component {
  state = {
    id: '',
    nr_dokumentu: '',
    data_wystawienia: '',
    nazwa_pozycji: '',
    kwota_netto: '',
    categoryId: '',
    groupId: '',
    groups: [],
    categories: [],
    costs: [],
    edited: false,
    chmurka_group: [],
    chmurka_category: [],
    rangeselection: {
      // startDate: defineds.startOfMonth,
      // endDate: defineds.endOfMonth,
      startDate: defineds.startOfLastMonth,
      endDate: defineds.endOfLastMonth,
      key: 'rangeselection'
    }
    // chipData: [
    //   { key: 0, label: 'Angular', clicked: true },
    //   { key: 1, label: 'jQuery', clicked: true },
    //   { key: 2, label: 'Polymer', clicked: true },
    //   { key: 3, label: 'React', clicked: true },
    //   { key: 4, label: 'Vue.js', clicked: true }
    // ]
    // name: 'Composed TextField'
  };

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
    // console.log('czyszcze form');
    this.setState({
      id: '',
      nr_dokumentu: '',
      data_wystawienia: '',
      nazwa_pozycji: '',
      kwota_netto: '',
      categoryId: '',
      groupId: '',
      edited: false
    });
  };

  componentWillMount() {
    axios
      .get('/api/table/group')
      .then(result => this.setState({ groups: result.data }));
    // .then(result => this.renderSelect(result.data));
    axios
      .get('/api/table/category')
      .then(result => this.setState({ categories: result.data }));
    this.fetchCosts();
  }

  fetchCosts = () => {
    console.log('fetchuje');
    axios.get('/api/table/costs').then(result => {
      const koszty = result.data;
      const nieUnikalneGrupy = koszty.map(el => {
        return { groupId: el.groupId, group: el.group.name };
      });
      koszty.map(el => Object.assign(el, { clicked: true }));
      this.setState({
        costs: koszty,
        chmurka_group: this.chmurka(koszty, 'group'),
        chmurka_category: this.chmurka(koszty, 'category')
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

  renderSelect = select => {
    // console.log('select');
    // console.log(select);
    // return [1, 2, 3];
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
    // return doWyboru;
  };

  renderCosts = costs => {
    const header = (
      <ListItem button key="header">
        <ListItemText
          style={{ width: 100 }}
          primary="Data wystawienia"
          secondary="Nr dokumentu"
        />
        <ListItemText primary="Nazwa pozycji" style={{ width: 100 }} />
        <ListItemText primary="Grupa" style={{ width: 100 }} />
        <ListItemText primary="Kategoria" style={{ width: 100 }} />
        <ListItemText primary="Kwota netto" style={{ width: 100 }} />
      </ListItem>
    );
    const costsList = costs.map(
      elem =>
        elem.clicked === true ? (
          <ListItem
            button
            key={elem.id}
            onClick={() => this.handleEdit(elem.id)}>
            <ListItemText
              style={{ width: 100 }}
              primary={elem.data_wystawienia}
              secondary={elem.nr_dokumentu}
            />
            <ListItemText primary={elem.nazwa_pozycji} style={{ width: 100 }} />
            <ListItemText primary={elem.group.name} style={{ width: 100 }} />
            <ListItemText primary={elem.category.name} style={{ width: 100 }} />
            <ListItemText
              primary={elem.kwota_netto.replace('.', ',')}
              style={{ width: 100 }}
            />
            {/* <ListItemText
          primary="Single-line item"
          secondary={'Secondary text'}
        /> */}
            <ListItemSecondaryAction>
              <IconButton
                aria-label="Delete"
                onClick={() => this.handleDelete(elem.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ) : null
    );
    // return [header, ...doWyboru];
    return [header, ...costsList];
  };

  handleEdit = id => {
    // console.log(`handleEdit ${id}`);
    axios.get(`/api/cost/${id}`).then(result => {
      // console.log(result.data);
      const {
        nr_dokumentu,
        data_wystawienia,
        nazwa_pozycji,
        kwota_netto,
        categoryId,
        groupId
      } = result.data;
      this.setState({
        id,
        nr_dokumentu,
        kwota_netto,
        nazwa_pozycji,
        data_wystawienia,
        categoryId,
        groupId,
        edited: true
      });
    });
  };

  onEdit = () => {
    // console.log('wysylam do edycji');
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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nr_dokumentu,
        data_wystawienia,
        nazwa_pozycji,
        kwota_netto,
        categoryId,
        groupId
      })
    }).then(() => {
      this.fetchCosts().then(() => {
        this.clearForm();
      });
    });
  };

  handleDelete = id => {
    // console.log('handleDelete');
    // console.log(id);

    const url = `/api/cost/remove/${id}`;
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then(() => {
      this.fetchCosts();
    });
  };

  handleSubmit = e => {
    // console.log('handleSubmit');
    e.preventDefault();
    const {
      nr_dokumentu,
      data_wystawienia,
      nazwa_pozycji,
      kwota_netto,
      categoryId,
      groupId
    } = this.state;
    const url = '/api/cost';

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nr_dokumentu,
        data_wystawienia,
        nazwa_pozycji,
        kwota_netto,
        categoryId,
        groupId
      })
    }).then(() => {
      this.fetchCosts().then(() => {
        this.clearForm();
      });
    });
    // .then(resp => resp.json())
    // .then(data => console.log(data));
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleChipClick = (data, kolumna) => () => {
    // console.log(data);
    let koszty;
    let drugaKolumna;
    let porownanie = [];
    let zmodyfikowaneChip = [];
    switch (kolumna) {
      case 'category':
        drugaKolumna = 'group';
        break;
      case 'group':
        drugaKolumna = 'category';
        break;
      default:
    }

    this.setState(state => {
      const chipData = [...state[`chmurka_${kolumna}`]];
      const chipToClick = chipData.indexOf(data);
      data.clicked = data.clicked ? false : true;
      chipData[chipToClick] = data;
      // chipData.splice(chipToDelete, 1);
      return { [`chmurka_${kolumna}`]: chipData };
    });
    this.setState(state => {
      koszty = [...state.costs];
      koszty.map(el => {
        if (el[`${kolumna}Id`] !== data.id) {
          return el;
        } else {
          return Object.assign(el, { clicked: el.clicked ? false : true });
        }
      });
    });
    this.setState(state => {
      const chipData = [...state[`chmurka_${drugaKolumna}`]];
      const drugaKolumnaFalse = koszty.map(el => {
        if (!el.clicked) {
          return el[drugaKolumna].name;
        } else {
          return null;
        }
      });
      const jestTrue = drugaKolumnaFalse.map(el =>
        koszty.filter(x => x[drugaKolumna].name === el && x.clicked === true)
      );
      const porownanie = drugaKolumnaFalse.map((x, i) => {
        const dlugoscJestTrue = jestTrue[i].length;
        return { name: x, powtarza: dlugoscJestTrue };
      });
      // console.log(porownanie);

      porownanie.map(x => {
        // console.log('jedziemy');
        // console.log(drugaKolumna);
        if (x.name !== null && x.powtarza === 0) {
          chipData.map(y => {
            if (y.name === x.name) {
              // console.log(x.name);
              return zmodyfikowaneChip.push({
                id: y.id,
                name: y.name,
                clicked: false
              });
            } else {
              return zmodyfikowaneChip.push({
                id: y.id,
                name: y.name,
                clicked: true
              });
            }
          });
        } else if (x.name !== null && x.powtarza > 0) {
          zmodyfikowaneChip = chipData.map(y => {
            if (y.name === x.name) {
              console.log(x.name);
              return { id: y.id, name: y.name, clicked: true };
            } else {
              return { id: y.id, name: y.name, clicked: false };
            }
          });
        }
      });
      // console.log(zmodyfikowaneChip);
    });
    // this.setState(state => {
    //   console.log('ustawiani drugiej kolumny');
    //   console.log(koszty);
    //   const chipData = [...state[`chmurka_${drugaKolumna}`]];
    //   let zmodyfikowaneChip;
    //   console.log(chipData);
    //   const drugaKolumnaFalse = koszty.map(el => {
    //     if (!el.clicked) {
    //       return el[drugaKolumna].name;
    //     } else {
    //       return null;
    //     }
    //   });
    //   console.log(drugaKolumnaFalse);
    //   const jestTrue = drugaKolumnaFalse.map(el =>
    //     koszty.filter(x => x[drugaKolumna].name === el && x.clicked === true)
    //   );
    //   const porownanie = drugaKolumnaFalse.map((x, i) => {
    //     const dlugoscJestTrue = jestTrue[i].length;
    //     return { name: x, powtarza: dlugoscJestTrue };
    //   });
    //   console.log('porownanie');
    //   console.log(porownanie);
    //   porownanie.map(x => {
    //     // console.log('jedziemy');
    //     console.log(drugaKolumna);
    //     if (x.name !== null && x.powtarza === 0) {
    //       zmodyfikowaneChip = chipData.map(y => {
    //         if (y.name === x.name) {
    //           return { id: y.id, name: y.name, clicked: false };
    //         } else {
    //           return { id: y.id, name: y.name, clicked: y.clicked };
    //         }
    //       });
    //     } else if (x.name !== null && x.powtarza > 0) {
    //       zmodyfikowaneChip = chipData.map(y => {
    //         if (y.name === x.name) {
    //           return { id: y.id, name: y.name, clicked: true };
    //         } else {
    //           return { id: y.id, name: y.name, clicked: y.clicked };
    //         }
    //       });
    //     }
    //   });
    //   console.log('chipData');
    //   console.log(zmodyfikowaneChip);
    //   return { [`chmurka_${drugaKolumna}`]: zmodyfikowaneChip };
    // });

    // console.log(data);
  };

  // porownajChmury = porownanie => {
  //   porownanie.map(x => {
  //     console.log('jedziemy');
  //     console.log(x);
  //     if (x.name !== null && x.powtarza !== 0) {
  //       this.setState(state => {
  //         // console.log(data);
  //         const chipData = [...state[`chmurka_${drugaKolumna}`]];
  //
  //         const chipToClick = this.state.costs
  //           .map(e => e[drugaKolumna].name)
  //           .indexOf(x.name);
  //         data.clicked = data.clicked ? false : true;
  //         // data.label = 'nowy';
  //         chipData[chipToClick] = data;
  //         // chipData.splice(chipToDelete, 1);
  //         return { chipData };
  //       });
  //     }
  //   });
  // };

  costs = () => {
    // console.log('koszty i data');
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
    // console.log(costsInt);
    return costsInt;
  };

  handleSelect = ranges => {
    // console.log(ranges);

    this.setState({
      ...ranges
    });
  };

  sumOfKey = (data, key) => {
    // let formatted_data;
    // console.log('formated data');
    let dane;
    let sorting;
    switch (key) {
      case 'category':
        dane = _(data)
          .groupBy('category.name')
          .map((v, k) => {
            const suma = _.sumBy(v, 'kwota_netto');
            return {
              name: k,
              value: Math.round(suma),
              value_format: `${currency(Math.round(suma), {
                separator: ' ',
                decimal: ','
              }).format()}`
            };
          })
          .value();

        sorting = dane.sort(function(a, b) {
          return a.value - b.value;
        });

        return sorting.reverse();

        break;
      case 'group':
        dane = _(data)
          .groupBy('group.name')
          .map((v, k) => {
            const suma = _.sumBy(v, 'kwota_netto');
            return {
              name: k,
              value: suma,
              value_format: `${currency(Math.round(suma), {
                separator: ' ',
                decimal: ','
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
    // return formatted_data;
  };

  render() {
    // const formatted_data = _(this.costs())
    //   .groupBy('category.name')
    //   .map((v, k) => ({
    //     name: k,
    //     value: _.sumBy(v, 'kwota_netto')
    //   }))
    //   .value();

    // console.log(this.sumOfKey(this.costs(), 'group'));

    const { classes } = this.props;
    const selectionRange = {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    };

    const { startDate, endDate } = this.state.rangeselection;

    const startDateString = new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }).format(startDate);
    const endDateString = new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    }).format(endDate);

    // console.log(this.state.groups);
    // console.log(this.state.categories);
    // console.log(this.state);
    return (
      <div className={classes.container}>
        <Paper style={{ padding: 20, marginBottom: 20 }}>
          <form
            onSubmit={e => this.handleSubmit(e)}
            // method="POST"
            // action="/api/cost/"
          >
            <FormControl
              className={classes.formControl}
              aria-describedby="name-helper-text">
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
              aria-describedby="name-helper-text">
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
              aria-describedby="name-helper-text">
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
              <InputLabel htmlFor="adornment-password">Kwota netto</InputLabel>
              <Input
                name="kwota_netto"
                id="adornment-password"
                // type={this.state.showPassword ? 'text' : 'password'}
                value={this.state.kwota_netto.replace('.', ',')}
                onChange={this.handleChange}
                style={{ width: 150 }}
                endAdornment={
                  <InputAdornment position="end">PLN</InputAdornment>
                }
              />
            </FormControl>
            <div>
              <FormControl required className={classes.formControl}>
                <InputLabel htmlFor="age-required">Kategoria</InputLabel>
                <Select
                  name="categoryId"
                  // label="asdf"
                  id="age-required"
                  // defaultValue="asdf"
                  // InputLabelProps={{
                  //   shrink: true
                  // }}
                  // value={this.state.age}
                  value={this.state.categoryId}
                  // value="Brak"
                  onChange={this.handleChange}
                  // name="age"
                  // inputProps={{
                  //   id: 'age-required'
                  // }}
                  className={classes.selectEmpty}
                  style={{ width: 200 }}>
                  {this.renderSelect(this.state.categories)}
                </Select>
                {/* <FormHelperTex  t>Required</FormHelperText> */}
              </FormControl>
              <FormControl required className={classes.formControl}>
                <InputLabel htmlFor="age-required">Grupa</InputLabel>
                <Select
                  name="groupId"
                  // label="asdf"
                  id="age-required"
                  // defaultValue="asdf"
                  // InputLabelProps={{
                  //   shrink: true
                  // }}
                  // value={this.state.age}
                  value={this.state.groupId}
                  // value="Brak"
                  onChange={this.handleChange}
                  // name="age"
                  // inputProps={{
                  //   id: 'age-required'
                  // }}
                  className={classes.selectEmpty}
                  style={{ width: 200 }}>
                  {this.renderSelect(this.state.groups)}
                </Select>
                {/* <FormHelperTex  t>Required</FormHelperText> */}
              </FormControl>
            </div>
            {!this.state.edited ? (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={classes.button}>
                Dodaj koszt
                <Send style={{ marginLeft: 10 }} />
              </Button>
            ) : (
              <Button
                // type="submit"
                onClick={() => this.onEdit()}
                variant="contained"
                color="primary"
                className={classes.button}>
                Edytuj koszt
                <Edit style={{ marginLeft: 10 }} />
              </Button>
            )}
            {this.czyWypelniony() && (
              <Button
                variant="contained"
                className={classes.button}
                onClick={() => this.clearForm()}>
                Anuluj
                <Cancel style={{ marginLeft: 10 }} />
              </Button>
            )}
          </form>
        </Paper>
        <Paper
          className={classes.accordionMain}
          // style={{ marginBottom: 10 }}
        >
          <Collapse accordion={true}>
            <Panel
              header={
                <span style={{ fontWeight: '600' }}>
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
                rangeColors={['#303f9f']}
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
              header={<span style={{ fontWeight: '600' }}>Podsumowanie</span>}
              headerClass={classes.accordionClass}
              style={{ color: 'white' }}>
              <div>
                <div style={{ width: '100%' }}>
                  <PieChart1
                    dane={this.sumOfKey(this.costs(), 'category')}
                    label="Kategorie"
                    // group={this.sumOfKey(this.costs(), 'group')}
                  />
                </div>
                <div style={{ width: '100%' }}>
                  <PieChart1
                    // category={this.sumOfKey(this.costs(), 'category')}
                    dane={this.sumOfKey(this.costs(), 'group')}
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
            edit={id => this.handleEdit(id)}
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

export default withStyles(styles)(Costs);
