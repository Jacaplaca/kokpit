import React, { Component, PureComponent } from "react";
import { compose } from "redux";
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
import RowHOC from "./RowHOC";

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
      <div>
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
            style={{ width: 200 }}
          >
            {item.name}
          </TableCell>
        )}
        {editedId === item.id ? (
          <TableCell component="th" scope="row" padding="none">
            <Input
              inputProps={{ style: { fontSize: 13 } }}
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
      </div>
    );
  }
}

// const enhance = compose(
//   // withRouter,
//   withStyles(combinedStyles, { withTheme: true }),
//   connect(
//     mapStateToProps,
//     actions
//   ),
//   RowHOC
// );

export default RowHOC(Row);
