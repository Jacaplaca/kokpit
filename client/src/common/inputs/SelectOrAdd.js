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

import * as actions from "../../actions";
import {
  dataToString,
  defineds,
  dynamicSort,
  timeDiff
} from "../../common/functions";
// import MainFrameHOC from "../common/MainFrameHOC";
//import SiteHeader from "../common/SiteHeader";
import ModalWindow from "../../components/ModalWindow";

import AddCircle from "@material-ui/icons/AddCircle";
import SelectFromDBForAdding from "./SelectFromDBForAdding";
import ButtonIconCircle from "../ButtonIconCircle";
import Confirmation from "../../components/Confirmation";

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

class SelectOrAdd extends Component {
  state = {
    openModal: false,

    addChannelConfirmation: false,
    showAdd: false,
    whatToAdd: "",
    list: [],
    insertedId: 0
  };

  componentWillReceiveProps = nextProps => {
    nextProps.fetchUrl !== this.props.fetchUrl &&
      this.fetch(nextProps.fetchUrl);
  };

  componentWillMount = async () => {
    await this.fetch(this.props.fetchUrl);
  };

  handleOpenModal = () => {
    this.setState({ openModal: true });
  };
  handleCloseModal = () => {
    this.setState({ openModal: false });
  };

  addFetchToState = result => {
    this.setState({ edit: result.data });
  };

  handleOpenConfirmation = module => {
    this.setState({ [module]: true });
  };

  handleCloseConfirmation = module => {
    this.setState({ [module]: false });
  };

  handleShowAdd = (showAdd, whatToAdd, id) => {
    whatToAdd.length > 0
      ? this.setState({ showAdd, whatToAdd })
      : this.setState({ showAdd: false, whatToAdd });
    this.props.changeId(id);
  };

  handleAdd = async e => {
    let url = "/api/sales_channel/";
    e.preventDefault();
    const { whatToAdd } = this.state;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        name: `${whatToAdd.charAt(0).toUpperCase()}${whatToAdd.slice(1)}`
      })
    });
    this.handleCloseConfirmation("addChannelConfirmation");
    this.fetch(this.props.fetchUrl);
    const response = await resp.json();
    this.setState({ insertedId: response.id });
  };

  fetch = url => {
    axios.get(url).then(result => {
      const list = result.data.sort(dynamicSort("name"));
      console.log("list", list);
      this.setState({ list, isLoading: false });
    });
  };

  render() {
    const {
      showAdd,
      addChannelConfirmation,
      whatToAdd,
      openModal
    } = this.state;
    const { label, modal, child, children, labelOdmieniony } = this.props;
    return (
      <React.Fragment>
        <Confirmation
          open={addChannelConfirmation}
          close={() => this.handleCloseConfirmation("addChannelConfirmation")}
          action={this.handleAdd}
          komunikat={`Czy jesteś pewny że chcesz dodać ${labelOdmieniony} ${whatToAdd}?`}
        />
        <ModalWindow
          open={openModal}
          close={this.handleCloseModal}
          maxWidth={900}
        >
          {children}
        </ModalWindow>
        <div
          style={{
            display: "grid",
            gridGap: "1rem",
            gridTemplateColumns: "1fr 75px",
            color: "white"
          }}
        >
          <SelectFromDBForAdding
            showAdd={this.handleShowAdd}
            list={this.state.list}
            insertedId={this.state.insertedId}
            label={labelOdmieniony}
          />
          <div
            style={{
              alignSelf: "center",
              justifySelf: "center",
              fontWeight: "900"
            }}
          >
            {showAdd && (
              <ButtonIconCircle
                akcja={() => {
                  modal
                    ? this.handleOpenModal()
                    : this.handleOpenConfirmation("addChannelConfirmation");
                }}
              >
                <AddCircle />
              </ButtonIconCircle>
            )}
          </div>
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
  )
  // MainFrameHOC
)(SelectOrAdd);
