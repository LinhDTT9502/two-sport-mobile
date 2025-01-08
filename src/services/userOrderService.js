import { getUserOrders } from "../api/apiUserOrder";

export const fetchUserOrders = async (id, token) => {
  try {
    const response = await getUserOrders(id, token);
    // console.log("Response Data:", response.data);
    return response.data.data.$values;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};
