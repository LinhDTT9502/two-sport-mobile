import axios from "axios";

const API_BASE_URL = 'https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/Customer';

export const getCustomerLoyalPoints = (userId) => {
  const url = `${API_BASE_URL}/get-loyal-points/${userId}`;
  return axios.get(url, {
    headers: {
      'accept': '*/*'
    }
  });
};