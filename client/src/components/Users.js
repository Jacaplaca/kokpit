import React from "react";
import FormWithListClicks from "../common/FormWithListClicks";
import Form from "../components/Users/Form";

const Users = () => (
  <FormWithListClicks
    postUrl="/auth/register"
    fetchItemsUrl="api/allusers/channel"
    fetchChannels="/api/table/channels"
    editUrl="/api/item/edit/id/"
    deleteUrl="/api/item/destroy/"
    manyOne="channel"
    manyTwo="user"
    formFields={["name", "surname", "email", "password", "password2"]}
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
  >
    <Form addLabel={"Dodaj"} />
  </FormWithListClicks>
);

export default Users;
