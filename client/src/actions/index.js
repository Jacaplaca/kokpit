import axios from 'axios';
import { FETCH_USER, FETCH_FORM } from './types';

// export const fetchUser = function() {
//   return function(dispatch) {
//     axios.get('/api/current_user').then(function(res) {
//       dispatch({ type: FETCH_USER, payload: res });
//     });
//   };
// };

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  console.log('fetchUser');
  console.log(res.data);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchForm = () => async dispatch => {
  console.log(`FETCH_FORM action ${FETCH_FORM}`);
  const res = await axios.get('/api/message');

  dispatch({ type: FETCH_FORM, payload: res.data });
};
