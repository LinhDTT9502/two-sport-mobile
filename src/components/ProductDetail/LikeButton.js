import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchLikes, handleToggleLike } from "../../services/likeService";

const LikeButton = ({ productId, productCode, initialLikes, isLikedInitially }) => {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(isLikedInitially || false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLikes = async () => {
      try {
        const likesData = await fetchLikes(productCode);
        const userId = await AsyncStorage.getItem("currentUserId");
        const userLiked = likesData?.$values?.some(
          (item) => item.userId === parseInt(userId, 10) && item.productId === productId
        );
        setIsLiked(userLiked || false);
        setLikes(likesData?.$values?.length || 0);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };

    loadLikes();
  }, [productId, productCode]);

  const toggleLike = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Thông báo", "Bạn cần đăng nhập để thích sản phẩm này.");
        return;
      }

      setLoading(true);
      const newIsLiked = !isLiked;
      const newLikes = newIsLiked ? likes + 1 : likes - 1;

      setIsLiked(newIsLiked);
      setLikes(newLikes);

      await handleToggleLike(productCode);
    } catch (error) {
      console.error("Error toggling like:", error);
      Alert.alert("Lỗi", "Không thể thực hiện hành động like.");
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes - 1 : likes + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={toggleLike}
      disabled={loading}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        backgroundColor: isLiked ? "#ff6666" : "#f0f0f0",
        borderRadius: 20,
        justifyContent: "center",
      }}
    >
      {loading ? (
        <ActivityIndicator size="small" color={isLiked ? "#fff" : "#000"} />
      ) : (
        <Ionicons
          name={isLiked ? "heart" : "heart-outline"}
          size={24}
          color={isLiked ? "#fff" : "#000"}
        />
      )}
      <Text
        style={{
          marginLeft: 8,
          color: isLiked ? "#fff" : "#000",
          fontWeight: "bold",
        }}
      >
        {likes}
      </Text>
    </TouchableOpacity>
  );
};

export default LikeButton;
