import { connect } from "react-redux";
import * as actions from "../actions";

const ShowLinkToComp = ({ children, auth, comp }) => {
  return auth && auth[comp] ? children : null;
};

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(
  mapStateToProps,
  actions
)(ShowLinkToComp);
