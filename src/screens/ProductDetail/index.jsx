import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  FlatList,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AddToCartButton from "../../components/AddToCardButton";
import RentButton from "../../components/RentButton";
import BuyNowButton from "../../components/BuyNowButton";
import Comment from "../../components/ProductDetail/Comment";
import LikeButton from "../../components/ProductDetail/LikeButton";
import { checkQuantityProduct } from '../../services/warehouseService';

import {
  fetchProductById,
  getProductByProductCode,
  listColorsOfProduct,
  listSizesOfProduct,
  listConditionsOfProduct,
} from "../../services/productService";
import { fetchLikes, handleToggleLike } from "../../services/likeService";
import styles from "./css/ProductDetailStyles";
import { getUserCart } from "../../services/cartService";
import { WebView } from "react-native-webview";

const screenWidth = Dimensions.get("window").width;

const COLORS = {
  primary: "#0035FF",
  secondary: "#FA7D0B",
  dark: "#2C323A",
  light: "#CADDED",
  white: "#FFFFFF",
  black: "#000000",
};

export default function ProductDetail() {
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { productId , productCode } = route.params;
  const [token, setToken] = useState(null);
  const [product, setProduct] = useState({});
  // console.log("ProductDetail ~ product:", product)

  const [quantity, setQuantity] = useState(1);
  const [userComment, setUserComment] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [loadingLike, setLoadingLike] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // select
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [conditions, setConditions] = useState([]);

  const [selectedColor, setSelectedColor] = useState(undefined);
  const [selectedSize, setSelectedSize] = useState(undefined);
  const [selectedCondition, setSelectedCondition] = useState(undefined);
  const [totalPrice, setTotalPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [productList, setProductList] = useState([]);
  const [imagesByColor, setImagesByColor] = useState({});

  const [selectedImage, setSelectedImage] = useState("");
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [fullscreenImages, setFullscreenImages] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadBookmarks = async () => {
        try {
          const storedBookmarks = await AsyncStorage.getItem("bookmarks");
          if (storedBookmarks) {
            const parsedBookmarks = JSON.parse(storedBookmarks);
            setIsBookmarked(parsedBookmarks.some((b) => b.id === product.id));
          }
        } catch (error) {
          console.error("Error loading bookmarks:", error);
        }
      };

      loadBookmarks();
    }, [product.id])
  );

  useEffect(() => {
    if (sizes?.length > 0 && selectedSize === undefined) {
      const validSize = sizes.find((item) => item.status);
      if (validSize) {
        handleSizeSelect(validSize.size);
      }
    }
  }, [sizes, selectedColor]);

  useEffect(() => {
    if (conditions?.length > 0 && selectedCondition === undefined) {
      const validCon = conditions.find((item) => item.status);
      if (validCon) {
        handleConditionSelect(validCon.condition);
      }
    }
  }, [sizes, conditions]);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem("currentUserId");
        // console.log("Fetched User ID:", userId); // Debug
        setCurrentUserId(userId ? parseInt(userId, 10) : null);
      } catch (error) {
        console.error("Error fetching current user ID:", error);
      }
    };

    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    // console.log("currentUserId in ProductDetail:", currentUserId);
  }, [currentUserId]);

  const fetchProductColors = async (productCode) => {
    try {
      const response = await listColorsOfProduct(productCode);
      setColors(
        response.data.$values.map((item) => ({
          color: item.color,
          status: item.status,
        }))
      );
      if (
        response.data.$values?.[0]?.color &&
        response.data.$values?.[0]?.status
      ) {
        handleColorSelect(response.data.$values?.[0]?.color);
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  const fetchProductSizes = async (productCode, color) => {
    try {
      const response = await listSizesOfProduct(productCode, color);
      setSizes(
        response.data.$values.map((item) => ({
          size: item.size,
          status: item.status,
        }))
      );
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  const fetchProductConditions = async (productCode, color, size) => {
    try {
      const response = await listConditionsOfProduct(productCode, color, size);
      setConditions(
        response.data.$values.map((item) => ({
          condition: item.condition,
          status: item.status,
        }))
      );
    } catch (error) {
      console.error("Error fetching conditions:", error);
    }
  };

  useEffect(() => {
    const loadProductList = async () => {
      try {
        const response = await getProductByProductCode(product.productCode);
        const list = response.$values || [];
        setProductList(list);

        const initialImages = {};
        response.$values.forEach((item) => {
          if (!initialImages[item.color]) {
            initialImages[item.color] = item.imgAvatarPath;
          }
        });
        setImagesByColor(initialImages);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
      }
    };

    if (product.productCode) {
      loadProductList();
    }
  }, [product.productCode]);

  useEffect(() => {
    if (product.productCode) {
      fetchProductColors(product.productCode);
    }
  }, [product.productCode]);

  const fetchProductPrice = (productCode, color, size, condition) => {
    try {
      const matchingProduct = productList.find(
        (product) =>
          product.productCode === productCode &&
          product.color === color &&
          product.size === size &&
          product.condition === condition
      );

      if (matchingProduct) {
        setTotalPrice(matchingProduct.price || 0);
        setProduct((prevProduct) => ({
          ...prevProduct,
          imgAvatarPath: matchingProduct.imgAvatarPath,
          productId: matchingProduct?.id,
        }));
      } else {
        setTotalPrice();
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật giá sản phẩm:", error);
    }
  };

  const fetchImagesByColor = (color) => {
    return productList
      .filter((product) => product.color === color)
      .map((product) => product.imgAvatarPath);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    if (selectedSize !== undefined) setSelectedSize(null);
    if (selectedCondition !== undefined) setSelectedCondition(null);

    // const images = fetchImagesByColor(color);
    // setFullscreenImages(images);

    // fetchProductSizes(product.productCode, color);

    const matchingProduct = productList.find((p) => p.color === color);
    setSelectedImage(matchingProduct?.listImages?.$values?.[0]);
    if (matchingProduct) {
      setProduct(matchingProduct);
      setTotalPrice(matchingProduct.price || 0);
      setBasePrice(matchingProduct.price || 0);
    } else {
      setTotalPrice("Hết Hàng/ Chưa có hàng");
      setBasePrice(0);
    }

    // Tiếp tục lấy danh sách kích thước dựa trên màu đã chọn
    fetchProductSizes(product.productCode, color);
  };

  const handleSizeSelect = (size) => {
    const matchingProduct = productList.find(
      (p) => p.size === size && p.color === product.color
    );

    if (matchingProduct) {
      setProduct(matchingProduct);
    }

    setSelectedSize(size);
    if (selectedCondition !== undefined) setSelectedCondition(null);
    fetchProductConditions(product.productCode, selectedColor, size);
  };

  const handleConditionSelect = (condition) => {
    const matchingProduct = productList.find(
      (p) =>
        p.condition == condition &&
        p.color === product.color &&
        p.size === product.size
    );

    if (matchingProduct) {
      setProduct(matchingProduct);
    }

    setSelectedCondition(condition);
    fetchProductPrice(
      product.productCode,
      selectedColor,
      selectedSize,
      condition
    );
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken); // Lưu token vào state
      } catch (error) {
        console.error("Error fetching token:", error);
        setToken(null);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    loadProductDetails();
    loadLikes();
    checkLoginStatus();
    // loadComments();
  }, [productId]);

  const loadCart = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);

      if (token) {
        const userCart = await getUserCart(token);
        setCartItems(userCart || []);
      } else {
        const guestCart =
          JSON.parse(await AsyncStorage.getItem("guestCart")) || [];
        setCartItems(guestCart);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error("Error retrieving token:", error);
      setIsLoggedIn(false);
    }
  };

  const loadLikes = async () => {
    try {
      const likesData = await fetchLikes();
      const userId = await AsyncStorage.getItem("currentUserId");
      if (
        userId &&
        likesData?.$values?.findIndex(
          (item) => item.userId == userId && item.productId == productId
        ) !== -1
      ) {
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      Alert.alert("Thông báo", "Đăng nhập để like sản phẩm.");
      return;
    }

    const newLikesCount = isLiked ? likes - 1 : likes + 1;
    setLikes(newLikesCount);
    setIsLiked(!isLiked);

    try {
      setLoadingLike(true);
      await handleToggleLike(product?.productCode, navigation);
      await loadProductDetails();
      setLoadingLike(false);
    } catch (error) {
      setLoadingLike(false);
      setLikes(likes);
      setIsLiked(!isLiked);
      Alert.alert("Lỗi", "Không thể thực hiện hành động like.");
    } finally {
      setLoadingLike(false);
    }
  };
  const loadProductDetails = async () => {
    try {
      const productData = await fetchProductById(productId);
      // console.log("Fetched Product Data by ID:", productData);

      const productCode = productData.productCode;

      if (!productCode) {
        Alert.alert("Lỗi", "Mã sản phẩm không hợp lệ.");
        return;
      }

      const productListResponse = await getProductByProductCode(productCode);

      if (
        productListResponse &&
        productListResponse.$values &&
        productListResponse.$values.length > 0
      ) {
        const firstProduct = productListResponse.$values[0];
        setProduct(firstProduct);
        setLikes(firstProduct.likes || 0);
        setBasePrice(firstProduct.price || 0);
        setTotalPrice((firstProduct.price || 0) * quantity);
      } else {
        Alert.alert("Lỗi", "Không tìm thấy sản phẩm cho mã sản phẩm này.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải thông tin sản phẩm.");
      console.error("Error loading product details:", error);
    }
  };

  // Update total price based on quantity and base price
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity <= 0) {
      setQuantity(1);
      setTotalPrice(basePrice * 1);
    } else {
      setQuantity(newQuantity);
      setTotalPrice(basePrice * newQuantity);
    }
  };

  const handleAddToCart = async (type) => {
  try {
    if (!selectedColor) {
      Alert.alert("Thông báo", "Vui lòng chọn màu sắc!");
      return;
    }

    if (!selectedSize) {
      Alert.alert("Thông báo", "Vui lòng chọn kích thước!");
      return;
    }

    if (!selectedCondition) {
      Alert.alert("Thông báo", "Vui lòng chọn tình trạng!");
      return;
    }

    // Kiểm tra số lượng sản phẩm trong kho
    const response = await checkQuantityProduct(product.id);
    if (quantity > response.availableQuantity) {
      Alert.alert(
        "Thông báo",
        `Sản phẩm này chỉ còn lại ${response.availableQuantity} sản phẩm trong kho.`
      );
      return;
    }

    // Điều hướng đến màn hình đặt hàng nếu số lượng hợp lệ
    if (type === "buy" || type === "rent") {
      return navigation.navigate("PlacedOrder", {
        selectedCartItems: [
          {
            ...product,
            quantity,
            size: selectedSize,
            color: selectedColor,
            condition: selectedCondition,
          },
        ],
        type,
      });
    }
  } catch (error) {
    console.error("Error during add to cart:", error);
    Alert.alert("Lỗi", "Đã xảy ra lỗi. Vui lòng thử lại.");
  }
};


  const handleSubmitReview = () => {
    if (userRating === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn số sao đánh giá.");
      return;
    }
    Alert.alert("Thành công", "Đánh giá của bạn đã được gửi");
    setUserComment("");
    setUserRating(0);
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-vn");
  };

  const renderItem = ({ item }) => (
    <View style={styles.section}>
      {item.type === "image" && (
        <>
          <Image
            source={{
              uri:
                selectedImage ||
                product.imgAvatarPath ||
                "https://via.placeholder.com/300",
            }}
            style={styles.productImage}
          />

          <FlatList
            key={product?.id}
            data={product?.listImages?.$values}
            horizontal
            keyExtractor={(image, index) => `${image}-${index}`}
            style={styles.thumbnailList}
            renderItem={({ item: image }) => (
              <TouchableOpacity
                onPress={() => setSelectedImage(image)}
                style={[
                  styles.thumbnailContainer,
                  selectedImage === image && styles.selectedThumbnail,
                ]}
              >
                <Image source={{ uri: image }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </>
      )}

      {item.type === "info" && (
        <View style={styles.productInfo}>
          <View style={styles.rowContainer}>
            <Text style={styles.productName}>
              {product.productName || "Tên sản phẩm không có"}
            </Text>
            {/* <BookmarkComponent
              item={{
                id: product.id,
                title: product.title,
                price: product.price,
                imageUrl: product.imgAvatarPath,
              }}
              token={token}
              style={{ marginLeft: 16 }}
              iconSize={24}
              color="#FF9900"
            /> */}
          </View>
          <View style={styles.priceContainer}>
            <View>
              <Text style={styles.productPrice}>
                Giá mua:
                {product.price
                  ? ` ${formatCurrency(product.price)} ₫`
                  : "Giá không có"}
              </Text>
              {product.discount && product.listedPrice ? (
                <>
                  <Text style={styles.originalPrice}>
                    {formatCurrency(product.listedPrice)} ₫
                  </Text>
                  <Text style={styles.discount}>Giảm {product.discount}%</Text>
                </>
              ) : null}
            </View>

            <LikeButton
  productId={productId}
  productCode={product.productCode}
  initialLikes={likes}
  isLikedInitially={isLiked}
/>

          </View>

          <View style={styles.priceContainer}>
            {product?.rentPrice ? (
              <View>
                <Text style={styles.productRent}>
                  Giá thuê: {formatCurrency(product.rentPrice)} ₫
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      )}
      {item.type === "selection" && (
        <View>
          {/* Color Selection */}
          <Text style={styles.sectionTitle}>Màu sắc</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={colors}
            keyExtractor={(color) => color.color}
            renderItem={({ item: color }) => (
              <TouchableOpacity
                onPress={() => color.status && handleColorSelect(color.color)}
                style={[
                  styles.colorOptionContainer,
                  selectedColor === color.color &&
                    styles.activeColorOptionContainer,
                  !color.status && styles.unavailableOption,
                ]}
                disabled={!color.status}
              >
                <Image
                  source={{
                    uri:
                      imagesByColor[color.color] ||
                      "https://via.placeholder.com/60",
                  }}
                  style={styles.colorOptionImage}
                />
                <Text
                  style={[
                    styles.colorOptionText,
                    selectedColor === color.color &&
                      styles.activeColorOptionText,
                    !color.status && styles.unavailableText,
                  ]}
                >
                  {color.color} {!color.status && "(Hết hàng)"}
                </Text>
              </TouchableOpacity>
            )}
          />

          {/* Size Selection (visible after color selection) */}
          {selectedColor && (
            <>
              <Text style={styles.sectionTitle}>Kích thước</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={sizes}
                keyExtractor={(size) => size.size}
                renderItem={({ item: size }) => (
                  <TouchableOpacity
                    onPress={() => size.status && handleSizeSelect(size.size)}
                    style={[
                      styles.sizeButton,
                      selectedSize === size.size && styles.activeSizeButton,
                      !size.status && styles.unavailableOption,
                    ]}
                    disabled={!size.status}
                  >
                    <Text
                      style={[
                        styles.sizeButtonText,
                        selectedSize === size.size &&
                          styles.activeSizeButtonText,
                        !size.status && styles.unavailableText,
                      ]}
                    >
                      {size.size} {!size.status && "(Hết hàng)"}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </>
          )}

          {/* Condition Selection (visible after size selection) */}
          {selectedColor && selectedSize && (
            <>
              <Text style={styles.sectionTitle}>Tình trạng</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={conditions}
                keyExtractor={(condition) => condition.condition}
                renderItem={({ item: condition }) => (
                  <TouchableOpacity
                    onPress={() =>
                      condition.status &&
                      handleConditionSelect(condition.condition)
                    }
                    style={[
                      styles.conditionButton,
                      selectedCondition === condition.condition &&
                        styles.activeConditionButton,
                      !condition.status && styles.unavailableOption,
                    ]}
                    disabled={!condition.status}
                  >
                    <Text
                      style={[
                        styles.conditionButtonText,
                        selectedCondition === condition.condition &&
                          styles.activeConditionButtonText,
                        !condition.status && styles.unavailableText,
                      ]}
                    >
                      {condition.condition}% {!condition.status && "(Hết hàng)"}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </>
          )}
        </View>
      )}

      {item.type === "selection" && (
        <View style={styles.quantitySection}>
          <Text style={styles.sectionTitle}>Số lượng</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() =>
                handleQuantityChange(quantity > 1 ? quantity - 1 : 1)
              }
            >
              <FontAwesome name="minus" size={16} color={COLORS.dark} />
            </TouchableOpacity>
            <TextInput
              style={styles.quantityText}
              value={String(quantity)}
              onChangeText={(text) => {
                if (text === "") {
                  setQuantity(0);
                  setTotalPrice(basePrice * 1);
                } else {
                  const newQuantity = parseInt(text, 10);
                  if (!isNaN(newQuantity) && newQuantity > 0) {
                    handleQuantityChange(newQuantity);
                  } else {
                    setQuantity(1);
                    setTotalPrice(basePrice * 1);
                  }
                }
              }}
              keyboardType="numeric"
            />
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange(quantity + 1)}
            >
              <FontAwesome name="plus" size={16} color={COLORS.dark} />
            </TouchableOpacity>
          </View>
          {/* <Text style={styles.totalPriceText}>
            Tổng giá:{" "}
            {typeof totalPrice === "string"
              ? totalPrice
              : `${formatCurrency(totalPrice)} ₫`}
          </Text> */}

          <View style={styles.addToCartContainer}>
            {typeof totalPrice === "string" ? (
              <Text style={{ color: "red", fontSize: 16, fontWeight: "bold" }}>
                {totalPrice}
              </Text>
            ) : (
              <AddToCartButton
                product={product}
                quantity={quantity}
                color={selectedColor}
                size={selectedSize}
                condition={selectedCondition}
                onAddToCart={() => handleAddToCart("add")}
                onCartUpdated={loadCart}
              />
            )}
          </View>
        </View>
      )}
      {/* {item.type === "specifications" && (
        <View>
          <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>
          <Text style={styles.specificationText}>
            Tình trạng: {product.condition}%
          </Text>
          <Text style={styles.specificationText}>
            Kích thước: {product.size}
          </Text>
          <Text style={styles.specificationText}>Màu sắc: {product.color}</Text>
        </View>
      )} */}
      {item.type === "promotions" && (
        <View>
          <Text style={styles.sectionTitle}>Ưu đãi</Text>
          <View style={styles.promotionContainer}>
            <Text style={styles.promotionItem}>
              ✓ Tặng 2 Quấn cán vợt Cầu Lông: VNB 001, VS002 hoặc Joto 001
            </Text>
            <Text style={styles.promotionItem}>
              ✓ Sơn logo mặt vợt miễn phí
            </Text>
            <Text style={styles.promotionItem}>
              ✓ Bảo hành lưới đan trong 72 giờ
            </Text>
            <Text style={styles.promotionItem}>
              ✓ Thay gen vợt miễn phí trọn đời
            </Text>
            <Text style={styles.promotionItem}>
              ✓ Tích luỹ điểm thành viên Premium
            </Text>
          </View>
        </View>
      )}
{item.type === "description" && (
        <View>
          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          {product.description ? (
            <View style={styles.webviewContainer}>
              <WebView
                originWhitelist={["*"]}
                source={{ html: product.description }}
                style={{
                  height: expanded ? 1000 : 500, // Show 500px or full height
                  width: "100%",
                  lineHeight: 20,
                }}
                javaScriptEnabled={true}
                scalesPageToFit={true}
                scrollEnabled={false} // Prevent scrolling inside the WebView
              />
              {!expanded && (
                <TouchableOpacity onPress={() => setExpanded(true)}>
                  <Text style={styles.expandText}>Xem thêm</Text>
                </TouchableOpacity>
              )}
              {expanded && (
                <TouchableOpacity onPress={() => setExpanded(false)}>
                  <Text style={styles.expandText}>Thu gọn</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <Text style={styles.descriptionText}>Không có mô tả</Text>
          )}
        </View>
      )}
      {/* {item.type === "reviews" && (
        <View>
          <Text style={styles.sectionTitle}>Đánh giá & Nhận xét</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setUserRating(star)}>
                <FontAwesome
                  name={star <= userRating ? "star" : "star-o"}
                  size={24}
                  color={star <= userRating ? COLORS.secondary : COLORS.dark}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Nhập đánh giá của bạn..."
              value={userComment}
              onChangeText={setUserComment}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity
              style={styles.commentSubmitButton}
              onPress={handleSubmitReview}
            >
              <Text style={styles.commentSubmitText}>Gửi đánh giá</Text>
            </TouchableOpacity>
          </View>
        </View>
      )} */}
      {item.type === "comments" && (
        <Comment
          productCode={productCode}
          isLoggedIn={isLoggedIn}
          currentUserId={currentUserId}
        />
      )}
    </View>
  );

  const sections = [
    { type: "image" },
    { type: "info" },
    { type: "selection" },
    // { type: "specifications" },
    { type: "promotions" },
    { type: "description" },
    // { type: "reviews" },
    { type: "comments" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.title}>Chi tiết sản phẩm</Text>
        <TouchableOpacity style={styles.cartIconContainer}>
          <Ionicons
            onPress={() => navigation.navigate("Cart")}
            name="cart"
            size={24}
            color={COLORS.primary}
          />
          {cartItems.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item, index) => `section-${index}`}
        style={styles.content}
      />

      <View style={styles.bottomNav}>
        <View style={styles.buyNowContainer}>
        <BuyNowButton
      onPress={() => handleAddToCart("buy")}
      disabled={
        totalPrice === "Hết hàng" || totalPrice === "Hết Hàng/ Chưa có hàng" ||
        !selectedColor ||
        !selectedSize ||
        !selectedCondition
      }
    />
        </View>
        {product?.isRent ? (
          <View style={styles.rentContainer}>
            <RentButton
        onPress={() => handleAddToCart("rent")}
        disabled={
          totalPrice === "Hết hàng" || totalPrice === "Hết Hàng/ Chưa có hàng" ||
          !selectedColor ||
          !selectedSize ||
          !selectedCondition
        }
      />
          </View>
        ) : null}
      </View>

      <Modal
        visible={isImageModalVisible}
        transparent={true}
        onRequestClose={() => setIsImageModalVisible(false)}
      >
        <View style={styles.imageModalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsImageModalVisible(false)}
          >
            <AntDesign name="close" size={30} color="white" />
          </TouchableOpacity>
          <FlatList
            data={fullscreenImages}
            horizontal
            pagingEnabled
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.fullscreenImage} />
            )}
            keyExtractor={(image) => image}
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={fullscreenImages.indexOf(selectedImage)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}
