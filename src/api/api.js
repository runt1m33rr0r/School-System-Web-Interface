import axios from 'axios';

import { NETWORK_START, NETWORK_SUCCESS, NETWORK_FAILURE } from '../constants/action-types';

/* eslint import/prefer-default-export: 0 */
export const makeRequest = ({
  url, method, dispatch, token, data,
}) => {
  const headers = { Authorization: `Bearer ${token}` };
  dispatch({ type: NETWORK_START });
  return axios({
    method,
    url,
    data,
    headers,
  })
    .catch((err) => {
      dispatch({ type: NETWORK_FAILURE, message: err.message });
      return Promise.reject(err);
    })
    .then((response) => {
      if (response.data.success) {
        dispatch({ type: NETWORK_SUCCESS });
        return Promise.resolve(response.data);
      }
      dispatch({ type: NETWORK_FAILURE, message: response.data.message });
      return Promise.reject(response.data);
    });
};