import axios from 'axios';
const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/RentalOrder';

export const createRent = (data) => {
  return axios.post(`${API_BASE_URL}/create`,data, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
  });
};

export const getListRent = (id, token) => {
  return axios.get(`${API_BASE_URL}/get-rental-order-by-user?userId=${id}`, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`,
    },
  });
};