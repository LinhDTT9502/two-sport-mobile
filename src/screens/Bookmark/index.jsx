import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { fetchProductById } from "../../services/productService";

const screenWidth = Dimensions.get("window").width;

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState([]);
  const navigation = useNavigation();
  const [noTokenModalVisible, setNoTokenModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadBookmarks = async () => {
        try {
          // Check if user is logged in by checking the token
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            setNoTokenModalVisible(true);
            return;
          }

          // Load bookmarks if logged in
          const storedBookmarks = await AsyncStorage.getItem("bookmarks");
          const parsedBookmarks = storedBookmarks
            ? JSON.parse(storedBookmarks)
            : [];

          const bookmarkDetails = await Promise.all(
            parsedBookmarks.map(async (bookmark) => {
              try {
                const product = await fetchProductById(bookmark.id);
                return {
                  ...product,
                  id: bookmark.id,
                };
              } catch (error) {
                console.error(
                  `Error fetching product with id ${bookmark.id}:`,
                  error
                );
                return null;
              }
            })
          );

          setBookmarks(bookmarkDetails.filter((product) => product !== null));
        } catch (error) {
          console.error("Error loading bookmarks:", error);
        }
      };

      loadBookmarks();
    }, [])
  );
  const handleRemoveBookmark = async (item) => {
    Alert.alert(
      "Xóa Bookmark",
      "Bạn có chắc chắn muốn xóa mục này khỏi danh sách?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedBookmarks = bookmarks.filter(
                (bookmark) => bookmark.id !== item.id
              );
              setBookmarks(updatedBookmarks);
              await AsyncStorage.setItem(
                "bookmarks",
                JSON.stringify(updatedBookmarks)
              );
              Alert.alert("Thông báo", "Đã xóa mục khỏi danh sách Bookmark.");
            } catch (error) {
              console.error("Error removing bookmark:", error);
            }
          },
        },
      ]
    );
  };
  const handleLogin = () => {
    setNoTokenModalVisible(false);
    navigation.navigate("Login");
  };

  const handleCancel = () => {
    setNoTokenModalVisible(false);
    navigation.navigate("LandingPage");
  };
  const renderBookmarkItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookmarkItem}
      onPress={() =>
        navigation.navigate("ProductDetail", { productId: item.id })
      }
    >
      <Image
        style={styles.coverImage}
        source={{
          uri: item.imgAvatarPath || "https://via.placeholder.com/150",
        }}
      />
      <View style={styles.bookmarkContent}>
        <Text style={styles.bookmarkTitle} numberOfLines={2}>
          {item.productName || "Tên sản phẩm không có"}
        </Text>
        <Text style={styles.bookmarkPrice} numberOfLines={1}>
          {item.price ? `${item.price.toLocaleString("vi-vn")} ₫` : "Giá không có"}
        </Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveBookmark(item)}
        >
          <Feather name="trash-2" size={16} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#050505" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bookmarks</Text>
      </View>

      {bookmarks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="bookmark" size={64} color="#ccc" />
          <Text style={styles.emptyText}>
            Danh sách Bookmark của bạn trống!
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          renderItem={renderBookmarkItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}

      <Modal
        visible={noTokenModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setNoTokenModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bạn chưa có tài khoản</Text>
            <Text style={styles.modalText}>
              Vui lòng đăng nhập để tiếp tục.
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
              >
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#F0F2F5",
  },
  header: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E6EB",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#050505",
  },
  listContainer: {
    padding: 14,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  bookmarkItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: (screenWidth - 32) / 2 - 8,
  },
  coverImage: {
    width: "100%",
    height: 120,
    resizeMode: "contain",
  },
  bookmarkContent: {
    padding: 12,
  },
  bookmarkTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#050505",
    marginBottom: 4,
  },
  bookmarkPrice: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FF5733",
    marginBottom: 8,
  },
  removeButton: {
    position: "absolute",
    right: 8,
    bottom: 8,
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  cancelButton: {
    padding: 12,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  loginButton: {
    padding: 12,
    borderRadius: 8,
    width: "45%",
    alignItems: "center",
    backgroundColor: "#FF9900",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
});
