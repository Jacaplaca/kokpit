import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
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

const styles = theme => ({
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
    edited: false
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
    console.log('czyszcze form');
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
    axios
      .get('/api/table/costs')
      .then(result => this.setState({ costs: result.data }));
  }

  renderSelect = select => {
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
    const costsList = costs.map(elem => (
      <ListItem button key={elem.id} onClick={() => this.handleEdit(elem.id)}>
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
    ));
    // return [header, ...doWyboru];
    return [header, ...costsList];
  };

  handleEdit = id => {
    console.log(`handleEdit ${id}`);
    axios.get(`/api/cost/${id}`).then(result => {
      console.log(result.data);
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
    console.log('wysylam do edycji');
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
      axios
        .get('/api/table/costs')
        .then(result => this.setState({ costs: result.data }))
        .then(() => {
          this.clearForm();
        });
    });
  };

  handleDelete = id => {
    console.log('handleDelete');
    // console.log(id);

    const url = `/api/cost/remove/${id}`;
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then(() => {
      axios
        .get('/api/table/costs')
        .then(result => this.setState({ costs: result.data }));
    });
  };

  handleSubmit = e => {
    console.log('handleSubmit');
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
      axios
        .get('/api/table/costs')
        .then(result => this.setState({ costs: result.data }))
        .then(() => {
          this.clearForm();
        });
    });
    // .then(resp => resp.json())
    // .then(data => console.log(data));
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes } = this.props;
    // console.log(this.state.groups);
    // console.log(this.state.categories);
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

        <div>
          <Paper>
            <List component="nav" dense={true}>
              {this.renderCosts(this.state.costs)}
            </List>
          </Paper>
        </div>
      </div>
    );
  }
}

Costs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Costs);
