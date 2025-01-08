import axios from "axios";
import axiosInstance from "./axiosInstance";

const API_BASE_URL =
  "https://capstone-project-703387227873.asia-southeast1.run.app/api/CartWithRedis";

export const addToCartAPI = (productId, quantity, token) => {
  return axiosInstance.post(
    `${API_BASE_URL}/add-to-cart`,
    {
      productId,
      quantity,
    },
    {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

// export const getCartAPI = (sortBy = '') => {
//   const url = `${API_BASE_URL}/get-cart`;
//   const data = {
//     perPage: 2,
//     currentPage: 0,
//     sortBy: sortBy,
//     isAscending: true
//   };
//   return axiosInstance.get(url, {
//     headers: {
//       'Accept': '*/*',
//       'Content-Type': 'application/json'
//     },
//     data: JSON.stringify(data)
//   });
// };

export const getCartAPI = (token, sortBy = "") => {
  const url = `${API_BASE_URL}/get-cart`;
  return axiosInstance.get(url, {
    params: {
      perPage: 10,
      currentPage: 0,
      sortBy: sortBy,
      isAscending: true,
    },
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCartItems = (cartItemId, token) => {
  const url = `${API_BASE_URL}/get-cart-item/${cartItemId}`;
  return axiosInstance.get(url, {
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const reduceCartItemAPI = (cartItemId, token) => {
  const url = `${API_BASE_URL}/reduce-cart/${cartItemId}`;
  return axiosInstance.put(
    url,
    {},
    {
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

export const remmoveCartItemAPI = (cartItemId, token) => {
  const url = `${API_BASE_URL}/delete-cart-item/${cartItemId}`;
  return axiosInstance.delete(url, {
    headers: {
      accept: "*/*",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const updateCartItemQuantityAPI = (cartItemId, quantity, token) => {
  const url = `${API_BASE_URL}/update-quantity-cart-item/${cartItemId}?quantity=` + quantity;
  return axiosInstance.put(
    url,
    {},
    {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};
