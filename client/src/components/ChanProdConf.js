import React, { Component } from "react";
import { Formik } from "formik";

import { connect } from "react-redux";
import { compose } from "redux";
import { startOfMonth, endOfMonth } from "date-fns";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";

import * as actions from "../actions";
import {
  dataToString,
  defineds,
  dynamicSort,
  timeDiff
} from "../common/functions";
import MainFrameHOC from "../common/MainFrameHOC";
//import SiteHeader from "../common/SiteHeader";
import CostsTable from "./CostsTable2Remote";
import ModalWindow from "./ModalWindow";
import CostsForm from "./CostsForm";
import DateRangePickerMy from "../common/DateRangePickerMy";
import CostsPodsumowanie from "./CostsPodsumowanie";
import SerwisForm from "./SerwisForm";
import TransactionList from "./TransactionList";
import AddCircle from "@material-ui/icons/AddCircle";
// import Channels from "../common/inputs/SelectFromDBForAdding";
import ButtonIconCircle from "../common/ButtonIconCircle";
import Confirmation from "./Confirmation";
import SelectOrAdd from "../common/inputs/SelectOrAdd";
import InputComponent from "../common/inputs/InputComponent";
import EditableList from "../common/EditableList";

const styles = theme => ({
  input: {
    display: "flex",
    padding: 0
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  }
});

const channelsFetchUrl = "/api/table/channels";
let itemsFetchUrlBase = `/api/channels/items/`;

class ChanProdConf extends Component {
  state = {
    clickedChannel: 0,
    clickedItem: 0
  };

  handleClickOnRow = (comp, row) => {
    this.setState({ [comp]: row });
  };

  render() {
    const { clickedChannel, clickedItem } = this.state;
    return (
      <React.Fragment>
        <div
          style={{
            marginTop: "1rem",
            display: "grid",
            gridGap: "1rem",
            gridTemplateColumns: "1fr 2fr"
          }}
        >
          <Paper>
            <EditableList
              fetchUrl="/api/table/channels"
              postUrl="/api/sales_channel/"
              editUrl="/api/channel/edit/id/"
              removeUrl="/api/channel/remove/"
              listLabel="Lista kanałów przedaży"
              addLabel="Dodaj kanał sprzedaży"
              clickedRow={clickedChannel}
              clickOnRow={clickedRow =>
                this.handleClickOnRow("clickedChannel", clickedRow)
              }
              addFields={[{ dbField: "name", label: "Nazwa" }]}
            />
          </Paper>
          <Paper>
            <EditableList
              editUrl="/api/channel_item/edit/id/"
              removeUrl="/api/channel_item/remove/"
              disabled={clickedChannel <= 0}
              addLabel="Dodaj produkt lub usługę"
              listLabel="Lista produktów i usług"
              fetchUrl={`/api/channels/items/${clickedChannel}`}
              postUrl={`/api/channel_item/${clickedChannel}`}
              clickedRow={clickedItem}
              clickOnRow={clickedRow =>
                this.handleClickOnRow("clickedItem", clickedRow)
              }
              addFields={[
                { dbField: "name", label: "Nazwa" },
                { dbField: "unit", label: "Jednostka" }
              ]}
            />
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    actions
  ),
  MainFrameHOC
)(ChanProdConf);
