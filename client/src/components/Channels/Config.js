import React, { Component } from "react";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ChevronRight from "@material-ui/icons/ChevronRight";
// import SimpleProductList from "./SimpleProductList";
import Slide from "@material-ui/core/Slide";
import ProductsList from "../Products/ProductsList";

class Config extends Component {
  // state = { itemsConfig: true };

  render() {
    // const { itemsConfig } = this.state;
    const { data, rowClick, label, showChild, hideChild } = this.props;
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
        >
          <Slide
            direction="left"
            in={showChild}
            mountOnEnter
            unmountOnExit
            timeout={300}
            style={{
              // gridRow: "2 / 4",
              // gridColumn: "2 /4",
              // backgroundColor: "yellow",
              opacity: 0.5,
              // height: 200,
              // width: 222,
              // right: 23,
              // position: "absolute"
              backgroundColor: "green",
              // opacity: 1,
              // height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 23
            }}
          >
            <div
              // elevation={4}
              style={{ display: "grid", gridTemplateColumns: "13px 1fr" }}
            >
              <Button
                onClick={hideChild}
                style={{
                  height: "100%",
                  // backgroundColor: "grey",
                  zIndex: 24
                }}
              >
                <ChevronRight />
              </Button>
              <div>adf</div>
            </div>
          </Slide>
        </ProductsList>
      </Paper>
    );
  }
}

export default Config;
