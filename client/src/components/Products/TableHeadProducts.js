import React, { Component } from "react";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Checkbox from "@material-ui/core/Checkbox";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import classNames from "classnames";
import SearchField from "../../common/inputs/SearchField";

class TableHeadProducts extends Component {
  state = {
    headCols: []
  };

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

  render() {
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
      // toolbar,
      // headCols
      // edited
    } = this.props;

    const { headCols } = this.state;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={checked.length > 0 && checked.length < list.length}
              checked={list.length !== 0 && checked.length === list.length}
              onChange={onSelectAllClick}
            />
          </TableCell>

          <TableCell>
            <div style={{ width: "100%" }}>
              {checked.length > 0 ? (
                <Typography
                  color="inherit"
                  // variant="subtitle1"
                >
                  {checked.length} wybrano
                </Typography>
              ) : (
                <div>
                  <TableCell
                    align={"left"}
                    // padding={row.disablePadding ? "none" : "default"}
                    // sortDirection={orderBy === row.id ? order : false}
                  >
                    <Tooltip
                      title="Sortuj"
                      placement={"bottom-start"}
                      enterDelay={300}
                    >
                      <TableSortLabel
                      // active={orderBy === row.id}
                      // direction={order}
                      // onClick={this.createSortHandler(row.id)}
                      >
                        {listLabel}
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                  {headCols.map(
                    row => (
                      <TableCell
                        key={row.id}
                        align={row.numeric ? "right" : "left"}
                        padding={row.disablePadding ? "none" : "default"}
                        // sortDirection={orderBy === row.id ? order : false}
                      >
                        <Tooltip
                          title="Sortuj"
                          placement={
                            row.numeric ? "bottom-end" : "bottom-start"
                          }
                          enterDelay={300}
                        >
                          <TableSortLabel
                          // active={orderBy === row.id}
                          // direction={order}
                          // onClick={this.createSortHandler(row.id)}
                          >
                            {row.label}
                          </TableSortLabel>
                        </Tooltip>
                      </TableCell>
                    ),
                    this
                  )}
                </div>
              )}
            </div>
          </TableCell>

          {/* <TableCell>
          <div style={{ width: "100%" }}>
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
        </TableCell> */}

          {/* <div className={classes.spacer} />
        <div className={classes.spacer} />
        <div style={{ width: "100%" }}>{toolbar}</div>
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
          )}
        </div> */}
        </TableRow>
      </TableHead>
    );
  }
}

export default TableHeadProducts;
