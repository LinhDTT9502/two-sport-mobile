import {
    fetchBrandsAPI,
    getBrandByIdAPI,
    addBrandAPI,
    updateBrandAPI,
    deleteBrandAPI,
  } from '../api/apiBrand';
  
  export const getBrands = async () => {
    try {
      const response = await fetchBrandsAPI();
      return response.data.data.$values.filter((brand) => brand.status);
    } catch (error) {
      // console.error('Error fetching brands:', error);
      return [];
    }
  };
  
  export const getBrandById = async (brandId) => {
    try {
      const response = await getBrandByIdAPI(brandId);
      return response.data;
    } catch (error) {
      // console.error(`Error fetching brand with ID ${brandId}:`, error);
      return null;
    }
  };
  
  export const addBrand = async (brandData) => {
    try {
      const response = await addBrandAPI(brandData);
      return response.data;
    } catch (error) {
      // console.error('Error adding brand:', error);
      return null;
    }
  };
  
  export const updateBrand = async (brandId, brandData) => {
    try {
      const response = await updateBrandAPI(brandId, brandData);
      return response.data;
    } catch (error) {
      // console.error(`Error updating brand with ID ${brandId}:`, error);
      return null;
    }
  };
  
  export const deleteBrand = async (brandId) => {
    try {
      const response = await deleteBrandAPI(brandId);
      return response.data;
    } catch (error) {
      // console.error(`Error deleting brand with ID ${brandId}:`, error);
      return null;
    }
  };
  