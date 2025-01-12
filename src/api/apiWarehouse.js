import axios from 'axios';

const API_BASE_URL = 'https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/Warehouse';

export const getWarehouse = () => {
  return axios.get(`${API_BASE_URL}/list-all`, {
    headers: {
      'accept': '*/*'
    }
  });
};


export const getProductofBranchAPI = (branchId) => {
  const url = `${API_BASE_URL}/list-products-of-branch/${branchId}`;
  return axios.get(url, {
    headers: {
      'accept': '*/*'
    }
  });
};

export const checkQuantityProductAPI = (productId) => {
  const url = `${API_BASE_URL}/quantity-of-product/${productId}`;
  return axios.get(url, {
    headers: {
      'accept': '*/*'
    }
  });
};
