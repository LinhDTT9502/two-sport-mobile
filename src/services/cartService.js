import {
  addToCartAPI,
  getCartAPI,
  reduceCartItemAPI,
  remmoveCartItemAPI,
  updateCartItemQuantityAPI,
} from "../api/apiCart";

export const addToCart = async (productId, quantityToAdd, token) => {
  try {
    const response = await addToCartAPI(productId, quantityToAdd, token);
    return response.data;
  } catch (error) {
    return error?.response?.data || ''
    // console.error("Add to cart failed:", error.response?.data || error);

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
  }
};


// export const getUserCart = async (sortBy = "") => {
//   try {
//     const response = await getCartAPI(sortBy);
//     return response.data.data.$values;
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     throw error;
//   }
// };

export const getUserCart = async (token, sortBy = "productName") => {
  try {
    const response = await getCartAPI(token, sortBy);
    return response.data.data.$values;
  } catch (error) {
    // console.error("Error fetching cart:", error.response?.data || error);
    // throw new Error("Failed to fetch user cart");
  }
};

export const reduceCartItem = async (id, token) => {
  try {
    const response = await reduceCartItemAPI(id, token);
    return response;
  } catch (error) {
    console.error("Error reducing cart item:", error);
    throw error;
  }
};

export const removeCartItem = async (id, token) => {
  try {
    const response = await remmoveCartItemAPI(id, token);
    return response;
  } catch (error) {
    console.error("Error removing cart item:", error.response?.data || error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Không thể xóa sản phẩm khỏi giỏ hàng.");
    }
  }
};

export const updateCartItemQuantity = async (cartItemId, quantity, token) => {
  try {
    const response = await updateCartItemQuantityAPI(cartItemId, quantity, token);
    return response.data;
  } catch (error) {
    console.error("Service Error:", error.response?.data || error.message);
    throw new Error("Không thể cập nhật số lượng sản phẩm.");
  }
};
