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
    const { auth, language } = this.props;
    return (
      <Paper>
        <FormWithListClicks
          defaultSort="surname"
          defaultOrder="asc"
          searchColumns={["name", "surname", "email", "nr_telefonu", "role"]}
          rowClick={id => console.log(id)}
          postUrl="/auth/register"
          // fetchItemsUrl="api/allusers/channel"
          fetchItemsUrl="api/modulesclients"
          // includeAs="SalesChannels"
          includeAs="UserModule"
          // fetchChannels="/api/channels"
          fetchChannels="/api/modules"
          editUrl="/auth/user/edit/id/"
          deleteUrl="/api/user/destroy/"
          // manyOne="channel"
          manyOne="module"
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
              textAlign: "center",
              numeric: false,
              disablePadding: true,
              label: getString("ROLE", language)
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
          modal
          labelList={getString("USERS_EDITING", language)}
        >
          {/* <ModalWindow
          open={this.state.openModal}
          close={this.handleClose}
          maxWidth={900}
        >
        </ModalWindow> */}
          <Form
            addLabel={getString("ADD", language)}
            activity="adding"
            auth={auth}
          />
          <EditUserForm
            addLabel={getString("ADD", language)}
            activity="editing"
            auth={auth}
          />
        </FormWithListClicks>
      </Paper>
    );
  }
}

// export default Users;

function mapStateToProps({ auth, language }) {
  return {
    language,
    auth,
    help:
      "Tu możesz dodawać, usuwać oraz edytować użytkowników/pracowników oraz nadawać im uprawnienia do poszczególnych modułów."
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
