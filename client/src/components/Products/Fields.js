import React from "react";
import currency from "currency.js";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import NumberFormat from "react-number-format";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/RadioButtonUnchecked";
import CheckBoxIcon from "@material-ui/icons/CheckCircle";
import Input from "@material-ui/core/Input";
import ButtonMy from "../../common/ButtonMy";
import SemiButton from "../../common/SemiButton";
import { shorting, formatNumber } from "../../common/functions";

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

export const FieldCheck = ({
  role,
  channel,
  row,
  iconProps,
  iconPropsOpacity,
  click
}) => (
  <DefaultTC center key={channel.id}>
    <Checkbox
      disabled={channel.id === 1 && row.role === "master"}
      checked={row[channel.id] === 1}
      icon={<CheckBoxOutlineBlankIcon {...iconPropsOpacity} />}
      checkedIcon={<CheckBoxIcon {...iconProps} />}
      onClick={click}
    />
  </DefaultTC>
);

export const Field1 = ({
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
        <DefaultTC>
          <Input
            inputProps={{
              style: { fontSize: 13, width: "100%" }
            }}
            name={"name"}
            type="text"
            value={values["name"]}
            onChange={e => change("name", e.target.value, "editing")}
          />
        </DefaultTC>
      ) : (
        <DefaultTC>{row.name}</DefaultTC>
      );
    case "channel":
      return editedId === row.id ? (
        <DefaultTC>
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
        </DefaultTC>
      ) : (
        <DefaultTC>{row.name}</DefaultTC>
      );
    // break;
    case "user":
      return <DefaultTC>{row.name}</DefaultTC>;
    case "productsInChannel":
      return <DefaultTC>{row.name}</DefaultTC>;
    case "invoices":
      return <DefaultTC>{row.nr_pelny}</DefaultTC>;
    case "channelConfig":
      return <DefaultTC>{row.from}</DefaultTC>;
    case "customerDetails":
      return <DefaultTC>{row.name}</DefaultTC>;
    case "transactions":
      return <DefaultTC>{row.date}</DefaultTC>;
    default:
      return null;
  }
};
export const Field2 = ({
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
        <DefaultTC center>
          <Input
            // inputProps={{ style: { fontSize: 13 } }}
            inputProps={{
              style: { fontSize: 13, width: "100%" }
            }}
            type="text"
            value={values["unit"]}
            onChange={e => change("unit", e.target.value, "editing")}
          />
          <ButtonMy onClick={submit} disabled={disableSubmit}>
            Ok
          </ButtonMy>
        </DefaultTC>
      ) : (
        <DefaultTC center>{row.unit}</DefaultTC>
      );
    // break;
    case "user":
      return <DefaultTC>{row.surname}</DefaultTC>;
    case "productsInChannel":
      return <DefaultTC>{row.config}</DefaultTC>;
    case "invoices":
      return <DefaultTC center>{row.termin_platnosci}</DefaultTC>;
    case "channelConfig":
      return <DefaultTC>{row.to}</DefaultTC>;
    case "customerDetails":
      return <DefaultTC>{row.surname}</DefaultTC>;
    case "transactions":
      return <DefaultTC>{row.ItemTrans.name}</DefaultTC>;
    default:
      return null;
  }
};

export const Field3 = ({ rowType, row }) => {
  switch (rowType) {
    case "product":
      return null;
    // break;
    case "user":
      return (
        <DefaultTC center>
          <SemiButton ver={row.role === "master" ? "one" : "two"}>
            {row.role}
          </SemiButton>
        </DefaultTC>
      );
    case "invoices":
      return (
        <DefaultTC>
          {`${currency(row.pozostalo_do_zaplacenia, {
            separator: " ",
            decimal: ","
          }).format()} zł`}
        </DefaultTC>
      );
    case "channelConfig":
      return <DefaultTC>{row.bonusType}</DefaultTC>;
    case "customerDetails":
      return <DefaultTC>{row.address}</DefaultTC>;
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

export const Field4 = ({ rowType, row }) => {
  switch (rowType) {
    case "user":
      return <DefaultTC center>{row.email}</DefaultTC>;
    case "invoices":
      return <DefaultTC>{row.klient}</DefaultTC>;
    case "channelConfig":
      return <DefaultTC>{`${formatBonus(row.bonus)} ${row.suffix}`}</DefaultTC>;
    case "customerDetails":
      return <DefaultTC center>{row.phone}</DefaultTC>;
    case "transactions":
      return (
        <DefaultTC>{shorting(row.Places ? row.Places.name : "", 30)}</DefaultTC>
      );
    default:
      return null;
  }
};

export const Field5 = ({ rowType, row, role }) => {
  switch (rowType) {
    case "invoices":
      return <DefaultTC center>{row.overdue}</DefaultTC>;
    case "customerDetails":
      return (
        <DefaultTC center>
          {row.field.replace(".", ",")}
          <span style={{ ...styleField.suffix }}>ha</span>
        </DefaultTC>
      );
    case "transactions":
      return <DefaultTC>{row.customer}</DefaultTC>;
    default:
      return null;
  }
};
export const Field6 = ({ rowType, row, role }) => {
  switch (rowType) {
    case "invoices":
      return role === "master" ? (
        <DefaultTC>{`${row.User.name} ${row.User.surname}`}</DefaultTC>
      ) : null;
    case "customerDetails":
      return (
        <DefaultTC center>
          {row.meadow.replace(".", ",")}
          <span style={{ ...styleField.suffix }}>ha</span>
        </DefaultTC>
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
export const Field7 = ({ rowType, row }) => {
  switch (rowType) {
    case "customerDetails":
      return (
        <DefaultTC center>
          {row.qTractors}
          <span style={{ ...styleField.suffix }}>szt.</span>
        </DefaultTC>
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
export const Field8 = ({ rowType, row }) => {
  switch (rowType) {
    case "customerDetails":
      return (
        <DefaultTC center>
          {row.qHarvesters}
          <span style={{ ...styleField.suffix }}>szt.</span>
        </DefaultTC>
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
export const Field9 = ({ rowType, row, role }) => {
  switch (rowType) {
    case "customerDetails":
      return (
        <DefaultTC center>
          {row.qCultivators}
          <span style={{ ...styleField.suffix }}>szt.</span>
        </DefaultTC>
      );
    case "transactions":
      return role === "master" ? (
        <DefaultTC>{`${row.User.name} ${row.User.surname}`}</DefaultTC>
      ) : null;
    default:
      return null;
  }
};
export const Field10 = ({ rowType, row, role, conditionOne }) => {
  switch (rowType) {
    case "customerDetails":
      return (
        <DefaultTC center>
          {row.qAgros}
          <span style={{ ...styleField.suffix }}>szt.</span>
        </DefaultTC>
      );
    case "transactions":
      return conditionOne && role === "master" ? (
        <DefaultTC>{`${row.ChannelTrans.name}`}</DefaultTC>
      ) : null;
    default:
      return null;
  }
};

export const Field11 = ({ rowType, row, role }) => {
  switch (rowType) {
    case "customerDetails":
      return role === "master" ? (
        <DefaultTC center>{row.employee}</DefaultTC>
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
