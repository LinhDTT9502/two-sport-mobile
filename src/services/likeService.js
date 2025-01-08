import { getLikesAPI, toggleLikeProductAPI } from "../api/apiLike";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Hàm lấy token
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      // console.warn("Token not found");
      return null;
    }
    return token;
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

export const fetchLikes = async () => {
  try {
    const response = await getLikesAPI();
    return response.data;
  } catch (error) {
    console.error("Error fetching likes:", error);
    throw error;
  }
};

export const handleToggleLike = async (productId) => {
  try {
    const token = await getToken();
    if (!token) {
      // console.warn("Cannot like product. User is not logged in.");
      return;
    }
    const response = await toggleLikeProductAPI(productId, token);
    return response.data;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};
