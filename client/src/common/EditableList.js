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
import TableSortLabel from "@material-ui/core/TableSortLabel";
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
import TablePagination from "@material-ui/core/TablePagination";
import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import CommentIcon from "@material-ui/icons/Comment";
import * as actions from "../actions";
import { dataToString, defineds, dynamicSort, timeDiff } from "./functions";
import MainFrameHOC from "./MainFrameHOC";
import ButtonMy from "./ButtonMy";
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
import Confirmation from "../components/Confirmation";
// import SelectOrAdd from "../common/inputs/SelectOrAdd";
import InputComponent from "./inputs/InputComponent";
import SearchField from "./inputs/SearchField";

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
    maxWidth: "100%",
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
  },
  highlightRow: {
    backgroundColor: theme.palette.secondary.light,
    height: "100%",
    width: 5,
    display: "block",
    position: "absolute"
  }
});

// const channelsFetchUrl = "/api/table/channels";
// let itemsFetchUrlBase = `/api/channels/items/`;

class EditableList extends Component {
  state = {
    channel: "",
    addedId: 0,
    confirmation: false,
    list: [],
    listUnfiltered: [],
    checked: [],
    confirmationAction: null,
    editedId: 0,
    // changing: "",
    // clickedRow: 0,
    rowsPerPage: 6,
    page: 0,
    adding: {},
    editedFields: {}
  };

  componentWillMount = () => {
    this.urlToState(this.props.fetchUrl);
  };

  componentWillReceiveProps = nextProps => {
    const { fetchUrl } = this.props;
    const { fetchUrl: fetchUrlNext } = nextProps;
    if (fetchUrl !== fetchUrlNext) {
      this.urlToState(fetchUrlNext);
    }
  };

  urlToState = async url => {
    const list = await this.fetch(url);
    this.setState({
      list,
      listUnfiltered: list,
      isLoading: false,
      action: this.handlePost
    });
  };

  fetch = async url => {
    const list = await axios.get(url);
    return list.data;
    // return list.data.sort(dynamicSort("name"));
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
    const { adding } = this.state;
    let postUrl;
    let getUrl;
    let body;
    postUrl = this.props.postUrl;
    getUrl = this.props.fetchUrl;
    body = JSON.stringify(adding);
    const id = await this.handleAddChannel(e, postUrl, body, getUrl);
    // console.log("handlepost", id);
    const list = await this.fetch(getUrl);
    this.setState({
      list,
      listUnfiltered: list,
      isLoading: false,
      addedId: { id },
      adding: {}
    });
  };

  // handleChange = (dbField, value) => {
  //   console.log("handleChange", dbField, value);
  //   this.setState({ changing: { [dbField]: value } });
  //   // this.setState({ [name]: value });
  // };

  handleChange = (dbField, value, inState) => {
    console.log("handleChange", dbField, value, inState);
    const { adding, editedFields } = this.state;

    // const value = e.target.value;
    this.setState({
      adding: Object.assign(this.state[inState], { [dbField]: value })
    });
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

  handleRowClick = clickedRow => {
    // this.setState({ clickedRow });
    this.props.clickOnRow(clickedRow);
  };

  remove = async () => {
    const result = await axios.post(
      `/api/channel/remove/${this.state.checked}`
    );
    this.handleCloseConfirmation();
    this.setState({ checked: [] });
    const list = await this.fetch(this.props.fetchUrl);
    this.setState({
      list,
      listUnfiltered: list,
      isLoading: false,
      action: this.handlePost
    });
    // return;
  };

  handleClickForEdit = (item, id) => {
    const { addFields } = this.props;
    const { listUnfiltered } = this.state;
    const idInList = listUnfiltered.map(e => e.id).indexOf(id);
    let editedFields = {};
    addFields.map(field => {
      Object.assign(editedFields, {
        [field.dbField]: listUnfiltered[idInList][field.dbField]
      });
    });
    console.log("handleClickForEdit", item, id, idInList, editedFields);
    this.setState({ editedFields, editedId: item.id });
  };

  handleSelectAllClick = () => {
    console.log("checked");
    if (this.state.checked.length === 0) {
      this.setState(state => ({
        checked: this.state.list.map(n => n.id)
      }));
      return;
    } else {
      this.setState({ checked: [] });
    }
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleEdit = async e => {
    const { changing, editedId } = this.state;

    let postUrl;
    let getUrl;
    let body;
    postUrl = `/api/channel/edit/id/${editedId}`;
    getUrl = this.props.fetchUrl;
    body = JSON.stringify({
      name: `${changing.charAt(0).toUpperCase()}${changing.slice(1)}`
    });
    await this.handleEditChannel(e, postUrl, body, getUrl);
    // console.log("handlepost", id);
    const list = await this.fetch(this.props.fetchUrl);
    this.handleClickForEdit(0);
    this.setState({
      list,
      listUnfiltered: list,
      isLoading: false,
      // editedId: 0,
      changing: ""
    });

    // const result = await axios.get(`/api/id/channel/${editedId}`);
    // const list = await this.fetch(channelsFetchUrl);
    // this.setState({ list, isLoading: false, action: this.handlePost });
  };

  handleSearch = searched => {
    this.setState({ list: searched });
  };

  render() {
    const {
      // channel,
      confirmation,
      list,
      checked,
      confirmationAction,
      editedId,
      // changing,
      rowsPerPage,
      page,
      listUnfiltered,
      adding,
      editedFields
    } = this.state;
    const {
      classes,
      clickedRow,
      addLabel,
      listLabel,
      addFields,
      disabled
    } = this.props;
    return (
      <React.Fragment>
        <Confirmation
          open={confirmation}
          close={this.handleCloseConfirmation}
          action={confirmationAction}
          komunikat={`Czy na pewno?`}
        >
          {/* <div>{`${labelOdmieniony} ${whatToAdd}?`}</div>
          {field2show && <div>{`${field2label} ${input2}?`}</div>} */}
        </Confirmation>
        <AddToDB
          disabled={disabled}
          action={this.handleConfirmPosting}
          change={this.handleChange}
          value={adding}
          addLabel={addLabel}
          addFields={addFields}
        />
        {list && (
          <ListMy
            value={adding}
            edit={this.handleClickForEdit}
            edited={editedId}
            list={list}
            listUnfiltered={listUnfiltered}
            classes={classes}
            toggle={this.handleToggle}
            checked={checked}
            remove={this.handleDelete}
            change={this.handleChange}
            confirmEdit={this.handleEdit}
            click={this.handleRowClick}
            clickedRow={clickedRow}
            onSelectAllClick={this.handleSelectAllClick}
            rowsPerPage={rowsPerPage}
            page={page}
            search={this.handleSearch}
            listLabel={listLabel}
            addFields={addFields}
            editedFields={editedFields}
          />
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          // count={data.length}
          count={list.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Poprzednia"
          }}
          nextIconButtonProps={{
            "aria-label": "Następna"
          }}
          labelRowsPerPage="Rzędów"
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
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
  value,
  // changing,
  confirmEdit,
  click,
  clickedRow,
  onSelectAllClick,
  rowsPerPage,
  page,
  search,
  listUnfiltered,
  listLabel,
  addFields,
  editedFields
}) => {
  return (
    <List className={classes.root}>
      <EnhancedTableToolbar
        classes={classes}
        checked={checked}
        remove={remove}
        list={list}
        onSelectAllClick={onSelectAllClick}
        search={search}
        listUnfiltered={listUnfiltered}
        listLabel={listLabel}
      />
      <div
      // style={{
      //   display: "grid",
      //   gridGap: "1rem",
      //   gridTemplateColumns: "1fr 1fr 1fr"
      // }}
      >
        {list
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map(item => (
            <ListItem
              key={item.id}
              role={undefined}
              dense
              button
              onClick={() => click(item.id)}
              style={{ height: 49 }}
            >
              {clickedRow === item.id && (
                <div className={classes.highlightRow} />
              )}
              <Checkbox
                onClick={toggle(item.id)}
                checked={checked.indexOf(item.id) !== -1}
                tabIndex={-1}
                disableRipple
              />
              <div>
                <EditableField
                  fields={addFields}
                  edited={edited}
                  item={item}
                  change={change}
                  value={editedFields}
                />

                {edited !== item.id ? (
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label="Comments"
                      onClick={() => edit(item, item.id)}
                      // onClick={() => edit(item.name, item.id)}
                    >
                      <EditIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                ) : (
                  <div>
                    <ListItemSecondaryAction
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr "
                      }}
                    >
                      {validateEdit(value)}
                      {value.length > 0 && (
                        <IconButton aria-label="Comments" onClick={confirmEdit}>
                          <DoneIcon />
                        </IconButton>
                      )}
                      <IconButton
                        aria-label="Comments"
                        onClick={() => edit({})}
                      >
                        <CloseIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </div>
                )}
              </div>
            </ListItem>
          ))}
      </div>
    </List>
  );
};

const validateEdit = object => {
  let validates = [];
  for (var property in object) {
    console.log("validateEdit", property);
    if (object.hasOwnProperty(property)) {
      validates.push(object.property !== "");
    }
  }
  console.log("validates", validates);
};

const EditableField = ({ fields, edited, item, value, change }) => {
  return fields.map((field, i) => {
    return edited === item.id ? (
      <Input
        key={i}
        disableUnderline
        autoFocus={item.id === edited}
        type="text"
        value={value[field.dbField]}
        onChange={e => change(field.dbField, e.target.value, "editedFields")}
      />
    ) : (
      <ListItemText primary={item.name} key={i} />
    );
  });
};

const AddToDB = ({
  change,
  value,
  handleAdd,
  action,
  addLabel,
  addFields,
  disabled
}) => {
  console.log("value, Add", value);
  return (
    <div
      style={{
        display: "grid",
        gridGap: "1rem",
        gridTemplateColumns: `repeat(${addFields.length}, 1fr) 70px`
      }}
    >
      <InputComponent
        disabled={disabled}
        name="channel"
        label={addLabel}
        type="text"
        edytuj={value =>
          change(
            addFields[0].dbField,
            `${value.charAt(0).toUpperCase()}${value.slice(1)}`,
            "adding"
          )
        }
        value={value[addFields[0].dbField] || ""}
        // disabled={field2disabled}
      />
      <AdditionalAddFields
        fields={addFields}
        change={change}
        value={value}
        disabled={disabled}
      />
      <ButtonMy
        onClick={action}
        variant="contained"
        color="primary"
        disabled={disabled}
      >
        <Add />
      </ButtonMy>
    </div>
  );
};

const AdditionalAddFields = ({ fields, change, value, disabled }) => {
  return fields.slice(1).map((field, i) => (
    <InputComponent
      disabled={disabled}
      key={i}
      name="channel"
      label={field.label}
      type="text"
      edytuj={value => change(field.dbField, value, "adding")}
      value={value[field.dbField] || ""}
      // disabled={field2disabled}
    />
  ));
};

let EnhancedTableToolbar = props => {
  const {
    classes,
    deleteRows,
    checked,
    remove,
    list,
    onSelectAllClick,
    search,
    listUnfiltered,
    listLabel
    // edited
  } = props;

  return (
    <Toolbar
      className={classNames(classes.toolbar, {
        [classes.highlight]: checked.length > 0
      })}
    >
      <Checkbox
        indeterminate={checked.length > 0 && checked.length < list.length}
        checked={list.length !== 0 && checked.length === list.length}
        onChange={onSelectAllClick}
      />
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
            {listLabel}
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      {/* <TableSortLabel
      // active={orderBy === row.id}
      // direction={order}
      // onClick={this.createSortHandler(row.id)}
      >
        Sortuj
      </TableSortLabel> */}
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {checked.length > 0 ? (
          <Tooltip title="Usuń">
            <IconButton aria-label="Delete" onClick={remove}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <SearchField
            data={listUnfiltered}
            columns={["name"]}
            search={search}
          />
        )
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
)(EditableList);
