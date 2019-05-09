import React, { Component, PureComponent } from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import ButtonIconCircle from "../../common/ButtonIconCircle";
import EditIcon from "@material-ui/icons/Edit";
import { shallowEqual } from "../../common/functions";
import {
  FieldCheck,
  Field1,
  Field2,
  Field3,
  Field4,
  Field5,
  Field6,
  Field7,
  Field8,
  Field9,
  Field10,
  Field11
} from "./Fields";

const styles = theme => ({
  everyRow: {
    // borderBottomWidth: 1,
    // borderBottomStyle: "solid",
    // borderBottomColor: theme.palette.grey["100"]
    borderBottom: `1px solid ${theme.palette.grey["300"]}`
  },
  rowEven: {
    backgroundColor: theme.palette.grey["50"]
    // border: "1px solid red"
  },
  rowOdd: {}
});

class Row extends Component {
  state = {
    clickedRow: 0
  };

  handleClickOnRow = id => {
    this.props.rowClick(id);
    this.setState({ clickedRow: id });
  };

  shouldComponentUpdate(nextProps, nextState) {
    const {
      item,
      editedId,
      values,
      isSelected,
      isClicked,
      overlaps
    } = this.props;
    if (
      shallowEqual(item, nextProps.item) &&
      editedId === nextProps.editedId &&
      values === nextProps.values &&
      isSelected === nextProps.isSelected &&
      isClicked === nextProps.isClicked &&
      overlaps === nextProps.overlaps &&
      item.id !== nextProps.editedId
    ) {
      return false;
    } else if (
      shallowEqual(item, nextProps.item) &&
      values !== nextProps.values &&
      editedId === nextProps.editedId &&
      isSelected === nextProps.isSelected &&
      isClicked === nextProps.isClicked &&
      overlaps === nextProps.overlaps &&
      item.id !== nextProps.editedId
    ) {
      return false;
    } else if (
      shallowEqual(item, nextProps.item) &&
      values !== nextProps.values &&
      item.id !== nextProps.editedId &&
      editedId !== nextProps.editedId &&
      isSelected === nextProps.isSelected &&
      isClicked === nextProps.isClicked &&
      overlaps === nextProps.overlaps &&
      item.id !== editedId
    ) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const {
      classes,
      isSelected,
      item,
      editedId,
      values,
      change,
      headCols,
      iconProps,
      iconPropsOpacity,
      i,
      edit,
      handleClick,
      rowClick,
      handleClickChannel,
      disableSubmit,
      submit,
      rowType,
      disableEdit,
      disableDelete,
      clickedRow,
      isClicked,
      overlaps,
      conditionOne,
      auth: { role }
    } = this.props;
    // const { clickedRow } = this.state;
    return (
      <TableRow
        hover
        onClick={() => rowClick(item.id)}
        style={{
          cursor: "pointer",
          backgroundColor: overlaps ? "rgba(255, 0, 0, 0.3)" : null
        }}
        role="checkbox"
        aria-checked={isClicked}
        tabIndex={-1}
        key={item.id}
        selected={isClicked}
        className={classNames(
          classes.everyRow,
          i % 2 === 0 ? classes.rowEven : classes.rowOdd
        )}
      >
        <TableCell
          padding="checkbox"
          style={{ maxWidth: 35, width: 35, borderWidth: 0 }}
        >
          {disableDelete || (
            <Checkbox
              checked={isSelected}
              onClick={event => handleClick(event, item.id)}
            />
          )}
        </TableCell>

        {/* <TableCell align="right">{n.name}</TableCell> */}

        <Field1
          rowType={rowType}
          row={item}
          values={values}
          change={change}
          editedId={editedId}
          submit={submit}
          disableSubmit={disableSubmit}
        />
        <Field2
          editedId={editedId}
          rowType={rowType}
          row={item}
          values={values}
          submit={submit}
          disableSubmit={disableSubmit}
          change={change}
        />
        <Field3 rowType={rowType} row={item} />
        <Field4 rowType={rowType} row={item} />
        <Field5 rowType={rowType} row={item} role={role} />
        <Field6 rowType={rowType} row={item} role={role} />
        <Field7 rowType={rowType} row={item} />
        <Field8 rowType={rowType} row={item} />
        <Field9 rowType={rowType} row={item} role={role} />
        <Field10
          rowType={rowType}
          row={item}
          role={role}
          conditionOne={conditionOne}
        />
        <Field11 rowType={rowType} row={item} role={role} />
        {headCols.map((channel, i) => (
          <FieldCheck
            key={i}
            role={role}
            channel={channel}
            row={item}
            iconProps={iconProps}
            iconPropsOpacity={iconPropsOpacity}
            click={() => handleClickChannel(item.id, channel.id, i)}
          />
        ))}
        <TableCell
          padding="checkbox"
          style={{
            width: 35,
            borderWidth: 0
            // borderTopStyle: "solid",
            // borderTopColor: "rgba(224, 224, 224, 1)",
            // // borderTopWidth: channel.length === i -1 ? 0 : 1
            // borderTopWidth: 1
          }}
        >
          {/* <Checkbox checked={is selected} /> */}
          {disableDelete || (
            <ButtonIconCircle
              title="Edytuj"
              akcja={() => {
                // props.edit(cell);
                console.log("edit", item.id);
                edit(item.id);
              }}
            >
              <EditIcon {...iconProps} />
            </ButtonIconCircle>
          )}
        </TableCell>
      </TableRow>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

// export default connect(
//   mapStateToProps,
//   null
// )(Row);

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    null
  )
)(Row);
