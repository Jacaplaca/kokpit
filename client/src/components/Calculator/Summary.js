import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import Paper from "@material-ui/core/Paper";
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
import { getString } from "../../translate";
import CurrencyFormat from "../../common/CurrencyFormat";

const report = (transactions, key) => {
  let report = [];
  let sum = 0;

  let group;
  switch (key) {
    case "channelId":
      group = "ChannelTrans";
      break;
    case "nameAndChannel":
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

const modTrans = transactions =>
  transactions.map(x =>
    Object.assign(x, {
      nameAndChannel: `${x.name} (${x.ChannelTrans.name})`,
      ItemTrans: Object.assign(x.ItemTrans, {
        name: `${x.name} (${x.ChannelTrans.name})`
      })
    })
  );

const Summary = ({ transactions, channelId, language, auth }) => {
  // const { transactions, show } = props;
  const modedTrans = modTrans(transactions);
  const channel = report(modedTrans, "channelId");
  const item = report(modedTrans, "nameAndChannel");
  const user = report(modedTrans, "userId");
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
        <span>{getString("CALCULATORS_SUMMARY_SUM", language)}: </span>
        <CurrencyFormat value={channel.sum} />
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
            title={getString("CALCULATORS_SUMMARY_SYSTEMS", language)}
            sum={channel.sum}
            list={channel.list}
          />
        )}
        <RankBox
          title={getString("CALCULATORS_SUMMARY_USERS", language)}
          sum={user.sum}
          list={user.list}
        />
        <RankBox
          title={getString("CALCULATORS_SUMMARY_ITEMS", language)}
          sum={item.sum}
          list={item.list}
        />
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
    <SimpleList transactions={list} />
  </Paper>
);

function mapStateToProps({ language, auth }) {
  return { language, auth };
}

export default connect(
  mapStateToProps,
  null
)(Summary);
