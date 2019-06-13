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

import EditIcon from "@material-ui/icons/Edit";

import { connect } from "react-redux";
import { compose } from "redux";

import ButtonIconCircle from "../../common/ButtonIconCircle";
import Confirmation from "../Confirmation";
import * as actions from "../../actions";
import { formatNumber, shorting } from "../../common/functions";
import MainFrameHOC from "../../common/MainFrameHOC";

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

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

class SimpleListHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      auth,
      channelId
    } = this.props;

    const rows = [
      { id: "rank", numeric: true, disablePadding: true, label: "Ranking" },
      { id: "name", numeric: false, disablePadding: false, label: "Nazwa" },
      {
        id: "bonuses",
        numeric: true,
        disablePadding: false,
        label: "Prowizja"
      }
    ];

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? "right" : "left"}
                // align={"center"}
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
        </TableRow>
      </TableHead>
    );
  }
}

SimpleListHead.propTypes = {
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

let SimpleListToolbar = props => {
  const { numSelected, classes, deleteRows } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Usuń">
            <IconButton aria-label="Delete" onClick={deleteRows}>
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

SimpleListToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired
};

SimpleListToolbar = withStyles(toolbarStyles)(SimpleListToolbar);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    // minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  }
});

class SimpleList extends React.Component {
  state = {
    order: "desc",
    orderBy: "date",
    selected: [],
    data: [
      createData("Cupcake", 305, 3.7, 67, 4.3),
      createData("Donut", 452, 25.0, 51, 4.9),
      createData("Eclair", 262, 16.0, 24, 6.0),
      createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
      createData("Gingerbread", 356, 16.0, 49, 3.9),
      createData("Honeycomb", 408, 3.2, 87, 6.5),
      createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
      createData("Jelly Bean", 375, 0.0, 94, 0.0),
      createData("KitKat", 518, 26.0, 65, 7.0),
      createData("Lollipop", 392, 0.2, 98, 0.0),
      createData("Marshmallow", 318, 0, 81, 2.0),
      createData("Nougat", 360, 19.0, 9, 37.0),
      createData("Oreo", 437, 18.0, 63, 4.0)
    ],
    page: 0,
    rowsPerPage: 5,
    open: false
  };

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
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

  render() {
    const { classes, transactions, auth, channelId } = this.props;
    const {
      data,
      order,
      orderBy,
      selected,
      rowsPerPage,
      page,
      open
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
          komunikat={"Czy na pewno?"}
        />
        <div className={classes.root}>
          <div className={classes.tableWrapper}>
            <Table className={classes.table} aria-labelledby="tableTitle">
              <SimpleListHead
                auth={auth}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                // rowCount={data.length}
                rowCount={transactions.length}
                channelId={channelId}
              />
              <TableBody>
                {stableSort(transactions, getSorting(order, orderBy))
                  // {stableSort(data, getSorting(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((n, i) => {
                    const isSelected = this.isSelected(n.id);
                    return (
                      <TableRow
                        style={{ height: 10 }}
                        hover
                        // onClick={event => this.handleClick(event, n.id)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={i}
                        selected={isSelected}
                      >
                        <TableCell
                          style={{ maxWidth: 50, width: 50 }}
                          align="center"
                        >
                          {n.rank}
                        </TableCell>
                        <TableCell align="left">{n.name}</TableCell>
                        <TableCell align="left">
                          {n.bonuses !== 0 && (
                            <NumberFormat
                              value={formatNumber(n.bonuses)}
                              displayType={"text"}
                              thousandSeparator={" "}
                              decimalSeparator={","}
                              suffix={" zł"}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {/* {emptyRows > 0 && (
                  <TableRow style={{ height: 10 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )} */}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
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
        </div>
      </React.Fragment>
    );
  }
}

SimpleList.propTypes = {
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
)(SimpleList);
