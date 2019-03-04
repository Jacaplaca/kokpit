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
import InputComponent from "../inputs/InputComponent";

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
    insertedId: 0,
    input2: ""
  };

  // componentWillReceiveProps = nextProps => {
  //   nextProps.fetchUrl !== this.props.fetchUrl &&
  //     this.fetch(nextProps.fetchUrl);
  // };

  handleOpenModal = () => {
    this.setState({ openModal: true });
  };
  handleCloseModal = () => {
    this.setState({ openModal: false });
  };

  addFetchToState = result => {
    this.setState({ edit: result.data });
  };

  handleShowAdd = (showAdd, whatToAdd, id) => {
    const { name } = this.props;
    whatToAdd.length > 0
      ? this.setState({ showAdd, whatToAdd })
      : this.setState({ showAdd: false, whatToAdd });
    this.props.changeValue(name, showAdd, whatToAdd, id);
  };

  render() {
    const {
      showAdd,
      addChannelConfirmation,
      whatToAdd,
      openModal,
      input2
    } = this.state;
    const {
      label,
      modal,
      child,
      children,
      labelOdmieniony,
      disabled,
      field2label,
      field2disabled,
      field2show,
      add,
      confirmation,
      confirmationClose,
      confirmationOpen,
      list
    } = this.props;
    console.log("SelectOrAdd(), add", add);
    const whentToShowAdd = () => {
      if (field2show && showAdd && input2 !== "") {
        // console.log('field2show && showAdd && input2 !== ""');
        return true;
      } else if (!field2show && showAdd) {
        // console.log("!field2show && showAdd");
        return true;
      } else {
        return false;
      }
    };
    return (
      <React.Fragment>
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
            gridTemplateColumns: "1fr 75px 1fr",
            color: "white"
          }}
        >
          <SelectFromDBForAdding
            disabled={disabled}
            showAdd={this.handleShowAdd}
            list={list}
            insertedId={this.state.insertedId}
            label={labelOdmieniony}
          />

          {showAdd && field2show && (
            <InputComponent
              name="input2"
              label={field2label}
              type="text"
              edytuj={input2 => this.setState({ input2 })}
              value={this.state.input2}
              disabled={field2disabled}
            />
          )}
          <div
            style={{
              alignSelf: "center",
              justifySelf: "center",
              fontWeight: "900"
            }}
          >
            {whentToShowAdd() && (
              <ButtonIconCircle
                akcja={() => {
                  modal ? this.handleOpenModal() : confirmationOpen();
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
