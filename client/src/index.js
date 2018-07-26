import 'materialize-css/dist/css/materialize.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';

// const store = createStore(reducers, {}, composeWithDevTools((applyMiddleware(reduxThunk),));
const store = createStore(
  reducers,
  composeWithDevTools(
    applyMiddleware(reduxThunk)
    // other store enhancers if any
  )
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
);

// console.log('STRIPE KEY IS', process.env.REACT_APP_STRIPE_KEY);
// console.log('Enviroment is', process.env.NODE_ENV);
