import { connect } from "react-redux";
import * as actions from "../actions";

const compAllowed = (comps, comp) => {
  if (Array.isArray(comps)) {
    return comps.filter(x => x.comp === comp).length > 0
  } return false
}

const ShowLinkToComp = ({ children, auth, comp }) => {
  // console.log("ShowLinkToComp", auth && auth[comp] ? children : null);
  return auth && (compAllowed(auth.UserModule, comp) || !comp)
    ? children
    : null;
  // return auth && auth[comp] ? children : null;
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(
  mapStateToProps,
  actions
)(ShowLinkToComp);
