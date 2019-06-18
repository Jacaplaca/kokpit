import React from "react";
// import currency from "currency.js";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/RadioButtonUnchecked";
import CheckBoxIcon from "@material-ui/icons/CheckCircle";
import Input from "@material-ui/core/Input";
import ButtonMy from "../../common/ButtonMy";
import SemiButton from "../../common/SemiButton";
import { shorting, formatNumber } from "../../common/functions";
import CurrencyFormat from "../../common/CurrencyFormat";

const styleField = {
  content: {
    paddingRight: 10,
    paddingLeft: 7,
    borderRightStyle: "solid",
    borderRightColor: "rgba(224, 224, 224, 1)",
    borderRightWidth: 1,
    borderBottomWidth: 0
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

const blockCheckbox = (id, role, rowType, accountType) => {
  if (rowType === "user" && accountType !== "demo") {
    return id === 1 && role === "master";
  } else if (rowType === "user" && accountType === "demo") {
    return true;
  }
};

export const FieldCheck = ({
  role,
  channel,
  row,
  iconProps,
  iconPropsOpacity,
  click,
  rowType,
  accountType
}) => (
  <DefaultTC center key={channel.id}>
    <Checkbox
      disabled={blockCheckbox(channel.id, row.role, rowType, accountType)}
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
    case "documents_transactions":
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
      return <DefaultTC>{row.unit}</DefaultTC>;
    case "invoices":
      return <DefaultTC center>{row.termin_platnosci}</DefaultTC>;
    case "channelConfig":
      return <DefaultTC>{row.to}</DefaultTC>;
    case "customerDetails":
      return <DefaultTC>{row.kod}</DefaultTC>;
    case "transactions":
      return <DefaultTC>{row.ItemTrans.name}</DefaultTC>;
    case "documents_transactions":
      return <DefaultTC>{row.documents_nr}</DefaultTC>;
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
          <CurrencyFormat value={row.pozostalo_do_zaplacenia} />
        </DefaultTC>
      );
    case "productsInChannel":
      return <DefaultTC>{row.config}</DefaultTC>;
    case "channelConfig":
      return <DefaultTC>{row.bonusType}</DefaultTC>;
    case "customerDetails":
      return <DefaultTC>{row.city}</DefaultTC>;
    case "transactions":
      return (
        <DefaultTC center>
          <CurrencyFormat value={row.quantity} nosuffix />
          <span
            style={{
              marginLeft: 4,
              fontSize: "0.875em",
              // backgroundColor: "rgb(221, 221, 221)",
              color: "grey",
              // borderRadius: 10,
              padding: 3,
              fontWeight: 700
            }}
          >
            {row.unit}
          </span>
        </DefaultTC>
      );
    case "documents_transactions":
      return (
        <DefaultTC>
          <CurrencyFormat value={row.ammount} />
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
    case "documents_transactions":
      return <DefaultTC>{shorting(row.customer, 30)}</DefaultTC>;
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
    case "documents_transactions":
      return role === "master" ? (
        <DefaultTC>{`${row.User.name} ${row.User.surname}`}</DefaultTC>
      ) : null;
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
          {row.sell !== 0 && <CurrencyFormat value={row.sell} />}
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
          {row.gross !== 0 && <CurrencyFormat value={row.gross} />}
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
          <CurrencyFormat value={row.bonus} />
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
