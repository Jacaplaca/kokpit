import React, { Component } from "react";
import { Formik } from "formik";

import { connect } from "react-redux";
import { compose } from "redux";
import { startOfMonth, endOfMonth } from "date-fns";
import axios from "axios";
import PropTypes from "prop-types";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Add from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import classNames from "classnames";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CommentIcon from "@material-ui/icons/Comment";
import * as actions from "../../actions";
import {
  dataToString,
  defineds,
  dynamicSort,
  timeDiff
} from "../../common/functions";
import MainFrameHOC from "../../common/MainFrameHOC";
import ButtonMy from "../../common/ButtonMy";
//import SiteHeader from "../common/SiteHeader";
// import CostsTable from "./CostsTable2Remote";
// import ModalWindow from "./ModalWindow";
// import CostsForm from "./CostsForm";
// import DateRangePickerMy from "../common/DateRangePickerMy";
// import CostsPodsumowanie from "./CostsPodsumowanie";
// import SerwisForm from "./SerwisForm";
// import TransactionList from "./TransactionList";
// import AddCircle from "@material-ui/icons/AddCircle";
// // import Channels from "../common/inputs/SelectFromDBForAdding";
// import ButtonIconCircle from "../common/ButtonIconCircle";
import Confirmation from "../../components/Confirmation";
// import SelectOrAdd from "../common/inputs/SelectOrAdd";
import InputComponent from "../../common/inputs/InputComponent";

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
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },

  toolbar: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
});

const channelsFetchUrl = "/api/table/channels";
let itemsFetchUrlBase = `/api/channels/items/`;

class Channels extends Component {
  state = {
    channel: "",
    addedId: 0,
    confirmation: false,
    list: [],
    checked: [],
    confirmationAction: null,
    editedId: 0,
    changing: ""
  };

  componentWillMount = async () => {
    const list = await this.fetch(channelsFetchUrl);
    this.setState({ list, isLoading: false, action: this.handlePost });
  };

  fetch = async url => {
    const list = await axios.get(url);
    return list.data.sort(dynamicSort("name"));
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  };

  handleAddChannel = async (e, postUrl, body, getUrl) => {
    console.log("handleAddChannel()");

    e.preventDefault();
    const { whatToAdd } = this.state;
    console.log("handleAddChannel()", whatToAdd, postUrl);
    const resp = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body
    });
    this.handleCloseConfirmation();

    const response = await resp.json();
    return response.id;
    // this.setState({ insertedId: response.id });
  };

  handleEditChannel = async (e, postUrl, body, getUrl) => {
    e.preventDefault();
    const resp = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body
    });
    // this.handleCloseConfirmation();

    // return await resp.json();
    // this.setState({ insertedId: response.id });
  };

  handlePost = async e => {
    const { channel } = this.state;
    let postUrl;
    let getUrl;
    let body;
    postUrl = "/api/sales_channel/";
    getUrl = channelsFetchUrl;
    body = JSON.stringify({
      name: `${channel.charAt(0).toUpperCase()}${channel.slice(1)}`
    });
    const id = await this.handleAddChannel(e, postUrl, body, getUrl);
    // console.log("handlepost", id);
    const list = await this.fetch(channelsFetchUrl);
    this.setState({ list, isLoading: false, addedId: { id }, channel: "" });
  };

  handleChange = (name, value, id) => {
    id || this.setState({ [name]: value });
    id && this.setState({ changing: value });
    // this.setState({ [name]: value });
  };

  handleOpenConfirmation = () => {
    console.log("handleOpenConfirmation");
    this.setState({ confirmation: true }, () =>
      console.log("thisstate", this.state.confirmation)
    );
  };

  handleCloseConfirmation = () => {
    this.setState({ confirmation: false });
  };

  handleConfirmPosting = () => {
    this.handleOpenConfirmation();
    this.setState({ confirmationAction: this.handlePost });
  };

  handleDelete = () => {
    this.handleOpenConfirmation();
    this.setState({ confirmationAction: this.remove });
  };

  remove = async () => {
    const result = await axios.post(
      `/api/channel/remove/${this.state.checked}`
    );
    this.handleCloseConfirmation();
    this.setState({ checked: [] });
    const list = await this.fetch(channelsFetchUrl);
    this.setState({ list, isLoading: false, action: this.handlePost });
    // return;
  };

  handleClickForEdit = (name, id) => {
    console.log("handleClickForEdit", id);
    this.setState({ changing: name, editedId: id });
  };

  handleEdit = async e => {
    const { changing, editedId } = this.state;

    let postUrl;
    let getUrl;
    let body;
    postUrl = `/api/channel/edit/id/${editedId}`;
    getUrl = channelsFetchUrl;
    body = JSON.stringify({
      name: `${changing.charAt(0).toUpperCase()}${changing.slice(1)}`
    });
    await this.handleEditChannel(e, postUrl, body, getUrl);
    // console.log("handlepost", id);
    const list = await this.fetch(channelsFetchUrl);
    this.handleClickForEdit(0);
    this.setState({
      list,
      isLoading: false,
      // editedId: 0,
      changing: ""
    });

    // const result = await axios.get(`/api/id/channel/${editedId}`);
    // const list = await this.fetch(channelsFetchUrl);
    // this.setState({ list, isLoading: false, action: this.handlePost });
  };

  render() {
    const {
      channel,
      confirmation,
      list,
      checked,
      confirmationAction,
      editedId,
      changing
    } = this.state;
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Confirmation
          open={confirmation}
          close={this.handleCloseConfirmation}
          action={confirmationAction}
          komunikat={`Czy jesteś pewny że chcesz dodać`}
        >
          {/* <div>{`${labelOdmieniony} ${whatToAdd}?`}</div>
          {field2show && <div>{`${field2label} ${input2}?`}</div>} */}
        </Confirmation>
        <AddToDB
          action={this.handleConfirmPosting}
          change={this.handleChange}
          value={channel}
        />
        {list && list.length > 0 ? (
          <ListMy
            changing={changing}
            edit={this.handleClickForEdit}
            edited={editedId}
            list={list}
            classes={classes}
            toggle={this.handleToggle}
            checked={checked}
            remove={this.handleDelete}
            change={this.handleChange}
            confirmEdit={this.handleEdit}
          />
        ) : (
          <div>Brak dostępnych kanałów sprzedaży!</div>
        )}
      </React.Fragment>
    );
  }
}

const ListMy = ({
  list,
  classes,
  toggle,
  checked,
  remove,
  edit,
  edited,
  change,
  changing,
  confirmEdit
}) => {
  return (
    <List className={classes.root}>
      <EnhancedTableToolbar
        classes={classes}
        checked={checked}
        remove={remove}
      />
      {list.map(item => (
        <ListItem
          key={item.id}
          role={undefined}
          dense
          button
          // onClick={this.handleToggle(value)}
        >
          <Checkbox
            onClick={toggle(item.id)}
            checked={checked.indexOf(item.id) !== -1}
            tabIndex={-1}
            disableRipple
          />
          <div>
            {edited === item.id ? (
              <InputComponent
                name="channel"
                label="Kanał sprzedaży"
                type="text"
                edytuj={value => change("channel", value, item.id)}
                value={changing}
                // disabled={field2disabled}
              />
            ) : (
              <ListItemText primary={item.name} />
            )}

            {edited !== item.id ? (
              <ListItemSecondaryAction>
                <IconButton
                  aria-label="Comments"
                  onClick={() => edit(item.name, item.id)}
                >
                  <EditIcon />
                </IconButton>
              </ListItemSecondaryAction>
            ) : (
              <div
              // style={{
              //   display: "grid",
              //   gridGap: "1rem",
              //   gridTemplateColumns: "20px 20px "
              // }}
              >
                <ListItemSecondaryAction
                  style={{
                    // width: 50,
                    display: "grid",
                    // gridGap: "1rem",
                    gridTemplateColumns: "1fr 1fr "
                  }}
                >
                  {changing.length > 0 && (
                    <IconButton aria-label="Comments" onClick={confirmEdit}>
                      <DoneIcon />
                    </IconButton>
                  )}
                  <IconButton aria-label="Comments" onClick={() => edit(0)}>
                    <CloseIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </div>
            )}
          </div>
        </ListItem>
      ))}
    </List>
  );
};

const AddToDB = props => {
  const { change, value, handleAdd, action } = props;
  return (
    <div
      style={{
        display: "grid",
        gridGap: "1rem",
        gridTemplateColumns: "1fr 125px "
      }}
    >
      <InputComponent
        name="channel"
        label="Kanał sprzedaży"
        type="text"
        edytuj={value => change("channel", value)}
        value={value}
        // disabled={field2disabled}
      />
      <ButtonMy
        // type="submit"
        onClick={action}
        variant="contained"
        color="primary"
        // disabled={subDisable}
      >
        asdf
        <Add style={{ marginLeft: 10 }} />
      </ButtonMy>
    </div>
  );
};

let EnhancedTableToolbar = props => {
  const { numSelected, classes, deleteRows, checked, remove } = props;

  return (
    <Toolbar
      className={classNames(classes.toolbar, {
        [classes.highlight]: checked.length > 0
      })}
    >
      <div className={classes.title}>
        {checked.length > 0 ? (
          <Typography
            color="inherit"
            // variant="subtitle1"
          >
            {checked.length} wybrano
          </Typography>
        ) : (
          <Typography
            // variant="h6"
            id="tableTitle"
          >
            Lista transakcji
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {checked.length > 0 ? (
          <Tooltip title="Usuń">
            <IconButton aria-label="Delete" onClick={remove}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : null
        // <Tooltip title="Filter list">
        //   <IconButton aria-label="Filter list">
        //     <FilterListIcon />
        //   </IconButton>
        // </Tooltip>
        }
      </div>
    </Toolbar>
  );
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    actions
  ),
  MainFrameHOC
)(Channels);
