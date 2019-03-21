import React, { Component } from "react";

import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import * as actions from "../actions";
import MainFrameHOC from "../common/MainFrameHOC";

import FormWithListClicks from "../common/FormWithListClicks";
import Form from "../components/Users/Form";
import EditUserForm from "../components/Users/EditForm";
import ModalWindow from "./ModalWindow";

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

class Users extends Component {
  state = {
    openModal: true,
    editedId: null,
    edit: null
  };

  render() {
    return (
      <FormWithListClicks
        rowClick={id => console.log(id)}
        postUrl="/auth/register"
        fetchItemsUrl="api/allusers/channel"
        fetchChannels="/api/channels"
        editUrl="/auth/user/edit/id/"
        deleteUrl="/api/user/destroy/"
        manyOne="channel"
        manyTwo="user"
        formFields={["name", "surname", "email", "password", "password2"]}
        editFields={["name", "surname", "email", "password", "password2"]}
        headRow={[
          {
            id: "name",
            numeric: false,
            disablePadding: true,
            label: "Imię"
          },
          {
            id: "surname",
            numeric: false,
            disablePadding: true,
            label: "Nazwisko"
          },
          {
            id: "role",
            numeric: false,
            disablePadding: true,
            label: "Rola"
          }
        ]}
        rowType="user"
        modal
      >
        {/* <ModalWindow
          open={this.state.openModal}
          close={this.handleClose}
          maxWidth={900}
        >
        </ModalWindow> */}
        <Form addLabel={"Dodaj"} activity="adding" />
        <EditUserForm addLabel={"Dodaj"} activity="editing" />
      </FormWithListClicks>
    );
  }
}

// export default Users;

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
)(Users);
