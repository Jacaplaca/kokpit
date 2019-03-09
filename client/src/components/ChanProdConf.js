import React, { Component } from "react";
import { Formik } from "formik";

import { connect } from "react-redux";
import { compose } from "redux";
import { startOfMonth, endOfMonth } from "date-fns";

import Slide from "@material-ui/core/Slide";
import axios from "axios";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import ChevronRight from "@material-ui/icons/ChevronRight";

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
import ItemsConfig from "./ChannelsProdConfig/ItemsConfig";

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

class ChanProdConf extends Component {
  state = {
    clickedChannel: 1,
    clickedItem: 1,
    itemsConfig: false
  };

  showItemsConfig = () => {
    this.setState(state => ({ itemsConfig: true }));
  };

  hideItemsConfig = () => {
    this.setState(state => ({ itemsConfig: false }));
  };

  switchItemsConfig = () => {
    this.setState(state => ({ itemsConfig: !state.itemsConfig }));
  };

  handleClickOnRow = (comp, row) => {
    this.setState({ [comp]: row });
    if (comp === "clickedChannel") {
      this.hideItemsConfig();
    } else if (comp === "clickedItem") {
      if (row === this.state.clickedItem) {
        this.switchItemsConfig();
      } else {
        this.showItemsConfig();
      }
    }
  };

  render() {
    const { clickedChannel, clickedItem, itemsConfig } = this.state;
    return (
      <React.Fragment>
        <div
          style={{
            marginTop: "1rem",
            display: "grid",
            gridGap: "1rem",
            gridTemplateColumns: "1fr 2fr",
            gridTemplateRows: "100%",
            minHeight: "82vh"
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
              addFields={[{ dbField: "name", label: "Nazwa", type: "string" }]}
              validate={["name"]}
            />
          </Paper>
          {/* <Paper> */}
          <EditableList
            switchSomething={this.showItemsConfig}
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
              { dbField: "name", label: "Nazwa", type: "string" },
              { dbField: "unit", label: "Jednostka", type: "string" }
            ]}
            validate={["name", "unit"]}
          >
            <Slide
              direction="left"
              in={itemsConfig}
              mountOnEnter
              unmountOnExit
              timeout={500}
              style={{
                // gridRow: "2 / 4",
                // gridColumn: "2 /4",
                // backgroundColor: "yellow",
                // opacity: 0.5,
                // height: 200,
                // width: 222,
                // right: 23,
                // position: "absolute"
                // backgroundColor: "green",
                opacity: 1,
                height: "100%",
                width: "100%",
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 23
              }}
            >
              <Paper
                elevation={4}
                style={{ display: "grid", gridTemplateColumns: "13px 1fr" }}
              >
                {/* <ItemsConfig
                  showId={clickedItem}
                  fetchUrl={`/api/channel_config/item/id/${clickedItem}/`}
                /> */}
                <Button
                  onClick={this.hideItemsConfig}
                  style={{
                    height: "100%",
                    // backgroundColor: "grey",
                    zIndex: 24
                  }}
                >
                  <ChevronRight />
                </Button>
                <EditableList
                  fetchUrl={`/api/channel_config/item/id/${clickedItem}/`}
                  postUrl="/api/channels_config/"
                  editUrl="/api/channel_config/edit/id/"
                  removeUrl="/api/channel_config/remove/"
                  listLabel="Lista kanałów przedaży"
                  addLabel="Dodaj kanał sprzedaży"
                  clickedRow={clickedItem}
                  clickOnRow={clickedRow =>
                    this.handleClickOnRow("clickedConfigMonth", clickedRow)
                  }
                  addFields={[
                    {
                      dbField: "month",
                      label: "Miesiąc",
                      month: true,
                      type: "date"
                    },
                    {
                      dbField: "bonusType",
                      label: "Typ prowizji",
                      select: ["stawka", "% marży"],
                      type: "select"
                    },
                    {
                      dbField: "bonus",
                      label: "Wysokość prowizji",
                      number: true,
                      type: "number",
                      suffixDynamic: "bonusType",
                      suffix: [
                        { field: "stawka", add: "zł" },
                        { field: "% marży", add: "%" }
                      ]
                    }
                  ]}
                  validate={["bonusType", "bonus"]}
                />
              </Paper>
            </Slide>
          </EditableList>
          {/* </Paper> */}
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
