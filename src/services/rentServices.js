import { createRent } from '../api/apiRent';

export const rental = async (data) => {
  try {
    const response = await createRent(data);
    return response.data;
  } catch (error) {
    console.error('Error checking out order:', error);
    throw error;
  }
};
