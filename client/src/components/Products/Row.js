import React, { Component, PureComponent } from "react";
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
  componentWillReceiveProps(nextProps) {
    // console.log("row", this.shallowEqual(this.props.item, nextProps.item));
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { item, editedId, values, isSelected } = this.props;
    if (
      shallowEqual(item, nextProps.item) &&
      editedId === nextProps.editedId &&
      values === nextProps.values &&
      isSelected === nextProps.isSelected &&
      item.id !== nextProps.editedId
    ) {
      return false;
    } else if (
      shallowEqual(item, nextProps.item) &&
      values !== nextProps.values &&
      editedId === nextProps.editedId &&
      isSelected === nextProps.isSelected &&
      item.id !== nextProps.editedId
    ) {
      return false;
    } else if (
      shallowEqual(item, nextProps.item) &&
      values !== nextProps.values &&
      item.id !== nextProps.editedId &&
      editedId !== nextProps.editedId &&
      isSelected === nextProps.isSelected &&
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
      handleClickChannel,
      disableSubmit,
      submit
    } = this.props;
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
            onClick={event => handleClick(event, item.id)}
          />
        </TableCell>
        {/* <TableCell align="right">{n.name}</TableCell> */}
        {editedId === item.id ? (
          <TableCell
            key={"name"}
            component="th"
            scope="row"
            padding="none"
            style={{ width: 200 }}
          >
            <Input
              inputProps={{ style: { fontSize: 13 } }}
              // style={{ marginTop: 6 }}
              // disableUnderline
              // startAdornment={
              //   <InputAdornment position="start">{`${
              //     field.label
              //   }: `}</InputAdornment>
              // }
              // label={value[field.label]}
              // key={"unit"}
              name={"name"}
              // autoFocus={item.id === editedId}
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
            style={{ width: 200 }}
          >
            {item.name}
          </TableCell>
        )}
        {editedId === item.id ? (
          <TableCell
            component="th"
            scope="row"
            padding="none"
            // style={{ width: 200 }}
          >
            <Input
              inputProps={{ style: { fontSize: 13 } }}
              // style={{ marginTop: 6 }}
              // disableUnderline
              // startAdornment={
              //   <InputAdornment position="start">{`${
              //     field.label
              //   }: `}</InputAdornment>
              // }
              // label={value[field.label]}
              // key={i}
              // autoFocus={item.id === editedId}
              type="text"
              value={values["unit"]}
              onChange={e => change("unit", e.target.value, "editing")}
            />
            <ButtonMy onClick={submit} disabled={disableSubmit}>
              Ok{" "}
            </ButtonMy>
          </TableCell>
        ) : (
          <TableCell component="th" scope="row" padding="none">
            {item.unit}
          </TableCell>
        )}
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
                icon={<CheckBoxOutlineBlankIcon {...iconPropsOpacity} />}
                checkedIcon={
                  <CheckBoxIcon
                    {...iconProps}
                    // fontSize={{ fontSize: 15 }}
                  />
                }
                // style={{ fontSize: 4 }}
                // checked={
                //   item.SalesChannels.filter(
                //     sch => sch.id === channel.id
                //   ).length > 0
                // }
                onClick={() => handleClickChannel(item.id, channel.id, i)}
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
              edit(item.id);
            }}
          >
            <EditIcon {...iconProps} />
          </ButtonIconCircle>
        </TableCell>
      </TableRow>
    );
  }
}

export default Row;
