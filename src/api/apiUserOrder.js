import axios from "axios";

const API_BASE_URL = 'https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/SaleOrder';

export const getUserOrders = (id, token) => {
  const url = `${API_BASE_URL}/get-orders-by-user?userId=${id}`;
  return axios.get(url, {
    headers: {
      'accept': '*/*',
      "Authorization": `Bearer ${token}`,
    }
  });
};
