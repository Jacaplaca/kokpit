import React from "react";

import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import MainFrameHOC from "../common/MainFrameHOC";

const BonusRules = () => (
  <div>
    Nisi si commodo hic cupidatat quid id officia philosophari id esse de
    offendit sed export, quorum occaecat senserit. Si eram a dolore sed multos
    quo ea fugiat offendit an voluptate do anim ullamco nam officia quae legam
    consequat tamen, ex duis eruditionem, te noster malis id aliquip, ad minim
    quid aute fabulas, anim hic nam tempor ullamco. Sed esse sempiternum.Anim
    nam hic irure nostrud. Sed quorum proident do ad mentitum ubi aliquip. Quis
    vidisse e concursionibus.
  </div>
);

const styles = theme => ({});

function mapStateToProps({ auth }) {
  return {
    auth
  };
}

export default compose(
  withStyles(styles, { withTheme: true }),
  connect(
    mapStateToProps,
    null
  ),
  MainFrameHOC
)(BonusRules);
