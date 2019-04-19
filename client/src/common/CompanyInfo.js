import React from "react";
// import { withStyles } from "@material-ui/core/styles";
// import { compose } from "redux";
// import { connect } from "react-redux";
// import MainFrameHOC from "../skins/MainFrameHOC";
// import * as actions from "../actions";

const CompanyInfo = ({ width, open, auth }) => {
  let isImage = false;
  try {
    var image = require(`../${auth.Company.logo}`);
    isImage = true;
    // do stuff
    // console.log("img ok");
  } catch (e) {
    // console.log("e", e);
    isImage = false;
    // console.log(ex);
  }

  return (
    <React.Fragment>
      <div
        // className={classes.root}
        style={{
          // backgroundColor: "red",
          marginTop: 35,
          padding: 7,
          borderTop: open ? "1px solid grey" : "0px solid grey"
        }}
      >
        <div
          style={{
            // overflow: "hidden",
            // position: "fixed" /* Set the navbar to fixed position */,
            width: open ? width - 10 : 0,
            whiteSpace: "initial",
            display: open ? "inline" : "none",
            fontSize: 14
            // marginTop: 20
          }}
        >
          {isImage && (
            <img
              // className={classes.rowImg}
              // src={require(`../images/sample.png`)}
              src={require(`../${auth.Company.logo}`)}
            />
          )}
          <h5 style={{ fontWeight: 600 }}>CompanyInfo</h5>
          <p>
            tel 8743598432
            <br />
            info@asdfsdf.pl
          </p>
        </div>
      </div>
    </React.Fragment>
  );
};

export default CompanyInfo;
