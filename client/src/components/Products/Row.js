import React, { Component, PureComponent } from "react";
import { connect } from "react-redux";
import currency from "currency.js";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import NumberFormat from "react-number-format";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/RadioButtonUnchecked";
import CheckBoxIcon from "@material-ui/icons/CheckCircle";
import InputInRow from "../../common/inputs/InputInRow";
import Input from "@material-ui/core/Input";
import ButtonIconCircle from "../../common/ButtonIconCircle";
import EditIcon from "@material-ui/icons/Edit";
import { shallowEqual } from "../../common/functions";
import ButtonMy from "../../common/ButtonMy";
import { shorting, formatNumber } from "../../common/functions";

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
        {headCols.map((channel, i) => {
          return (
            <TableCell
              // padding="checkbox"
              align="center"
              padding="none"
              // sortDirection={orderBy === col.id ? order : false}
              style={
                i === headCols.length - 1
                  ? {
                      ...styleField.contentWithoutRightBorder,
                      textAlign: "center"
                    }
                  : { ...styleField.content, textAlign: "center" }
              }
              // style={{ width: 35 }}
              key={channel.id}
            >
              <Checkbox
                disabled={channel.id === 1 && item.role === "master"}
                checked={item[channel.id] === 1}
                icon={<CheckBoxOutlineBlankIcon {...iconPropsOpacity} />}
                checkedIcon={<CheckBoxIcon {...iconProps} />}
                onClick={() => handleClickChannel(item.id, channel.id, i)}
              />
            </TableCell>
          );
        })}
        <TableCell
          padding="checkbox"
          style={{
            width: 35,
            borderTopStyle: "solid",
            borderTopColor: "rgba(224, 224, 224, 1)",
            // borderTopWidth: channel.length === i -1 ? 0 : 1
            borderTopWidth: 1
          }}
        >
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

const styleField = {
  content: {
    paddingRight: 10,
    paddingLeft: 7,
    borderRightStyle: "solid",
    borderRightColor: "rgba(224, 224, 224, 1)",
    borderRightWidth: 1
  },
  contentWithoutRightBorder: {
    paddingRight: 10,
    paddingLeft: 7
  },
  suffix: { paddingLeft: 2, fontSize: 11 }
};

const DefaultTC = ({ children, center }) => (
  <TableCell
    component="th"
    scope="row"
    padding="none"
    // style={{ width: 200 }}
    style={{
      ...styleField.content,
      textAlign: center ? "center" : "none"
    }}
  >
    {children}
  </TableCell>
);

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
          style={{
            ...styleField.content
          }}
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
          style={{
            ...styleField.content
          }}
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
          style={{
            ...styleField.content
          }}
        >
          <Input
            inputProps={{
              // style: { fontSize: 13, width: 15 + values["name"].length * 6.25 }
              style: { fontSize: 13, width: "100%" }
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
          style={{
            ...styleField.content
          }}
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
          style={{
            ...styleField.content
          }}
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
          style={{
            ...styleField.content
          }}
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
          style={{
            ...styleField.content
          }}
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
          style={{
            ...styleField.content
          }}
        >
          {row.from}
        </TableCell>
      );
    case "customerDetails":
      return (
        <TableCell
          // align="right"
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 80 }}
          style={{
            ...styleField.content
          }}
        >
          {row.name}
        </TableCell>
      );
    case "transactions":
      return <DefaultTC>{row.date}</DefaultTC>;
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
        <TableCell
          component="th"
          scope="row"
          padding="none"
          style={{ ...styleField.content, textAlign: "center" }}
        >
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
          style={{
            ...styleField.content
          }}
        >
          {row.surname}
        </TableCell>
      );
    case "productsInChannel":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          style={{
            ...styleField.content
          }}
        >
          {row.config}
        </TableCell>
      );
    case "invoices":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 200 }}
          style={{ ...styleField.content, textAlign: "center" }}
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
    case "customerDetails":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 65 }}
          style={{
            ...styleField.content
          }}
        >
          {row.surname}
        </TableCell>
      );
    case "transactions":
      return <DefaultTC>{row.ItemTrans.name}</DefaultTC>;
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
        <TableCell
          component="th"
          // align="center"
          scope="row"
          padding="none"
          style={{
            ...styleField.content,
            textAlign: "center"
          }}
        >
          <div
            style={
              {
                // textAlign: "center",
                // display: "inherit"
              }
            }
          >
            <div
              style={{
                backgroundColor:
                  row.role === "master"
                    ? "rgb(176, 203, 142)"
                    : "rgb(182, 182, 182)",
                padding: 3,
                // margin: 5,
                textAlign: "center",
                borderRadius: 4,
                display: "initial"
              }}
            >
              <span
                style={{
                  // ...styleField.content,
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "white",
                  textAlign: "center",
                  textTransform: "uppercase"
                }}
              >
                {row.role}
              </span>
            </div>
          </div>
        </TableCell>
      );
    case "invoices":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 200 }}
          style={{ ...styleField.content }}
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
    case "customerDetails":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 150 }}
          style={{
            ...styleField.content
          }}
        >
          {row.address}
        </TableCell>
      );
    case "transactions":
      return <DefaultTC>{shorting(row.Places.name, 30)}</DefaultTC>;
    default:
      return null;
  }
};

const Field4 = ({ rowType, row }) => {
  switch (rowType) {
    case "user":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          style={{
            ...styleField.content,
            textAlign: "center"
          }}
        >
          {row.email}
        </TableCell>
      );
    case "invoices":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 200 }}
          style={{ ...styleField.content }}
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
          {`${formatBonus(row.bonus)} ${row.suffix}`}
        </TableCell>
      );
    case "customerDetails":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 30 }}
          style={{
            ...styleField.content,
            textAlign: "center"
          }}
        >
          {row.phone}
        </TableCell>
      );
    case "transactions":
      return <DefaultTC>{row.customer}</DefaultTC>;
    default:
      return null;
  }
};

const Field5 = ({ rowType, row, role }) => {
  switch (rowType) {
    case "invoices":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 200 }}
          style={{ ...styleField.content, textAlign: "center" }}
        >
          {row.overdue}
        </TableCell>
      );
    case "customerDetails":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ maxWidth: 30 }}
          style={{
            ...styleField.content,
            textAlign: "center"
          }}
        >
          {row.field.replace(".", ",")}
          <span style={{ ...styleField.suffix }}>ha</span>
        </TableCell>
      );
    case "transactions":
      return (
        <DefaultTC center>
          <NumberFormat
            value={row.quantity}
            displayType={"text"}
            thousandSeparator={" "}
            decimalSeparator={","}
            suffix={` ${row.unit}`}
          />
        </DefaultTC>
      );
    default:
      return null;
  }
};
const Field6 = ({ rowType, row, role }) => {
  switch (rowType) {
    case "invoices":
      return role === "master" ? (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 200 }}
          style={{ ...styleField.contentWithoutRightBorder }}
        >
          {`${row.User.name} ${row.User.surname}`}
        </TableCell>
      ) : null;
    case "customerDetails":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 100 }}
          style={{
            ...styleField.content,
            textAlign: "center"
          }}
        >
          {row.meadow.replace(".", ",")}
          <span style={{ ...styleField.suffix }}>ha</span>
        </TableCell>
      );
    case "transactions":
      return (
        <DefaultTC>
          {row.gross !== 0 && (
            <NumberFormat
              value={formatNumber(row.gross)}
              displayType={"text"}
              thousandSeparator={" "}
              decimalSeparator={","}
              suffix={" zł"}
            />
          )}
        </DefaultTC>
      );
    default:
      return null;
  }
};
const Field7 = ({ rowType, row }) => {
  switch (rowType) {
    case "customerDetails":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 100 }}
          style={{
            ...styleField.content,
            textAlign: "center"
          }}
        >
          {row.qTractors}
          <span style={{ ...styleField.suffix }}>szt.</span>
        </TableCell>
      );
    case "transactions":
      return (
        <DefaultTC>
          {row.gross !== 0 && (
            <NumberFormat
              value={formatNumber(row.gross)}
              displayType={"text"}
              thousandSeparator={" "}
              decimalSeparator={","}
              suffix={" zł"}
            />
          )}
        </DefaultTC>
      );
    default:
      return null;
  }
};
const Field8 = ({ rowType, row }) => {
  switch (rowType) {
    case "customerDetails":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 100 }}
          style={{
            ...styleField.content,
            textAlign: "center"
          }}
        >
          {row.qHarvesters}
          <span style={{ ...styleField.suffix }}>szt.</span>
        </TableCell>
      );
    case "transactions":
      return (
        <DefaultTC>
          <NumberFormat
            value={formatNumber(row.bonus)}
            displayType={"text"}
            thousandSeparator={" "}
            decimalSeparator={","}
            suffix={" zł"}
          />
        </DefaultTC>
      );
    default:
      return null;
  }
};
const Field9 = ({ rowType, row, role }) => {
  switch (rowType) {
    case "customerDetails":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 100 }}
          style={{
            ...styleField.content,
            textAlign: "center"
          }}
        >
          {row.qCultivators}
          <span style={{ ...styleField.suffix }}>szt.</span>
        </TableCell>
      );
    case "transactions":
      return role === "master" ? (
        <DefaultTC>{`${row.User.name} ${row.User.surname}`}</DefaultTC>
      ) : null;
    default:
      return null;
  }
};
const Field10 = ({ rowType, row, role, conditionOne }) => {
  switch (rowType) {
    case "customerDetails":
      return (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 100 }}
          style={{
            ...styleField.content,
            textAlign: "center"
          }}
        >
          {row.qAgros}
          <span style={{ ...styleField.suffix }}>szt.</span>
        </TableCell>
      );
    case "transactions":
      return conditionOne && role === "master" ? (
        <DefaultTC>{`${row.ChannelTrans.name}`}</DefaultTC>
      ) : null;
    default:
      return null;
  }
};

const Field11 = ({ rowType, row, role }) => {
  switch (rowType) {
    case "customerDetails":
      return role === "master" ? (
        <TableCell
          component="th"
          scope="row"
          padding="none"
          // style={{ width: 140 }}
          style={{
            ...styleField.content,
            textAlign: "center"
          }}
        >
          {row.employee}
        </TableCell>
      ) : null;
    default:
      return null;
  }
};

const formatBonus = bonus => {
  // console.log(bonus, parseFloat(bonus), parseFloat(bonus.replace(",", ".")));
  return parseFloat(bonus.replace(",", "."))
    .toFixed(parseFloat(bonus.replace(",", ".")) % 1 !== 0 ? 2 : 0)
    .toString()
    .replace(".", ",");
};

// const formatBonus = row => {
//   const { bonusType, bonus, suffix } = row;
//   if (bonusType === "% marży") {
//     let result;
//     const bonus100 = bonus * 100;
//     console.log(bonus100.toFixed(2), parseFloat(bonus100.toFixed(2)));
//     if (parseFloat(bonus100.toFixed(2)) % 1 !== 0) {
//       result = `${parseFloat(bonus100)
//         .toFixed(2)
//         .toString()
//         .replace(".", ",")} ${suffix}`;
//     } else {
//       result = `${parseFloat(bonus100.toFixed(2))
//         .toString()
//         .replace(".", ",")} ${suffix}`;
//     }
//     return result;
//   } else if (bonusType === "stawka") {
//     return `${parseFloat(bonus)
//       .toFixed(parseFloat(bonus) % 1 !== 0 ? 2 : 0)
//       .toString()
//       .replace(".", ",")} ${suffix}`;
//   }
//   // return 33;
// };
function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(
  mapStateToProps,
  null
)(Row);
