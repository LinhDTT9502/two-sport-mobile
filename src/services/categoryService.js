import { getAllCategories } from '../api/apiCategory';

export const fetchCategories = async () => {
  try {
    const response = await getAllCategories();
    const activeCategories = response.data.data.$values.filter(
      (category) => category.status === true
    );
    return activeCategories;
  } catch (error) {
    console.error('Error fetching category data:', error);
    throw error;
  }
};
