import { getCustomerLoyalPoints } from "../api/apiCustomer";

export const fetchCustomerLoyalPoints = async (userId) => {
  try {
    const response = await getCustomerLoyalPoints(userId);
    return response.data.data; 
  } catch (error) {
    // console.error('Error fetching all blogs:', error);
    throw error;
  }
};
