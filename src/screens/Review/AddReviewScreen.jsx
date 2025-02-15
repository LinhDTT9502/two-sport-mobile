import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Rating } from "react-native-ratings";

const AddReviewScreen = ({ navigation, route }) => {
  const { orderId } = route.params;
  const [products, setProducts] = useState([]);
  const [selectedProductCode, setSelectedProductCode] = useState(null);
  const [star, setStar] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "User is not authenticated.");
        return;
      }

      const response = await fetch(
        `https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/SaleOrder/get-sale-order-detail?orderId=${orderId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (data.isSuccess) {
        const uniqueProducts = Array.from(
          new Map(
            data.data.saleOrderDetailVMs.$values.map((product) => [
              product.productCode,
              product,
            ])
          ).values()
        );
        setProducts(uniqueProducts);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch order details.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Error", "User is not authenticated.");
      return;
    }

    if (!selectedProductCode || star === 0 || reviewContent.trim() === "") {
      Alert.alert(
        "Error",
        "Vui lòng chọn sản phẩm, đánh giá và nhập nhận xét."
      );
      return;
    }

    // Lọc ra các sản phẩm đã được đánh giá
    const reviewsToSubmit = products.filter(
      (product) =>
        product.productCode === selectedProductCode &&
        star > 0 &&
        reviewContent.trim() !== ""
    );

    if (reviewsToSubmit.length === 0) {
      Alert.alert("Error", "Vui lòng đánh giá ít nhất 1 sản phẩm!");
      return;
    }

    try {
      // Gửi đánh giá
      const response = await fetch(
        `https://twosport-api-offcial-685025377967.asia-southeast1.run.app/api/Review/add-review/${orderId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: products.find(
              (p) => p.productCode === selectedProductCode
            )?.productId,
            star,
            reviewContent,
          }),
        }
      );

      if (response.ok) {
        Alert.alert("Thành công", "2Sport cảm ơn bạn đã chia sẻ cảm nhận!");

        setProducts((prevProducts) =>
          prevProducts.filter(
            (product) => product.productCode !== selectedProductCode
          )
        );

        setSelectedProductCode(null);
        setStar(0);
        setReviewContent("");
      } else {
        const errorData = await response.json();
        Alert.alert("Lỗi", errorData.message || "Không thể gửi đánh giá.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.productItem,
        selectedProductCode === item.productCode && styles.selectedProductItem,
      ]}
      onPress={() => setSelectedProductCode(item.productCode)}
    >
      <Image source={{ uri: item.imgAvatarPath }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.productName}</Text>
        {selectedProductCode === item.productCode && (
          <Text style={styles.selected}>Đã chọn</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Đánh giá sản phẩm</Text>
        <View style={styles.backButton} />
      </View>
      <Text style={styles.label}>Chọn sản phẩm để đánh giá:</Text>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.productCode}
        style={styles.productList}
      />

      {selectedProductCode && (
        <View style={styles.reviewSection}>
          <Text style={styles.label}>Đánh giá chất lượng sản phẩm:</Text>
          <Rating
            type="star"
            startingValue={star}
            ratingCount={5}
            imageSize={30}
            onFinishRating={setStar}
            style={styles.rating}
          />

          <TextInput
            style={styles.textArea}
            placeholder="Hãy chia sẻ nhận xét của bạn nhé!"
            multiline
            numberOfLines={4}
            value={reviewContent}
            onChangeText={setReviewContent}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1890ff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#555",
  },
  productList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  selectedProductItem: {
    backgroundColor: "#e6f7ff",
    borderColor: "#1890ff",
    borderWidth: 1,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    color: "#333",
  },
  selected: {
    color: "#1890ff",
    fontWeight: "bold",
    marginTop: 4,
  },
  reviewSection: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  rating: {
    paddingVertical: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    textAlignVertical: "top",
    marginBottom: 16,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#1890ff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddReviewScreen;
