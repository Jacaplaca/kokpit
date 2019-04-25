import React from "react";
import Paper from "@material-ui/core/Paper";
import NumberFormat from "react-number-format";
import { greyBackground } from "../../globalStyles";
import {
  onlyUnique,
  podzielUnikalnymi,
  formatNumber,
  addRank,
  sortNumber,
  dynamicSort
} from "../../common/functions";
import SimpleList from "./SimpleList";

const report = (transactions, key) => {
  let report = [];
  let sum = 0;

  let group;
  switch (key) {
    case "channelId":
      group = "ChannelTrans";
      break;
    case "itemId":
      group = "ItemTrans";
      break;
    case "userId":
      group = "User";
      break;
    default:
  }

  for (let channel of podzielUnikalnymi(transactions, key)) {
    let bonuses = 0;
    const values = channel.values;
    let name;
    for (let el of values) {
      name = el[group].surname
        ? `${el[group].name} ${el[group].surname}`
        : el[group].name;
      bonuses = el.bonus + bonuses;
    }
    report.push({ name, bonuses });
    sum = sum + bonuses;
  }
  const rankedReport = addRank(report, "bonuses");
  const reportSorted = rankedReport.sort(dynamicSort("rank"));

  return { list: reportSorted, sum };
};

const Summary = ({ transactions, channelId }) => {
  // const { transactions, show } = props;
  const channel = report(transactions, "channelId");
  const item = report(transactions, "itemId");
  const user = report(transactions, "userId");
  return (
    <div>
      {/* {console.log(createReport(transactions))} */}

      <div
        style={{
          padding: 10,
          textAlign: "center",
          backgroundColor: greyBackground
        }}
      >
        <span>Razem: </span>
        {/* <NumberFormat
          value={formatNumber(sum)}
          displayType={"text"}
          thousandSeparator={" "}
          decimalSeparator={","}
          suffix={" zł"}
        /> */}
        <NumberFormat
          value={formatNumber(channel.sum)}
          displayType={"text"}
          thousandSeparator={" "}
          decimalSeparator={","}
          suffix={" zł"}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: channelId ? "1fr 1fr" : "1fr 1fr 1fr",
          // padding: 10,
          gridGap: 15,
          backgroundColor: greyBackground
        }}
      >
        {!channelId && (
          <RankBox
            title="Kanały/systemy"
            sum={channel.sum}
            list={channel.list}
          />
        )}
        <RankBox title="Pracownicy" sum={user.sum} list={user.list} />
        <RankBox title="Produkty/Usługi" sum={item.sum} list={item.list} />
      </div>
    </div>
  );
};

const RankBox = ({ title, sum, list }) => (
  <Paper
    style={{
      paddingRight: 22,
      paddingTop: 15,
      paddingLeft: 22,
      textAlign: "center"
      // margin: 10
    }}
  >
    <span>{title}</span>
    {/* <NumberFormat
      value={formatNumber(sum)}
      displayType={"text"}
      thousandSeparator={" "}
      decimalSeparator={","}
      suffix={" zł"}
    /> */}
    <SimpleList transactions={list} />
  </Paper>
);

export default Summary;
