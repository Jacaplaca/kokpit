import React, { Component } from "react";
import axios from "axios";
import Paper from "@material-ui/core/Paper";

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

class Channels extends Component {
  state = {
    items: null,
    itemsUnfilter: null,
    channel: " we wszystkich systemach"
  };

  componentWillMount = async () => {
    await this.urlToState(fetchItemsUrl, ["items", "itemsUnfilter"]);
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

  handleRowClick = id => {
    const { itemsUnfilter } = this.state;
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

    // const channel =
    //   filteredItems[0] &&
    //   filteredItems[0].SalesChannels[0] &&
    //   filteredItems[0].SalesChannels[0].name;

    this.setState({
      items: filteredItems,
      channel: ` w ${name}`
    });
  };

  handleClickOnItem = id => {
    console.log("id id", id);
  };

  render() {
    const { items, channel } = this.state;
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(300px, 1fr) 2fr",
          gridGap: "1rem"
        }}
      >
        <div>
          <FormWithListClicks
            rowClick={this.handleRowClick}
            postUrl="/api/channel/"
            fetchItemsUrl="/api/channels"
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
          >
            <ChannelForm addLabel={"Dodaj"} />
          </FormWithListClicks>
        </div>
        <div>
          {items && items.length > 0 && (
            <Config
              data={items}
              rowClick={this.handleClickOnItem}
              label={channel}
            />
          )}
        </div>
      </div>
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
)(Channels);
