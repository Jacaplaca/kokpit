import React from "react";
import FormWithListClicks from "../common/FormWithListClicks";

const Users = () => (
  <FormWithListClicks
    postUrl="/api/item/"
    fetchItemsUrl="api/allusers/channel"
    fetchChannels="/api/table/channels"
    editUrl="/api/item/edit/id/"
    deleteUrl="/api/item/destroy/"
    manyOne="channel"
    manyTwo="user"
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
  />
);

export default Users;
