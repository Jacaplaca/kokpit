import React from "react";

// import Probny from "../components/Probny";

// import { createStore, applyMiddleware } from "redux";
// // import { composeWithDevTools } from "redux-devtools-extension";
// import reduxThunk from "redux-thunk";
// //
// import reducers from "../reducers";
//
// // const store = createStore(reducers, {}, composeWithDevTools((applyMiddleware(reduxThunk)));
// const store = createStore(
//   reducers,
//   composeWithDevTools(
//     applyMiddleware(reduxThunk)
//     // other store enhancers if any
//   )
// );
//
import { Provider } from "react-redux";
import store from "../store";

// const store = createStore(reducers, applyMiddleware(reduxThunk));
// import axios from "axios";
import {
  render
  // renderIntoDocument,
  // fireEvent,
  // cleanup,
  // waitForElement
} from "react-testing-library";
//
import ChanProdConf from "../components/ChanProdConf";
// import ChanProdConf from "../components/ChanProdConf";
// import Login from "../components/Login";
// import App from "../components/App";
// import Probny from "../components/Probny";

// test("first", () => {
//   const { getByLabelText, getByText } = render(<Probny />);
// });

// test("testing with headers", done => {
//   var path = require("path");
//   var lib = path.join(
//     path.dirname(require.resolve("axios")),
//     "lib/adapters/http"
//   );
//   var http = require(lib);
//   axios.get("http://localhost:3000/api/current_user", {
//     adapter: http,
//     headers: {
//       Authorization: "Basic YWRtaW46bHVveGlueGlhbjkx"
//     }
//   });
// });

test("first", () => {
  // console.log("store", store);
  const { getByLabelText, getByText } = render(
    <Provider store={store}>
      <ChanProdConf />
    </Provider>
  );
});
