import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
// import SimpleProductList from "./SimpleProductList";
import ProductsList from "../Products/ProductsList";

class Config extends Component {
  render() {
    const { data, rowClick, label } = this.props;
    return (
      <Paper>
        {/* <SimpleProductList data={data} /> */}
        <ProductsList
          disableEdit
          disableDelete
          // clickOnChannel={this.handleClickOnChannel}
          // delete={this.handleDelete}
          transactions={data}
          // headCols={this.state.channels}
          // edit={this.handleEdit}
          clickOnRow={rowClick}
          // editedId={editedId}
          // change={this.handleChange}
          // values={editing}
          // value={value}
          // disableSubmit={disableSubmit["editing"]}
          // onSubmit={this.handleSubmit}
          labelList={`Lista produktów/usług ${label}`}
          rowType={"productsInChannel"}
          headCols={[]}
          headRow={[
            {
              id: "name",
              numeric: false,
              disablePadding: true,
              label: "Nazwa"
            }
            // {
            //   id: "unit",
            //   numeric: false,
            //   disablePadding: true,
            //   label: "Jednostka"
            // }
          ]}
        />
      </Paper>
    );
  }
}

export default Config;
