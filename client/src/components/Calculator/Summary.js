import React from "react";
import Paper from "@material-ui/core/Paper";
import NumberFormat from "react-number-format";
import {
  onlyUnique,
  podzielUnikalnymi,
  formatNumber
} from "../../common/functions";
import SimpleList from "./SimpleList";

const channels = transactions => {
  let channels = [];
  let sum = 0;
  for (let channel of podzielUnikalnymi(transactions, "channelId")) {
    let bonuses = 0;
    const values = channel.values;
    let name;
    for (let el of values) {
      name = el.ChannelTrans.name;
      bonuses = el.bonus + bonuses;
    }
    channels.push({ name, bonuses });
    sum = sum + bonuses;
  }

  return { list: channels, sum };
};

const items = transactions => {
  let items = [];
  let sum = 0;
  for (let channel of podzielUnikalnymi(transactions, "itemId")) {
    let bonuses = 0;
    const values = channel.values;
    let name;
    for (let el of values) {
      name = el.ItemTrans.name;
      bonuses = el.bonus + bonuses;
    }
    items.push({ name, bonuses });
    sum = sum + bonuses;
  }
  return { list: items, sum };
};

const users = transactions => {
  let users = [];
  let sum = 0;
  for (let channel of podzielUnikalnymi(transactions, "userId")) {
    let bonuses = 0;
    const values = channel.values;
    let name;
    for (let el of values) {
      name = `${el.User.name} ${el.User.surname}`;
      bonuses = el.bonus + bonuses;
    }
    users.push({ name, bonuses });
    sum = sum + bonuses;
  }

  return { list: users, sum };
};

const Summary = props => {
  const { transactions } = props;
  const channel = channels(transactions);
  const item = items(transactions);
  const user = users(transactions);
  return (
    <Paper>
      {/* {console.log(createReport(transactions))} */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
        <NumberFormat
          value={formatNumber(channel.sum)}
          displayType={"text"}
          thousandSeparator={" "}
          decimalSeparator={","}
          suffix={" zł"}
        />
        <SimpleList transactions={channel.list} />
        <SimpleList transactions={item.list} />
        <SimpleList transactions={user.list} />
      </div>
    </Paper>
  );
};

export default Summary;
