import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import {
  fetchProducts,
  fetchProductsFiltered,
  searchProducts,
} from "../../services/productService";
import { getBrands } from "../../services/brandService";
import { fetchCategories } from "../../services/categoryService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BookmarkComponent from "../../components/BookmarkComponent";

const { width } = Dimensions.get("window");
const logoImage = require("../Logo/2sport_logo.png");

export default function ProductListing() {
  const navigation = useNavigation();
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sizeInput, setSizeInput] = useState("");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [token, setToken] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const reloadData = async () => {
        await loadInitialProducts();
        const storedBookmarks = await AsyncStorage.getItem("bookmarks");
        if (storedBookmarks) {
          setBookmarks(JSON.parse(storedBookmarks));
        }
      };
      reloadData();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      const loadBookmarks = async () => {
        try {
          const storedBookmarks = await AsyncStorage.getItem("bookmarks");
          if (storedBookmarks) {
            const parsedBookmarks = JSON.parse(storedBookmarks);
            setBookmarks(parsedBookmarks);
          }
        } catch (error) {
          console.error("Error loading bookmarks:", error);
        }
      };

      const handleBookmarkUpdated = ({ itemId, isBookmarked }) => {
        setBookmarks((prevBookmarks) => {
          if (isBookmarked) {
            return [...prevBookmarks, { id: itemId }];
          } else {
            return prevBookmarks.filter((bookmark) => bookmark.id !== itemId);
          }
        });
      };

      navigation.addListener("bookmarkUpdated", handleBookmarkUpdated);
      loadBookmarks();

      return () => {
        navigation.removeListener("bookmarkUpdated", handleBookmarkUpdated);
      };
    }, [navigation])
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchToken = async () => {
        try {
          const storedToken = await AsyncStorage.getItem("token");
          setToken(storedToken);
        } catch (error) {
          console.error("Error fetching token:", error);
        }
      };
      fetchToken();
    }, [])
  );

  useEffect(() => {
    loadInitialProducts();
  }, [sortOrder]);

  useEffect(() => {
    const fetchBrandsAndCategories = async () => {
      try {
        const [brandData, categoryData] = await Promise.all([
          getBrands(),
          fetchCategories(),
        ]);
        setBrands(brandData);
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching brands and categories:", error);
      }
    };
    fetchBrandsAndCategories();
  }, []);

  const loadInitialProducts = async () => {
    setLoading(true);
    try {
      const { products } = await fetchProducts();
      setProducts(products);
    } catch (error) {
      console.error("Error loading initial products:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    setFilterModalVisible(false);

    const noFiltersApplied =
      sortOrder === "default" &&
      selectedBrands.length === 0 &&
      selectedCategories.length === 0 &&
      !minPrice &&
      !maxPrice &&
      !sizeInput;

    if (noFiltersApplied) {
      await loadInitialProducts();
      return;
    }

    setLoading(true);
    try {
      const sortBy = sortOrder === "default" ? "" : "price";
      const isAscending = sortOrder === "lowToHigh";
      const { products: filteredProducts } = await fetchProductsFiltered(
        sortBy,
        isAscending,
        selectedBrands,
        selectedCategories,
        minPrice ? parseInt(minPrice) : 0,
        maxPrice ? parseInt(maxPrice) : 1000000000,
        sizeInput
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setLoading(false);
    }
  };

  // const loadFilteredProducts = async (page = currentPage) => {
  //   if (loading || !hasMore) return;

  //   // setLoading(true);
  //   // const timeout = setTimeout(() => setLoading(false), 10000);
  //   try {
  //     const sortBy = sortOrder === "default" ? "" : "price";
  //     const isAscending = sortOrder === "lowToHigh";
  //     const { total, products: fetchedProducts } = await fetchProductsFiltered(
  //       sortBy,
  //       isAscending,
  //       selectedBrands,
  //       selectedCategories,
  //       minPrice ? parseInt(minPrice) : 0,
  //       maxPrice ? parseInt(maxPrice) : 1000000000,
  //       sizeInput
  //     );

  //     // Lọc trùng lặp theo `productCode`
  //     const newProducts =
  //       page === 1 ? fetchedProducts : [...products, ...fetchedProducts];
  //     const uniqueProductsByCode = Array.from(
  //       new Map(newProducts.map((item) => [item.productCode, item])).values()
  //     );

  //     setProducts(uniqueProductsByCode);
  //     setTotalProducts(total);
  //     setHasMore(fetchedProducts.length > 0);
  //   } catch (error) {
  //     console.error("Error loading products:", error);
  //   } finally {
  //     // clearTimeout(timeout)
  //     // setLoading(false);
  //   }
  // };

  // const loadMoreProducts = () => {
  //   if (!loading && hasMore) {
  //     const nextPage = currentPage + 1;
  //     setCurrentPage(nextPage);
  //     loadFilteredProducts(nextPage);
  //   }
  // };

  const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => {
      if (prevOrder === "default") return "lowToHigh";
      if (prevOrder === "lowToHigh") return "highToLow";
      return "default";
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (searchQuery.trim() === "") {
        await loadInitialProducts();
        return;
      }

      const response = await searchProducts(searchQuery);
      const searchResults = response.data?.$values || [];
      setProducts(searchResults);
      setTotalProducts(searchResults.length);
      setHasMore(false);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (type, id) => {
    const setterMap = {
      brand: setSelectedBrands,
      category: setSelectedCategories,
    };
    setterMap[type](() => [id]);
  };

  const renderProduct = ({ item }) => {
    const price = item.price && !isNaN(item.price) ? item.price : "N.A";
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() =>
          navigation.navigate("ProductDetail", { productId: item.id })
        }
      >
        <Image
          source={{ uri: item.imgAvatarPath }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.productName}
          </Text>
          <Text style={styles.productCategory} numberOfLines={1}>
            {item.categoryName}
          </Text>
          <Text style={styles.productPrice}>
            {price !== "N.A" ? `${parseInt(price).toLocaleString("vi-vn")}₫` : "N.A"}
          </Text>
          {token && (
            <BookmarkComponent
              item={{
                id: item.id,
                title: item.productName,
                price: price !== "N.A" ? price : null,
                imageUrl: item.imgAvatarPath,
              }}
              token={token}
              navigation={navigation}
              style={styles.bookmarkButton}
              iconSize={20}
              color="#4A90E2"
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={64} color="#ccc" />
      <Text style={styles.emptyStateText}>Không tìm thấy sản phẩm phù hợp</Text>
      <Text style={styles.emptyStateSubtext}>
        Vui lòng thử lại với bộ lọc khác
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#4A90E2" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  };

  const _sortList = sortOrder === 'default' ? products : sortOrder === 'highToLow' ? [...products].sort((a, b) => b.price - a.price) : [...products].sort((a, b) => a.price - b.price);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImage} style={styles.logoImage} />
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={20} color="#999" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={toggleFilterModal}
        >
          <Ionicons name="options" size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
        <Text style={styles.sortButtonText}>
          {sortOrder === "default"
            ? "Mặc định"
            : sortOrder === "highToLow"
              ? "Giá cao → thấp"
              : "Giá thấp → cao"}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#333" />
      </TouchableOpacity>

      <FlatList
        data={_sortList}
        renderItem={renderProduct}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={[
          styles.productList,
          products.length === 0 && styles.emptyList,
        ]}
        // onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={!loading && renderEmptyState()}
        ListFooterComponent={renderFooter()}
      />

      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleFilterModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lọc sản phẩm</Text>
              <TouchableOpacity onPress={toggleFilterModal}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Thương hiệu</Text>
                <View style={styles.filterGrid}>
                  {brands.map((brand) => (
                    <TouchableOpacity
                      key={brand.id}
                      style={[
                        styles.filterChip,
                        selectedBrands.includes(brand.id) &&
                        styles.selectedFilterChip,
                      ]}
                      onPress={() => toggleFilter("brand", brand.id)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedBrands.includes(brand.id) &&
                          styles.selectedFilterChipText,
                        ]}
                      >
                        {brand.brandName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Danh mục</Text>
                <View style={styles.filterGrid}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.filterChip,
                        selectedCategories.includes(category.id) &&
                        styles.selectedFilterChip,
                      ]}
                      onPress={() => toggleFilter("category", category.id)}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          selectedCategories.includes(category.id) &&
                          styles.selectedFilterChipText,
                        ]}
                      >
                        {category.categoryName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Kích thước</Text>
                <TextInput
                  style={styles.sizeInput}
                  placeholder="Nhập kích thước"
                  value={sizeInput}
                  onChangeText={setSizeInput}
                  keyboardType="numeric"
                />
              </View> */}

              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Khoảng giá</Text>
                <View style={styles.priceInputContainer}>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="Giá thấp nhất"
                    keyboardType="numeric"
                    value={minPrice}
                    onChangeText={setMinPrice}
                  />
                  <Text style={styles.priceSeparator}>-</Text>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="Giá cao nhất"
                    keyboardType="numeric"
                    value={maxPrice}
                    onChangeText={setMaxPrice}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setSelectedBrands([]);
                  setSelectedCategories([]);
                  setSizeInput("");
                  setMinPrice("");
                  setMaxPrice("");
                }}
              >
                <Text style={styles.clearButtonText}>Xóa bộ lọc</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyButtonText}>Áp dụng</Text>
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
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  logoImage: {
    width: 80,
    height: 32,
    resizeMode: "contain",
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  filterButton: {
    padding: 8,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 12,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  sortButtonText: {
    fontSize: 14,
    marginRight: 4,
    color: "#4A90E2",
  },
  productList: {
    padding: 8,
  },
  emptyList: {
    flexGrow: 1,
  },
  productRow: {
    justifyContent: "space-between",
  },
  productCard: {
    width: (width - 36) / 2,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: "100%",
    height: 150,
    resizeMode: "contain",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  loadingFooter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalScroll: {
    flex: 1,
  },
  filterSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  filterGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginHorizontal: 4,
    marginBottom: 8,
    backgroundColor: "#FFF",
  },
  selectedFilterChip: {
    backgroundColor: "#E8F0FE",
    borderColor: "#4A90E2",
  },
  filterChipText: {
    fontSize: 14,
    color: "#333",
  },
  selectedFilterChipText: {
    color: "#4A90E2",
    fontWeight: "bold",
  },
  sizeInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  priceSeparator: {
    marginHorizontal: 8,
    fontSize: 16,
    color: "#333",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    alignItems: "center",
  },
  clearButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  bookmarkButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
});
