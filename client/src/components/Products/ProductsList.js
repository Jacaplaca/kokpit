import React, { Component, PureComponent } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import Fade from "@material-ui/core/Fade";
import Grow from "@material-ui/core/Grow";
import Zoom from "@material-ui/core/Zoom";

import { connect } from "react-redux";
import { compose } from "redux";

import Confirmation from "../Confirmation";
import * as actions from "../../actions";
import { simpleSortUpDown, getSuggestions, sum } from "../../common/functions";
import SearchField from "../../common/inputs/SearchField";
import Row from "./Row";
import { getString } from "../../translate";
import CurrencyFormat from "../../common/CurrencyFormat";

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

// const rows = [
//   {
//     id: "name",
//     numeric: false,
//     disablePadding: true,
//     label: "Towar/Usługa"
//   },
//   {
//     id: "unit",
//     numeric: false,
//     disablePadding: true,
//     label: "Jednostka"
//   }
// ];

const switchLang = (el, language) => {
  switch (language) {
    case "pl":
      return el.name;
    case "en":
      return el.name_en ? el.name_en : el.name;
    default:
      return el.name;
  }
};

class EnhancedTableHead extends Component {
  state = {
    headCols: []
  };

  componentWillMount() {
    // console.log("this.props.headRow", this.props.headRow);
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
      rowCount,
      classes,
      headRow,
      disableDelete,
      language
    } = this.props;

    const { headCols } = this.state;

    const styleField = {
      content: {
        // paddingRight: 10,
        // paddingLeft: 7,
        borderRightStyle: "solid",
        borderRightColor: "rgba(224, 224, 224, 1)",
        borderRightWidth: 1
      },
      suffix: { paddingLeft: 2, fontSize: 11 }
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            {disableDelete || (
              <Checkbox
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={numSelected === rowCount}
                onChange={onSelectAllClick}
              />
            )}
          </TableCell>
          {headRow.map(row => {
            return (
              row.hide || (
                <TableCell
                  key={row.id}
                  align={row.numeric ? "right" : "left"}
                  padding={row.disablePadding ? "none" : "default"}
                  sortDirection={orderBy === row.id ? order : false}
                  style={{
                    textAlign: row.textAlign,
                    paddingLeft: row.textAlign === "center" ? 4 : 7,
                    paddingRight: row.textAlign === "center" ? 4 : 7,
                    ...styleField.content,
                    borderRightWidth: row.hideRightBorder ? 0 : 1
                  }}
                >
                  {row.hideSort ? (
                    row.label
                  ) : (
                    <Tooltip
                      title={getString("SORT", language)}
                      placement={row.numeric ? "bottom-end" : "bottom-start"}
                      enterDelay={300}
                    >
                      <TableSortLabel
                        active={orderBy === row.id}
                        direction={order}
                        onClick={this.createSortHandler(row.id)}
                        classes={{
                          // Override with the active class if this is the selected column or inactive otherwise
                          icon:
                            orderBy === row.id
                              ? classes.activeSortIcon
                              : classes.inactiveSortIcon,
                          root:
                            orderBy === row.id
                              ? classes.activeTableSort
                              : classes.inactiveTableSort
                        }}
                        // hideSortIcon={row.hideSort}
                      >
                        {row.label}
                        {/* {switchLang(row, language)} */}
                      </TableSortLabel>
                    </Tooltip>
                  )}
                </TableCell>
              )
            );
          }, this)}
          {headCols.map(
            (col, i) => (
              <TableCell
                key={col.id}
                align="center"
                padding={col.disablePadding ? "none" : "default"}
                sortDirection={orderBy === col.id ? order : false}
                // style={{ textAlign: "center" }}
                style={{
                  // textAlign: "center",
                  paddingLeft: 2,
                  ...styleField.content,
                  borderRightWidth:
                    col.hideRightBorder || i === headCols.length - 1 ? 0 : 1,
                  textAlign: "center"
                }}
              >
                {/* {col.label} */}
                <Tooltip
                  title={getString("SORT", language)}
                  placement={col.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={order}
                    onClick={this.createSortHandler(col.id)}
                    // hideSortIcon
                    // hidesorticon
                    classes={{
                      // Override with the active class if this is the selected column or inactive otherwise
                      icon:
                        orderBy === col.id
                          ? classes.activeSortIcon
                          : classes.inactiveSortIcon,
                      root:
                        orderBy === col.id
                          ? classes.activeTableSort
                          : classes.inactiveTableSort
                    }}
                  >
                    {/* {col.label} */}
                    {switchLang(col, language)}
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
  center: {
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
  const {
    numSelected,
    classes,
    deleteRows,
    data,
    search,
    labelList,
    searchColumns,
    sum,
    language
  } = props;

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
            {numSelected} {getString("CHOOSE", language)}
          </Typography>
        ) : (
          <Typography
            // variant="h6"
            id="tableTitle"
          >
            {labelList}{" "}
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.center}>
        {sum && (
          <div style={{ fontSize: "0.85em" }}>
            {getString("SUM", language)}:{" "}
            <CurrencyFormat value={sum} style={{ fontWeight: 600 }} />
          </div>
        )}
      </div>
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title={getString("REMOVE", language)}>
            <IconButton aria-label="Delete" onClick={deleteRows}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <SearchField
            data={data}
            columns={searchColumns || ["name"]}
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

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: "100%"
    // display: "grid",
    // gridTemplateColumns: "1fr, 1fr, 1fr"
    // marginTop: theme.spacing.unit * 3
  },
  table: {
    // minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  },
  activeSortIcon: {
    opacity: 1,
    // width: 13,
    webkitTransition: "opacity 0.5s" /* Safari */,
    transition: "opacity 0.5s",
    transitionTimingFunction: "ease"
  },
  activeTableSort: {
    fontWeight: "500"
  },

  // Half visible for inactive icons
  inactiveSortIcon: {
    width: 0,
    display: "none",
    opacity: 0.2,
    // opacity: 0,
    webkitTransition: "opacity 0.5s" /* Safari */,
    transition: "opacity 0.5s",
    transitionTimingFunction: "ease"
  }
});

class EnhancedTable extends Component {
  state = {
    order: "desc",
    orderBy: "order",
    selected: [],
    page: 0,
    rowsPerPage: 25,
    open: false,
    list: [],
    ordering: [],
    listUnfiltered: [],
    query: "",
    clickedRow: 0
  };

  componentWillMount() {
    const { defaultSort, searchSum, transactions, defaultOrder } = this.props;
    const list = this.makeOrder(
      simpleSortUpDown(transactions, defaultSort, defaultOrder)
    );
    const ordering = list.map(el => el.id);
    // const sortedList = simpleSortUpDown(list, defaultSort, "desc");
    this.setState({
      list: list,
      ordering,
      listUnfiltered: list,
      sum: searchSum ? sum(list, searchSum) : null,
      orderBy: this.props.defaultSort
    });
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (
  //     this.props.transactions === nextProps.transactions &&
  //     this.state === nextState &&
  //     this.props.editedId === nextProps.editedId
  //     // && this.props.values === nextProps.values
  //   ) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

  componentWillReceiveProps(nextProps) {
    // console.log("componentWillReceiveProps", this.props);
    // console.log("componentWillReceiveProps()");
    const { query } = this.state;
    const { transactions, showChild } = this.props;
    const { transactions: transNext, shoChNext } = nextProps;
    if (transactions !== transNext) {
      // console.log("componentWillReceiveProps(), change");
      const list = this.loadOrder(transNext);
      if (query !== "") {
        this.setState({
          list: getSuggestions(list, query, ["name"]),
          listUnfiltered: list,
          orderBy: "order",
          sum: this.props.searchSum ? sum(list, this.props.searchSum) : null
        });
      } else {
        this.setState({
          list,
          listUnfiltered: list,
          orderBy: "order",
          sum: this.props.searchSum ? sum(list, this.props.searchSum) : null
        });
      }
    }
    if (showChild !== shoChNext) {
      this.setState({ clickedRow: 0 });
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
    return simpleSortUpDown(sortedList, "order");
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
    // const { list } = this.state;
    // // const list = JSON.parse(JSON.stringify(list));
    // // const status = list.filter(x => x.id === item)[0][channel];
    // // console.log("stat", status);
    //
    // const status = list[i][channel];
    // // console.log("status", status, list[i].name);
    // list[i][channel] = status === 0 ? 1 : 0;
    // // list[i]
    // this.setState({ list });

    this.props.clickOnChannel(item, channel);
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;
  handleClickOnRow = (id, event) => {
    // console.log("handleClickOnRow", id, event);
    this.props.clickOnRow(id, event);
    this.setState({ clickedRow: id });
  };

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

  handleSearch = (result, query) => {
    // console.log("searched", result);
    console.log("searchin sum");
    this.setState({
      list: result,
      query,
      sum: this.props.searchSum ? sum(result, this.props.searchSum) : null
    });
  };

  // handleRowClick = id => {
  //   console.log("id", id);
  // };

  render() {
    const {
      classes,
      transactions,
      headCols,
      edit,
      editedId,
      values,
      change,
      disableSubmit,
      onSubmit,
      labelList,
      headRow,
      rowType,
      clickOnRow,
      disableEdit,
      disableDelete,
      searchColumns,
      children,
      showChild,
      overlaps,
      conditionOne,
      language
    } = this.props;
    const {
      data,
      order,
      orderBy,
      selected,
      rowsPerPage,
      page,
      open,
      list,
      listUnfiltered,
      clickedRow,
      sum
    } = this.state;
    const emptyRows =
      // rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
      rowsPerPage -
      Math.min(rowsPerPage, transactions.length - page * rowsPerPage);

    const iconProps = {
      className: this.props.classes.icon,
      style: { fontSize: 20 }
    };
    const iconPropsOpacity = {
      className: this.props.classes.icon,
      style: { opacity: 0.5, fontSize: 20 }
    };

    // console.log("product list", values, values["name"], values["unit"]);
    // console.log("ProductsList", this.props.clickedRow);
    return (
      <React.Fragment>
        <div style={{ position: "relative" }}>{children}</div>
        <Confirmation
          open={open}
          close={this.handleClose}
          action={this.handleDelete}
          komunikat={"Czy na pewno?"}
        />

        <Grow
          direction="left"
          in={!showChild}
          mountOnEnter
          unmountOnExit
          // timeout={300}
          style={{
            transformOrigin: "0 0 0",
            // gridRow: "2 / 4",
            // gridColumn: "2 /4",
            // backgroundColor: "yellow",
            // opacity: 0.5,
            // height: 200,
            // width: 222,
            // right: 23,
            // position: "absolute"
            // backgroundColor: "green",
            // opacity: 1,
            // height: "100%",
            // width: "100%",
            // position: "absolute",
            top: 0,
            right: 0
            // zIndex: 23
          }}
        >
          <div className={classes.root}>
            <EnhancedTableToolbar
              language={language}
              sum={sum}
              numSelected={selected.length}
              deleteRows={this.handleConfirmation}
              search={this.handleSearch}
              data={listUnfiltered}
              labelList={labelList}
              searchColumns={searchColumns}
            />
            <div className={classes.tableWrapper}>
              <Table className={classes.table} aria-labelledby="tableTitle">
                <EnhancedTableHead
                  language={language}
                  disableDelete={disableDelete}
                  headCols={headCols}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={this.handleSelectAllClick}
                  onRequestSort={this.handleRequestSort}
                  // rowCount={data.length}
                  rowCount={transactions.length}
                  classes={classes}
                  headRow={headRow}
                  rowType={rowType}
                />
                <TableBody>
                  {/* {stableSort(transactions, getSorting(order, orderBy)) */}
                  {list
                    // {stableSort(data, getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, i) => {
                      const isSelected = this.isSelected(item.id);
                      return (
                        <Row
                          conditionOne={conditionOne}
                          isClicked={this.props.clickedRow === item.id}
                          overlaps={overlaps && overlaps.includes(item.id)}
                          // itemId={item.id}
                          // clickedRow={clickedRow}
                          disableEdit={disableEdit}
                          disableDelete={disableDelete}
                          key={item.id}
                          isSelected={isSelected}
                          item={item}
                          editedId={editedId}
                          values={values}
                          change={change}
                          headCols={headCols}
                          iconProps={iconProps}
                          iconPropsOpacity={iconPropsOpacity}
                          i={i}
                          edit={edit}
                          handleClick={this.handleClick}
                          rowClick={(id, event) =>
                            this.handleClickOnRow(id, event)
                          }
                          handleClickChannel={this.handleClickChannel}
                          disableSubmit={disableSubmit}
                          submit={onSubmit}
                          rowType={rowType}
                        />
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
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              // count={data.length}
              count={transactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                "aria-label": getString("PAGINATION_PREV", language)
              }}
              nextIconButtonProps={{
                "aria-label": getString("PAGINATION_NEXT", language)
              }}
              labelRowsPerPage={getString("PAGINATION_LABEL", language)}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </div>
        </Grow>
      </React.Fragment>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired
};

EnhancedTable.defaultProps = {
  headCols: [],
  clickOnRow: () => {},
  clicked: 0,
  defaultSort: "order",
  defaultOrder: "desc"
};

function mapStateToProps({ auth, language }) {
  return { auth, language };
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    actions
  )
)(EnhancedTable);
