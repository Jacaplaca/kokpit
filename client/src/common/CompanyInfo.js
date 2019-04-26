import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import SemiButton from "../common/SemiButton";
// import { compose } from "redux";
// import { connect } from "react-redux";
// import MainFrameHOC from "../skins/MainFrameHOC";
// import * as actions from "../actions";

const CompanyInfo = ({ classes, width, open, auth }) => {
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
          // marginTop: 35,
          padding: 7,
          // borderBottom: open ? "1px solid grey" : "0px solid grey",
          textAlign: "center"
        }}
        className={classes.companyBox}
      >
        {auth && (
          <div
            style={{
              // overflow: "hidden",
              // position: "fixed" /* Set the navbar to fixed position */,
              width: open ? width - 10 : 0,
              whiteSpace: "initial",
              display: open ? "inline" : "none",
              fontSize: 14
              // marginTop: 20,
            }}
          >
            <h5>{auth.Company.name}</h5>
            {isImage && (
              <img
                // className={classes.rowImg}
                // src={require(`../images/sample.png`)}
                style={{ maxWidth: 120, maxHeight: 120, padding: 8 }}
                src={require(`../${auth.Company.logo}`)}
              />
            )}
            {/* <h5 style={{ fontWeight: 600 }}>Użytkownik</h5> */}
            <div>
              <div>
                {auth.name} {auth.surname}
              </div>
              <div style={{ padding: 4 }}>
                <SemiButton ver={auth.role === "master" ? "one" : "two"}>
                  {auth.role}
                </SemiButton>
              </div>
              <div>{auth.email}</div>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

const styles = theme => ({
  companyBox: {
    backgroundColor: "white",
    // backgroundColor: lighten(theme.palette.primary.light, 0.8),
    // boxShadow: "0 5px 11px -6px gray",
    // boxShadow: "inset 1px -2px 9px -6px",
    marginBottom: 6
  }
});

export default withStyles(styles, { withTheme: true })(CompanyInfo);
