import React from "react";
import Paper from "@material-ui/core/Paper";
import FormWithListClicks from "../common/FormWithListClicks";
import ProductForm from "../components/Products/ProductForm";
// import Test from "../components/Products/Test";

const Products = () => (
  <FormWithListClicks
    postUrl="/api/item/"
    fetchItemsUrl="api/allitem/channel"
    fetchChannels="/api/table/channels"
    editUrl="/api/item/edit/id/"
    deleteUrl="/api/item/destroy/"
    manyOne="channel"
    manyTwo="item"
    formFields={["name", "unit"]}
    editFields={["name", "unit"]}
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
  >
    <ProductForm addLabel={"Dodaj"} />
  </FormWithListClicks>
);

export default Products;
