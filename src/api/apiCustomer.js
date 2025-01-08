import axios from "axios";

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/Customer';

export const getCustomerLoyalPoints = (userId) => {
  const url = `${API_BASE_URL}/get-loyal-points/${userId}`;
  return axios.get(url, {
    headers: {
      'accept': '*/*'
    }
  });
};