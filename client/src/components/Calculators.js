import React, { Component } from "react";

import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import { connect } from "react-redux";
import { compose } from "redux";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";

import * as actions from "../actions";
// import { defineds } from "../common/functions";
import MainFrameHOC from "../common/MainFrameHOC";
import Caluculator from "./Calculator/Calculator";
//import SiteHeader from "../common/SiteHeader";
// import ModalWindow from "./ModalWindow";
// import DateRangePickerMy from "../common/DateRangePickerMy";
// import SerwisForm from "./SerwisForm";
// import TransactionList from "./TransactionList";

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
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

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

class Calculators extends Component {
  state = {
    channels: null,
    presentation: false,
    // transactions: [],
    // transactionsUnfiltered: [],
    // openModal: false,
    // editedId: null,
    // edit: null,
    // rangeselection: {
    //   startDate: defineds.startOfMonth,
    //   endDate: defineds.endOfMonth,
    //   key: "rangeselection"
    // },
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleSwitch = name => event => {
    console.log("switch", name, event);
    this.setState({ [name]: event.target.checked });
  };

  componentWillMount = async () => {
    const {
      auth: { role }
    } = this.props;
    role === "master"
      ? await this.fetchAllChannels()
      : await this.fetchChannels();
  };

  fetchAllChannels = async () => {
    const channels = await axios.get(`/api/channels`);
    this.setState({ channels: channels.data });
  };

  fetchChannels = async () => {
    const channels = await axios.get(`/api/channelusers`);
    this.setState({ channels: channels.data });
  };

  render() {
    const { classes } = this.props;
    const { value, channels, presentation } = this.state;
    return (
      <div className={classes.root}>
        <AppBar
          position="static"
          color="default"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 150px",
            alignItems: "end"
          }}
        >
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label={"Wszystko"} />
            {channels &&
              [...channels].map((channel, i) => (
                <Tab key={i} label={channel.name} />
              ))}
          </Tabs>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={presentation}
                  onChange={this.handleSwitch("presentation")}
                  value="presentation"
                />
              }
              label={presentation ? "Edycja" : "Prezentacja"}
            />
          </FormGroup>
        </AppBar>
        {value === 0 && <Caluculator channelId={0} show={presentation} />}
        {channels &&
          [{ id: 0, name: "Wszystko" }, ...channels].map(
            (channel, i) =>
              value === i &&
              value !== 0 && (
                <Caluculator channelId={channel.id} show={presentation} />
              )
          )}
        {/* {value === 0 && <TabContainer>Item One</TabContainer>}
        {value === 1 && <TabContainer>Item Two</TabContainer>}
        {value === 2 && <TabContainer>Item Three</TabContainer>}
        {value === 3 && <TabContainer>Item Four</TabContainer>}
        {value === 4 && <TabContainer>Item Five</TabContainer>}
        {value === 5 && <TabContainer>Item Six</TabContainer>}
        {value === 6 && <TabContainer>Item Seven</TabContainer>} */}
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
)(Calculators);
