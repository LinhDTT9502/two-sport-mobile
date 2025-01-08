// src/services/productService.js
import {
  getProductList,
  getProductById,
  getProductFilterBy,
  searchProducts as searchProductsAPI,
  getProductByProductCodeAPI,
  listColorsOfProductAPI,
  listSizesOfProductAPI,
  listConditionsOfProductAPI,
} from "../api/apiProduct";

export const fetchProducts = async () => {
  try {
    const response = await getProductList();
    const { total, data } = response.data;
    return { total, products: data.$values };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProductsFiltered = async (
  sortBy,
  isAscending,
  selectedBrands,
  selectedCategories,
  minPrice,
  maxPrice,
  size
) => {
  try {
    const response = await getProductFilterBy(
      sortBy,
      isAscending,
      selectedBrands,
      selectedCategories,
      minPrice,
      maxPrice,
      size
    );
    const { total, data } = response.data;
    return { total, products: data.$values };
  } catch (error) {
    console.error("Error fetching sorted products:", error);
    throw error;
  }
};

export const fetchProductById = async (id) => {
  try {
    const response = await getProductById(id);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const fetchProductsByCategory = async (categoryId, currentPage) => {
  try {
    const response = await getProductList(currentPage);
    const { total, data } = response.data;
    // console.log("API Response Data:", data.$values);

    // Lọc sản phẩm theo `categoryId`
    const filteredProducts = data.$values.filter(
      (product) => product.categoryID === categoryId
    );

    return { total, products: filteredProducts };
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

export const searchProducts = async (keywords) => {
  try {
    const response = await searchProductsAPI(keywords);
    return response.data;
  } catch (error) {
    console.error("Error in searchProducts:", error);
    throw error;
  }
};

export const fetchSizesOfProduct = async (productCode, color) => {
  try {
    const response = await getSizesOfProduct(productCode, color);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching sizes for product with code ${productCode}:`,
      error
    );
    throw error;
  }
};

export const getProductByProductCode = async (
  productCode,
  color = null,
  size = null,
  condition = null
) => {
  try {
    // console.log("Calling getProductByProductCode API with productCode:", productCode);
    const response = await getProductByProductCodeAPI(
      productCode,
      color,
      size,
      condition
    );
    // console.log("Response from getProductByProductCodeAPI:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching product by product code:", error);
    throw error;
  }
};

export const listColorsOfProduct = async (productCode) => {
  try {
    const response = await listColorsOfProductAPI(productCode);
    return response.data;
  } catch (error) {
    console.error("Error fetching colors of product:", error);
    throw error;
  }
};

export const listSizesOfProduct = async (productCode, color) => {
  try {
    const response = await listSizesOfProductAPI(productCode, color);
    return response.data;
  } catch (error) {
    console.error("Error fetching sizes of product:", error);
    throw error;
  }
};

export const listConditionsOfProduct = async (productCode, color, size) => {
  try {
    const response = await listConditionsOfProductAPI(productCode, color, size);
    return response.data;
  } catch (error) {
    console.error("Error fetching conditions of product:", error);
    throw error;
  }
};
