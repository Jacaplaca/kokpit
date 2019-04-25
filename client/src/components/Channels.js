import React, { Component } from "react";
import axios from "axios";
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import * as actions from "../actions";
import MainFrameHOC from "../common/MainFrameHOC";
import FormWithListClicks from "../common/FormWithListClicks";
import ChannelForm from "../components/Channels/ChannelForm";
import Config from "../components/Channels/Config";

// import Test from "../components/Products/Test";
const fetchItemsUrl = "api/allitem/channel";
const fetchConfigsUrl = "api/channel_config/";
const styles = theme => ({
  input: {
    display: "flex",
    padding: 0
  },
  placeholder: {
    position: "absolute",
    left: 2,
    fontSize: 16
  },
  tooltip: {
    color: "lightblue",
    backgroundColor: "green"
  }
});

class Channels extends Component {
  state = {
    items: null,
    itemsUnfilter: null,
    channel: " we wszystkich systemach",
    itemsConfig: false,
    itemName: "",
    channelName: "",
    clickedChannel: null,
    clickedItem: null
  };

  componentWillMount = async () => {
    await this.urlToState(fetchItemsUrl, ["items", "itemsUnfilter"]);
    // this.fetchItemsAndConfigs()
  };

  fetchItemsAndConfigs = async () => {
    const items = await fetch(fetchItemsUrl);
  };

  urlToState = async (url, names) => {
    const result = await this.fetch(url);
    // console.log("list", JSON.stringify(list));
    for (let name of names) {
      this.setState({
        [name]: result
      });
    }
  };

  fetch = async url => {
    const list = await axios.get(url);
    return list.data;
    // return list.data.sort(dynamicSort("name"));
  };

  handleRowClick = (comp, id) => {
    console.log("handleRowClick", comp, id);

    this.handleClickOnRow(comp, id);
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

  handleClickOnRow = async (comp, id) => {
    console.log("handleClickOnRow", comp, id);
    this.setState({ [comp]: id });
    const { itemsUnfilter } = this.state;
    if (comp === "clickedChannel") {
      let filteredItems = [];
      let name;
      for (let item of itemsUnfilter) {
        const channels = item.SalesChannels;
        for (let channel of channels) {
          if (channel.id === id) {
            name = channel.name;
            filteredItems.push(item);
          }
        }
      }
      const configs = await this.fetch(`${fetchConfigsUrl}${id}`);
      // console.log("configs", configs);
      let itemsWithLastConfig = [];
      for (let item of filteredItems) {
        const itemLastConfig = configs.filter(x => item.id === x.itemId);
        const itemWithConfig =
          itemLastConfig.length > 0
            ? Object.assign(item, {
                config: `${itemLastConfig[0].from} - ${itemLastConfig[0].to} ${
                  itemLastConfig[0].bonusType
                } ${
                  itemLastConfig[0].suffix === "%"
                    ? `${parseFloat(itemLastConfig[0].bonus) * 100}`.replace(
                        ".",
                        ","
                      )
                    : `${parseFloat(itemLastConfig[0].bonus)}`.replace(".", ",")
                }${itemLastConfig[0].suffix} `
              })
            : Object.assign(item, { config: "Brak konfiguracji" });
        itemsWithLastConfig.push(itemWithConfig);
      }

      // console.log("items", filteredItems);
      // console.log(itemsWithLastConfig);
      this.setState(
        {
          items: [],
          channel: ` w ${name}`,
          channelName: name
        },
        () => this.setState({ items: itemsWithLastConfig })
      );

      this.hideItemsConfig();
    } else if (comp === "clickedItem") {
      if (id === this.state.clickedItem) {
        this.switchItemsConfig();
      } else {
        this.showItemsConfig();
      }
      const itemName = itemsUnfilter.filter(item => item.id === id)[0].name;
      this.setState({ itemName });
    }
  };

  fetchedItemsCallback = values => {
    console.log("values", values);
    values.length > 0 && this.handleClickOnRow("clickedChannel", values[0].id);
  };

  // handleClickOnItem = id => {
  //   console.log("id id", id);
  // };

  render() {
    const {
      items,
      channel,
      itemsConfig,
      clickedChannel,
      clickedItem,
      itemsUnfilter,
      itemName,
      channelName
    } = this.state;
    return (
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "400px minmax(max-content, auto)",
            gridGap: "1rem",
            gridTemplateRows: "1fr",
            marginTop: 10
            // minHeight: "70vh"
          }}
        >
          {itemsUnfilter && (
            <Paper>
              <FormWithListClicks
                items={values => this.fetchedItemsCallback(values)}
                rowClick={id => this.handleClickOnRow("clickedChannel", id)}
                postUrl="/api/channel/"
                fetchItemsUrl="/api/channels"
                clicked={clickedChannel}
                //fetchChannels="/api/table/channels"
                editUrl="/api/channel/edit/id/"
                deleteUrl="/api/channel/destroy/"
                manyOne="channel"
                manyTwo="item"
                formFields={["name"]}
                editFields={["name"]}
                headRow={[
                  {
                    id: "name",
                    numeric: false,
                    disablePadding: true,
                    label: "Towar/Usługa"
                  }
                  // {
                  //   id: "unit",
                  //   numeric: false,
                  //   disablePadding: true,
                  //   label: "Jednostka"
                  // }
                ]}
                rowType="channel"
                labelList="Kanały/systemy premiowe"
              >
                <ChannelForm addLabel={"Dodaj"} />
              </FormWithListClicks>
            </Paper>
          )}
          <div style={{ height: "100%" }}>
            <Config
              data={items}
              rowClick={id =>
                clickedChannel && this.handleClickOnRow("clickedItem", id)
              }
              label={channel}
              showChild={itemsConfig}
              hideChild={this.hideItemsConfig}
              channelId={clickedChannel}
              itemId={clickedItem}
              channelName={channelName}
              itemName={itemName}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return {
    auth,
    help: `W lewym panelu możesz zarządzać systemami prowizyjnymi, dodawać je,
          edytować i usuwać. Po prawej stronie możesz konfigurować premie dla
          poszczególnych produktów, usług lub innych promowanych aktywności.\nAby skonfigurować system wystarczy najpierw dopisać do niego produkty w
          zakładce "Produkty", następnie w obecnej zakładce kliknąć na dany
          system/kanał sprzedaży i wybrać produkt. Pojawi się okno, w którym
          będziesz mógł wybrać czas trwania promocji oraz sposób wynagradzania %
          marży lub płaską stawkę.`
  };
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    actions
  ),
  MainFrameHOC
)(Channels);
