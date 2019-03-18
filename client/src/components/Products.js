import React from "react";
import FormWithListClicks from "../common/FormWithListClicks";

const Products = () => (
  <FormWithListClicks
    postUrl="/api/item/"
    fetchItemsUrl="api/allitem/channel"
    fetchChannels="/api/table/channels"
    editUrl="/api/item/edit/id/"
    deleteUrl="/api/item/destroy/"
    manyOne="channel"
    manyTwo="item"
    headRow={[
      {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "Towar/Usługa"
      },
      {
        id: "unit",
        numeric: false,
        disablePadding: true,
        label: "Jednostka"
      }
    ]}
    rowType="product"
  />
);

export default Products;
