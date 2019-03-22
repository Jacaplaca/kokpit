import React, { Component, PureComponent } from "react";
import currency from "currency.js";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/RadioButtonUnchecked";
import CheckBoxIcon from "@material-ui/icons/CheckCircle";
import InputInRow from "../../common/inputs/InputInRow";
import Input from "@material-ui/core/Input";
import ButtonIconCircle from "../../common/ButtonIconCircle";
import EditIcon from "@material-ui/icons/Edit";
import { shallowEqual } from "../../common/functions";
import ButtonMy from "../../common/ButtonMy";

class Row extends Component {
  // componentWillReceiveProps(nextProps) {
  //   // console.log("row", this.shallowEqual(this.props.item, nextProps.item));
  // }
  state = {
    clickedRow: 0
  };

  handleClickOnRow = id => {
    this.props.rowClick(id);
    this.setState({ clickedRow: id });
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { item, editedId, values, isSelected, isClicked } = this.props;
    if (
      shallowEqual(item, nextProps.item) &&
      editedId === nextProps.editedId &&
      values === nextProps.values &&
      isSelected === nextProps.isSelected &&
      isClicked === nextProps.isClicked &&
      item.id !== nextProps.editedId
    ) {
      return false;
    } else if (
      shallowEqual(item, nextProps.item) &&
      values !== nextProps.values &&
      editedId === nextProps.editedId &&
      isSelected === nextProps.isSelected &&
      isClicked === nextProps.isClicked &&
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
      item.id !== editedId
    ) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const {
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
      isClicked
    } = this.props;
    // const { clickedRow } = this.state;
    return (
      <TableRow
        hover
        onClick={() => rowClick(item.id)}
        style={{
          cursor: "pointer"
          // backgroundColor: clickedRow === item.id ? "red" : null
        }}
        role="checkbox"
        aria-checked={isClicked}
        tabIndex={-1}
        key={item.id}
        selected={isClicked}
      >
        <TableCell padding="checkbox" style={{ maxWidth: 35, width: 35 }}>
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
        {headCols.map(channel => {
          return (
            <TableCell
              padding="checkbox"
              style={{ width: 35 }}
              key={channel.id}
            >
              <Checkbox
                checked={item[channel.id] === 1}
                icon={<CheckBoxOutlineBlankIcon {...iconPropsOpacity} />}
                checkedIcon={<CheckBoxIcon {...iconProps} />}
                onClick={() => handleClickChannel(item.id, channel.id, i)}
              />
            </TableCell>
          );
        })}
        <TableCell padding="checkbox" style={{ width: 35 }}>
          {/* <Checkbox checked={is selected} /> */}
          {disableDelete || (
            <ButtonIconCircle
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

const Field1 = ({
  rowType,
  row,
  editedId,
  values,
  change,
  submit,
  disableSubmit
}) => {
  switch (rowType) {
    case "product":
      return editedId === row.id ? (
        <TableCell
          key={"name"}
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 200 }}
          style={{ width: 25 + row["name_max"] * 7, paddingRight: 23 }}
        >
          <Input
            inputProps={{
              style: { fontSize: 13, width: 20 + row["name_max"] * 7 }
            }}
            name={"name"}
            type="text"
            value={values["name"]}
            onChange={e => change("name", e.target.value, "editing")}
          />
        </TableCell>
      ) : (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 200 }}
          style={{ width: 10 + row["name_max"] * 7 }}
        >
          {row.name}
        </TableCell>
      );
    case "channel":
      return editedId === row.id ? (
        <TableCell
          key={"name"}
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 200 }}
          style={{ width: 25 + row["name_max"] * 7, paddingRight: 23 }}
        >
          <Input
            inputProps={{
              style: { fontSize: 13, width: 15 + values["name"].length * 6.25 }
            }}
            name={"name"}
            type="text"
            value={values["name"]}
            onChange={e => change("name", e.target.value, "editing")}
          />
          <ButtonMy onClick={submit} disabled={disableSubmit}>
            Ok
          </ButtonMy>
        </TableCell>
      ) : (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 200 }}
          style={{ width: 10 + row["name_max"] * 7 }}
        >
          {row.name}
        </TableCell>
      );
    // break;
    case "user":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          style={{ width: 15 + row["name_max"] * 6.5 }}
        >
          {row.name}
        </TableCell>
      );
    case "productsInChannel":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          style={{ width: 15 + row["name_max"] * 6.5 }}
        >
          {row.name}
        </TableCell>
      );
    case "invoices":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          style={{ width: 100 }}
        >
          {row.nr_pelny}
        </TableCell>
      );
    case "channelConfig":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          style={{ width: 80 }}
        >
          {row.from}
        </TableCell>
      );
    default:
      return null;
  }
};
const Field2 = ({
  rowType,
  row,
  editedId,
  values,
  submit,
  disableSubmit,
  change
}) => {
  switch (rowType) {
    case "product":
      return editedId === row.id ? (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 200 }}
        >
          <Input
            // inputProps={{ style: { fontSize: 13 } }}
            inputProps={{
              style: { fontSize: 13, width: 10 + row["unit_max"] * 7 }
            }}
            type="text"
            value={values["unit"]}
            onChange={e => change("unit", e.target.value, "editing")}
          />
          <ButtonMy onClick={submit} disabled={disableSubmit}>
            Ok
          </ButtonMy>
        </TableCell>
      ) : (
        <TableCell component="th" scope="row" padding="none">
          {row.unit}
        </TableCell>
      );
    // break;
    case "user":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 200 }}
          style={{ width: 15 + row["surname_max"] * 6.5 }}
        >
          {row.surname}
        </TableCell>
      );
    case "invoices":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 200 }}
          style={{ width: 60 }}
        >
          {row.termin_platnosci}
        </TableCell>
      );
    case "channelConfig":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 200 }}
          style={{ width: 80 }}
        >
          {row.to}
        </TableCell>
      );
    default:
      return null;
  }
};

const Field3 = ({ rowType, row }) => {
  switch (rowType) {
    case "product":
      return null;
    // break;
    case "user":
      return (
        <TableCell component="th" scope="row" padding="none">
          {row.role}
        </TableCell>
      );
    case "invoices":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 200 }}
          style={{ width: 60 }}
        >
          {`${currency(row.pozostalo_do_zaplacenia, {
            separator: " ",
            decimal: ","
          }).format()} zł`}
        </TableCell>
      );
    case "channelConfig":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 200 }}
          style={{ width: 60 }}
        >
          {row.bonusType}
        </TableCell>
      );
    default:
      return null;
  }
};

const Field4 = ({ rowType, row }) => {
  switch (rowType) {
    case "invoices":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 200 }}
          style={{ width: 100 }}
        >
          {row.klient}
        </TableCell>
      );
    case "channelConfig":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 200 }}
          // style={{ width: 100 }}
        >
          {formatBonus(row)}
        </TableCell>
      );
    default:
      return null;
  }
};

const formatBonus = row => {
  const { bonusType, bonus, suffix } = row;
  if (bonusType === "% marży") {
    let result;
    const bonus100 = bonus * 100;
    console.log(bonus100.toFixed(2), parseFloat(bonus100.toFixed(2)));
    if (parseFloat(bonus100.toFixed(2)) % 1 !== 0) {
      result = `${parseFloat(bonus100)
        .toFixed(2)
        .toString()
        .replace(".", ",")} ${suffix}`;
    } else {
      result = `${parseFloat(bonus100.toFixed(2))
        .toString()
        .replace(".", ",")} ${suffix}`;
    }
    return result;
  } else if (bonusType === "stawka") {
    return `${parseFloat(bonus)
      .toFixed(parseFloat(bonus) % 1 !== 0 ? 2 : 0)
      .toString()
      .replace(".", ",")} ${suffix}`;
  }
  // return 33;
};

export default Row;
