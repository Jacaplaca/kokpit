import React from "react";
import Paper from "@material-ui/core/Paper";

import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import * as actions from "../actions";
import MainFrameHOC from "../common/MainFrameHOC";

import FormWithListClicks from "../common/FormWithListClicks";
import ProductForm from "../components/Products/ProductForm";
// import Test from "../components/Products/Test";

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

const Products = () => (
  <Paper>
    <FormWithListClicks
      rowClick={id => console.log(id)}
      postUrl="/api/item/"
      includeAs="SalesChannels"
      fetchItemsUrl="api/allitem/channel"
      fetchChannels="/api/channels"
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
      labelList="Produkty/usługi w systemach premiowych"
    >
      <ProductForm addLabel={"Dodaj"} />
    </FormWithListClicks>
  </Paper>
);

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
)(Products);
