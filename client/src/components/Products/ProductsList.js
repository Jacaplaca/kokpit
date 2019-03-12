import React, { Component } from "react";

import classNames from "classnames";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import { lighten } from "@material-ui/core/styles/colorManipulator";

import ButtonIconCircle from "../../common/ButtonIconCircle";
import EditIcon from "@material-ui/icons/Edit";

import { connect } from "react-redux";
import { compose } from "redux";

import Confirmation from "../Confirmation";
import * as actions from "../../actions";
import {
  formatNumber,
  shorting,
  simpleSortUpDown
} from "../../common/functions";
import MainFrameHOC from "../../common/MainFrameHOC";
import SearchField from "../../common/inputs/SearchField";

let counter = 0;
function createData(name, calories, fat, carbs, protein) {
  counter += 1;
  return { id: counter, name, calories, fat, carbs, protein };
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// function stableSort(array, cmp) {
//   // console.log("stableSort", array, cmp);
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = cmp(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map(el => el[0]);
// }
//
// function getSorting(order, orderBy) {
//   return order === "desc"
//     ? (a, b) => desc(a, b, orderBy)
//     : (a, b) => -desc(a, b, orderBy);
// }

const rows = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Towar/Usługa"
  },
  {
    id: "unit",
    numeric: false,
    disablePadding: true,
    label: "Jednostka"
  }
];

class EnhancedTableHead extends React.Component {
  state = {
    headCols: []
  };

  componentWillMount() {
    this.setState({ headCols: this.createHead(this.props.headCols) });
  }

  componentWillReceiveProps(nextProps) {
    const { headCols } = nextProps;
    if (this.props.headCols !== headCols && headCols.length > 0) {
      this.setState({ headCols: this.createHead(headCols) });
    }
  }

  createHead = list => {
    return list.map(x =>
      Object.assign(x, {
        numeric: false,
        disablePadding: true,
        label: x.name
      })
    );
  };

  createSortHandler = (property, field) => event => {
    this.props.onRequestSort(event, property, field);
  };

  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount
    } = this.props;

    const { headCols } = this.state;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? "right" : "left"}
                padding={row.disablePadding ? "none" : "default"}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sortuj"
                  placement={row.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this
          )}
          {headCols.map(
            channel => (
              <TableCell
                key={channel.id}
                align="center"
                padding={channel.disablePadding ? "none" : "default"}
                sortDirection={orderBy === channel.id ? order : false}
                style={{ textAlign: "center" }}
              >
                {/* {channel.label} */}
                <Tooltip
                  title="Sortuj"
                  placement={channel.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === channel.id}
                    direction={order}
                    onClick={this.createSortHandler(channel.id)}
                  >
                    {channel.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const toolbarStyles = theme => ({
  root: {
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

let EnhancedTableToolbar = props => {
  const { numSelected, classes, deleteRows, data, search } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography
            color="inherit"
            // variant="subtitle1"
          >
            {numSelected} wybrano
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
        {numSelected > 0 ? (
          <Tooltip title="Usuń">
            <IconButton aria-label="Delete" onClick={deleteRows}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <SearchField data={data} columns={["name"]} search={search} />
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

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

class EnhancedTable extends React.Component {
  state = {
    order: "desc",
    orderBy: "order",
    selected: [],
    page: 0,
    rowsPerPage: 25,
    open: false,
    list: [],
    ordering: [],
    listUnfiltered: []
  };

  componentWillMount() {
    const list = this.makeOrder(this.props.transactions);
    this.setState({ list, listUnfiltered: list });
  }

  componentWillReceiveProps(nextProps) {
    // console.log("componentWillReceiveProps()");
    const { transactions } = this.props;
    const { transactions: transNext } = nextProps;
    if (transactions !== transNext) {
      // console.log("componentWillReceiveProps(), change");
      const list = this.loadOrder(transNext);
      this.setState({ list, listUnfiltered: list, orderBy: "order" });
    }
  }

  makeOrder = list => {
    return list.map((el, i) => Object.assign(el, { order: i }));
  };

  loadOrder = list => {
    const { ordering, order } = this.state;
    const ord = order === "asc" ? "desc" : "asc";
    const sortedList = list.map(el => {
      const order = ordering.indexOf(el.id);
      return Object.assign(el, { order });
    });
    return simpleSortUpDown(sortedList, "order", ord);
  };

  handleRequestSort = (event, property, field) => {
    // console.log("handleRequestSort()", property, field);
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }
    const list = this.makeOrder(
      simpleSortUpDown(this.state.list, orderBy, order)
    );

    const ordering = list.map(el => el.id);
    this.setState({
      order,
      orderBy,
      list,
      listUnfiltered: list,
      ordering
    });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({
        selected: this.props.transactions.map(n => n.id)
      }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  handleClickChannel = (item, channel, i) => {
    // console.log("handleClickChannel()", item, channel, i);
    const { list } = this.state;
    // const list = JSON.parse(JSON.stringify(list));
    // const status = list.filter(x => x.id === item)[0][channel];
    // console.log("stat", status);

    const status = list[i][channel];
    // console.log("status", status, list[i].name);
    list[i][channel] = status === 0 ? 1 : 0;
    // list[i]
    this.setState({ list });

    this.props.clickOnChannel(item, channel);
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  handleClose = () => {
    this.setState({ open: false });
  };

  handleConfirmation = () => {
    // console.log("handledelete", this.state.selected);
    this.setState({ open: true });
    // this.props.open();
    // this.props.setDelete(this.state.selected);
  };

  handleDelete = () => {
    console.log("handledelete", this.state.selected);
    this.props.delete(this.state.selected);
    this.setState({ open: false, selected: [] });
  };

  handleSearch = (result, searchQuery) => {
    // console.log("searched", searched);
    this.setState({ list: result, searchQuery });
  };

  render() {
    const { classes, transactions, headCols } = this.props;
    // console.log("items", transactions);
    const {
      data,
      order,
      orderBy,
      selected,
      rowsPerPage,
      page,
      open,
      list,
      listUnfiltered
    } = this.state;
    const emptyRows =
      // rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
      rowsPerPage -
      Math.min(rowsPerPage, transactions.length - page * rowsPerPage);

    const iconProps = {
      className: this.props.classes.icon,
      style: { fontSize: 20 }
    };

    return (
      <React.Fragment>
        <Confirmation
          open={open}
          close={this.handleClose}
          action={this.handleDelete}
          komunikat={"Czy na pewno chcesz usunąć tę pozycję kosztową?"}
        />
        <Paper className={classes.root}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            deleteRows={this.handleConfirmation}
            search={this.handleSearch}
            data={listUnfiltered}
          />
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                headCols={headCols}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                // rowCount={data.length}
                rowCount={transactions.length}
              />
              <TableBody>
                {/* {stableSort(transactions, getSorting(order, orderBy)) */}
                {list
                  // {stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, i) => {
                    const isSelected = this.isSelected(item.id);
                    return (
                      <TableRow
                        hover
                        // onClick={event => this.handleClick(event, n.id)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={item.id}
                        selected={isSelected}
                      >
                        <TableCell padding="checkbox" style={{ width: 35 }}>
                          <Checkbox
                            checked={isSelected}
                            onClick={event => this.handleClick(event, item.id)}
                          />
                        </TableCell>
                        {/* <TableCell align="right">{n.name}</TableCell> */}
                        <TableCell
                          component="th"
                          scope="row"
                          padding="none"
                          style={{ width: 200 }}
                        >
                          {item.name}
                        </TableCell>
                        <TableCell component="th" scope="row" padding="none">
                          {item.unit}
                        </TableCell>
                        {headCols.map(channel => {
                          return (
                            <TableCell
                              padding="checkbox"
                              style={{ width: 35 }}
                              key={channel.id}
                              // component="th"
                              // scope="row"
                              // padding="none"
                            >
                              <Checkbox
                                checked={item[channel.id] === 1}
                                // checked={
                                //   item.SalesChannels.filter(
                                //     sch => sch.id === channel.id
                                //   ).length > 0
                                // }
                                onClick={() =>
                                  this.handleClickChannel(
                                    item.id,
                                    channel.id,
                                    i
                                  )
                                }
                              />
                            </TableCell>
                          );
                        })}
                        <TableCell padding="checkbox" style={{ width: 35 }}>
                          {/* <Checkbox checked={is selected} /> */}
                          <ButtonIconCircle
                            akcja={() => {
                              // props.edit(cell);
                              console.log("edit", item.id);
                              this.props.edit(item.id);
                            }}
                          >
                            <EditIcon {...iconProps} />
                          </ButtonIconCircle>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {/* {emptyRows > 0 && (
                  <TableRow style={{ height: 49 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )} */}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            // count={data.length}
            count={transactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              "aria-label": "Poprzednia"
            }}
            nextIconButtonProps={{
              "aria-label": "Następna"
            }}
            labelRowsPerPage="Elementów na stronie"
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </Paper>
      </React.Fragment>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    actions
  )
)(EnhancedTable);
