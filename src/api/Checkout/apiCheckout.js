import axios from 'axios';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/SaleOrder';

export const placedOrderAPI = ( data) => {
  return axios.post(`${API_BASE_URL}/create-sale-order`, data, {
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json'
    }
  });
};

const API_BASE_URL_CHECK = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/Checkout';

export const selectCheckout = (data) => {
  return axios.post(`${API_BASE_URL_CHECK}/checkout-sale-order`, data, {
    headers: {
      'Accept': '*/*',
      // 'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const selectRentalCheckout = (data) => {
  console.log(data);
  
  return axios.post(`${API_BASE_URL_CHECK}/checkout-rental-order`, data, {
    headers: {
      'Accept': '*/*',
      // 'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};