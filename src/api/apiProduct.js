import axios from "axios";

const API_BASE_URL =
  "https://capstone-project-703387227873.asia-southeast1.run.app/api/Product";
const perPage = 15;

export const getProductList = (currentPage) => {
  const url = `${API_BASE_URL}/list-products`;
  const params = {
    perPage,
    currentPage,
  };
  return axios.get(url, {
    params,
    headers: {
      accept: "*/*",
    },
  });
};

export const getProductById = (id) => {
  const url = `${API_BASE_URL}/get-product/${id}`;
  return axios.get(url, {
    headers: {
      accept: "*/*",
    },
  });
};

export const getProductFilterBy = (
  sortBy,
  isAscending,
  brandIds,
  categoryIds,
  minPrice,
  maxPrice,
  size
) => {
  const url = `${API_BASE_URL}/filter-sort-products`;
  const params = { perPage };
  if (sortBy) params.sortBy = sortBy;
  if (typeof isAscending === "boolean") params.isAscending = isAscending;
  if (brandIds && brandIds.length > 0) {
    brandIds.forEach((id, index) => {
      params[`brandIds[${index}]`] = id;
    });
  }
  if (categoryIds && categoryIds.length > 0) {
    categoryIds.forEach((id, index) => {
      params[`categoryIds[${index}]`] = id;
    });
  }
  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;
  if (size) params.size = size;
  return axios.get(url, {
    params,
    headers: {
      accept: "*/*",
    },
  });
};

export const searchProducts = (keywords) => {
  const url = `${API_BASE_URL}/search-products`;
  return axios.get(url, {
    params: { keywords },
    headers: {
      accept: "*/*",
    },
  });
};

export const getProductByProductCodeAPI = (productCode) => {
  return axios.get(
    `${API_BASE_URL}/get-product-by-product-code/${productCode}`
  );
};

export const listColorsOfProductAPI = (productCode) => {
  return axios.get(
    `${API_BASE_URL}/list-colors-of-product/${productCode}`
  );
};

export const listSizesOfProductAPI = (productCode, color) => {
  const url = color
    ? `${API_BASE_URL}/list-sizes-of-product/${productCode}?color=${color}`
    : `${API_BASE_URL}/list-sizes-of-product/${productCode}`;
  return axios.get(url);
};

export const listConditionsOfProductAPI = (productCode, color, size) => {
  let url = `${API_BASE_URL}/list-conditions-of-product/${productCode}`;
  if (color) url += `?color=${color}`;
  if (size) url += color ? `&size=${size}` : `?size=${size}`;
  return axios.get(url);
};
