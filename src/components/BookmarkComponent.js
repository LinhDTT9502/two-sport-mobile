import React, { useState, useEffect } from "react";
import { TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { fetchProductById } from "../services/productService";

const BookmarkComponent = ({
  item,
  token,
  style,
  iconSize = 24,
  color = "#3366FF",
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      try {
        const storedBookmarks = await AsyncStorage.getItem("bookmarks");
        if (storedBookmarks) {
          const bookmarks = JSON.parse(storedBookmarks);
          setIsBookmarked(bookmarks.some((bookmark) => bookmark.id === item.id));
        }
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      }
    };

    checkBookmarkStatus();
  }, [item.id]);

  const saveBookmarks = async (updatedBookmarks) => {
    try {
      await AsyncStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error("Error saving bookmarks:", error);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!token) {
      Alert.alert("Thông báo", "Bạn cần đăng nhập để sử dụng tính năng Bookmark.");
      return;
    }
  
    try {
      const storedBookmarks = await AsyncStorage.getItem("bookmarks");
      const parsedBookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];
      let updatedBookmarks;
  
      if (isBookmarked) {
        updatedBookmarks = parsedBookmarks.filter((bookmark) => bookmark.id !== item.id);
        setIsBookmarked(false);
        Alert.alert("Thành công", "Đã xóa sản phẩm khỏi Bookmark.");
      } else {
        
        const productDetails = await fetchProductById(item.id);
  
        updatedBookmarks = [...parsedBookmarks, productDetails];
        setIsBookmarked(true);
        Alert.alert("Thành công", "Đã thêm sản phẩm vào Bookmark.");
      }
  
      await saveBookmarks(updatedBookmarks);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };
  

  return (
    <TouchableOpacity style={style} onPress={handleBookmarkToggle}>
      <Ionicons
        name={isBookmarked ? "bookmark" : "bookmark-outline"}
        size={iconSize}
        color={color}
      />
    </TouchableOpacity>
  );
};

export default BookmarkComponent;
