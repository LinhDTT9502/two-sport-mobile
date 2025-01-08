import axios from 'axios';
import axiosInstance from './axiosInstance';

const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/Brand';

// Fetch all brands
export const fetchBrandsAPI = () => {
  return axios.get(`${API_BASE_URL}/list-all`);
};

// Get brand by ID
export const getBrandByIdAPI = (brandId) => {
  return axiosInstance.get(`${API_BASE_URL}/get-brand-by-id/${brandId}`);
};

// Add a new brand
export const addBrandAPI = (brandData) => {
  return axiosInstance.post(`${API_BASE_URL}/add-brand`, brandData);
};

// Update brand by ID
export const updateBrandAPI = (brandId, brandData) => {
  return axiosInstance.post(`${API_BASE_URL}/update-brand/${brandId}`, brandData);
};

// Delete brand by ID
export const deleteBrandAPI = (brandId) => {
  return axiosInstance.post(`${API_BASE_URL}/delete-brand/${brandId}`);
};
