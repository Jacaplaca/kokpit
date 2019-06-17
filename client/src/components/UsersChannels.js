import React, { Component } from "react";

import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import * as actions from "../actions";
import MainFrameHOC from "../common/MainFrameHOC";
import Paper from "@material-ui/core/Paper";
import FormWithListClicks from "../common/FormWithListClicks";
import Form from "../components/Users/Form";
import EditUserForm from "../components/Users/EditForm";
import ModalWindow from "./ModalWindow";
import { getString } from "../translate";

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
    const { language } = this.props;
    return (
      <div>
        <Paper>
          <FormWithListClicks
            searchColumns={["name", "surname", "email", "role"]}
            rowClick={id => console.log(id)}
            postUrl="/auth/register"
            fetchItemsUrl="api/allusers/channel"
            fetchChannels="/api/channels"
            includeAs="SalesChannels"
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
                label: getString("NAME", language)
              },
              {
                id: "surname",
                numeric: false,
                disablePadding: true,
                label: getString("SURNAME", language)
              },
              {
                id: "role",
                numeric: false,
                disablePadding: true,
                label: getString("ROLE", language),
                textAlign: "center"
              },
              {
                id: "email",
                numeric: false,
                disablePadding: true,
                label: "Email",
                textAlign: "center"
              }
            ]}
            rowType="user"
            disableDelete
            disableEdit
            labelList={getString("USERS_IN_SYSTEMS_TABLE_TITLE", language)}
            modal
          >
            {/* <ModalWindow
          open={this.state.openModal}
          close={this.handleClose}
          maxWidth={900}
        >
        </ModalWindow> */}
            {/* <Form addLabel={"Dodaj"} activity="adding" /> */}
            {/* <EditUserForm addLabel={"Dodaj"} activity="editing" /> */}
          </FormWithListClicks>
        </Paper>
      </div>
    );
  }
}

// export default Users;

function mapStateToProps({ auth, language }) {
  return {
    language,
    auth,
    help: `Tu możesz dopisywać pracowników do kanałów sprzedaży/systemów
          prowizyjnych. Aby zacząć to robić należy wcześniej dodać przynajmniej
          jeden system prowizyjny.`
  };
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    actions
  ),
  MainFrameHOC
)(Users);
