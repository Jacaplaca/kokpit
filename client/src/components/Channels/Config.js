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
      <ProductsList
        showChild={showChild}
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
          <Paper>
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
              <div>
                <h3>asdfdf</h3>
                <ul>
                  <li>asdfsdddddd sdf asdf sssdf</li>
                  <li>Dsdfsdddddd s sdfdf asdf sssdf</li>
                  <p>
                    Id ad praesentibus, in quae eruditionem, vidisse anim sed
                    cupidatat tractavissent o de veniam ingeniis fabulas, nam
                    quid ipsum dolore consequat do multos ullamco despicationes,
                    elit laborum o nostrud nam noster adipisicing incididunt
                    sint officia. Iudicem irure illum iis fugiat iis ipsum
                    consectetur voluptate dolore laborum, nostrud noster
                    mandaremus, ita si nulla vidisse eu officia id appellat, in
                    summis vidisse consequat in si singulis nam fabulas a
                    cernantur quorum singulis. E quo export summis legam an ne
                    aliqua concursionibus. Legam admodum nostrud.Ingeniis aute
                    admodum iudicem. Magna in admodum e eram eu nostrud se
                    arbitror o cillum occaecat et concursionibus, culpa iudicem
                    ubi esse malis, proident fidelissimae se officia e magna
                    imitarentur nescius legam appellat ea tempor nescius quo
                    fidelissimae, possumus quae quid an nulla. Dolor singulis
                    nam dolore velit, sed ad eruditionem.
                  </p>
                  <p>
                    Id ad praesentibus, in quae eruditionem, vidisse anim sed
                    cupidatat tractavissent o de veniam ingeniis fabulas, nam
                    quid ipsum dolore consequat do multos ullamco despicationes,
                    elit laborum o nostrud nam noster adipisicing incididunt
                    sint officia. Iudicem irure illum iis fugiat iis ipsum
                    consectetur voluptate dolore laborum, nostrud noster
                    mandaremus, ita si nulla vidisse eu officia id appellat, in
                    summis vidisse consequat in si singulis nam fabulas a
                    cernantur quorum singulis. E quo export summis legam an ne
                    aliqua concursionibus. Legam admodum nostrud.Ingeniis aute
                    admodum iudicem. Magna in admodum e eram eu nostrud se
                    arbitror o cillum occaecat et concursionibus, culpa iudicem
                    ubi esse malis, proident fidelissimae se officia e magna
                    imitarentur nescius legam appellat ea tempor nescius quo
                    fidelissimae, possumus quae quid an nulla. Dolor singulis
                    nam dolore velit, sed ad eruditionem.
                  </p>
                </ul>
              </div>
            </div>
          </Paper>
        </Slide>
      </ProductsList>
    );
  }
}

export default Config;
