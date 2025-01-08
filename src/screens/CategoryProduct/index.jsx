import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { fetchProducts, searchProducts } from '../../services/productService';

const { width } = Dimensions.get('window');

export default function CategoryProduct() {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryName } = route.params;
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('default');
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000000);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    loadCategoryProducts();
  }, [categoryName]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, sortOrder, minPrice, maxPrice]);

  const loadCategoryProducts = async () => {
    try {
      setLoading(true);
      const { products } = await fetchProducts(1);
      const categoryProducts = products.filter(
        (product) => product.categoryName.includes(categoryName)
      );
      setProducts(categoryProducts);
    } catch (error) {
      console.error('Error loading products by category:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products.filter(product => 
      product.price >= minPrice &&
      product.price <= maxPrice
    );

    switch (sortOrder) {
      case 'highToLow':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'lowToHigh':
        filtered.sort((a, b) => a.price - b.price);
        break;
      default:
        // Keep original order
        break;
    }

    setFilteredProducts(filtered);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => {
      if (prevOrder === 'default') return 'highToLow';
      if (prevOrder === 'highToLow') return 'lowToHigh';
      return 'default';
    });
  };

  const toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);

  const applyFilters = () => {
    filterAndSortProducts();
    toggleFilterModal();
  };

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      loadCategoryProducts();
      return;
    }
  
    setLoading(true);
    try {
      const response = await searchProducts(searchQuery);
      // console.log("API Response:", response);
      const searchResults = response.data?.$values || []; 
      const uniqueResults = [...new Map(searchResults.map(item => [item.id, item])).values()];
      setProducts(uniqueResults);
      setTotalProducts(uniqueResults.length);
    } catch (error) {
      console.error("Error searching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image
        source={{ uri: item.imgAvatarPath || item.image }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.productName || item.name}
        </Text>
        <Text style={styles.productPrice}>
          {item.price.toLocaleString()} ₫
        </Text>
      </View>
    </TouchableOpacity>
  );

  const _sortList = sortOrder === 'default' ? filteredProducts : sortOrder === 'highToLow' ? [...filteredProducts].sort((a, b) => b.price - a.price) : [...filteredProducts].sort((a, b) => a.price - b.price);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName}</Text>
      </View>
      <View style={styles.searchContainer}>
      <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={20} color="#999" />
          </TouchableOpacity>
        <TouchableOpacity onPress={toggleSortOrder} style={styles.sortButton}>
          <Ionicons
            name={sortOrder === 'lowToHigh' ? 'arrow-up' : 'arrow-down'}
            size={20}
            color="#333"
          />
          <Text style={styles.sortButtonText}>
            {sortOrder === 'default'
              ? 'Mặc định'
              : sortOrder === 'highToLow'
              ? 'Giá cao → thấp'
              : 'Giá thấp → cao'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleFilterModal}>
          <Ionicons name="options-outline" size={24} color="#4A90E2" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
      ) : filteredProducts.length === 0 ? (
        <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
      ) : (
        <FlatList
          data={_sortList}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productsContainer}
        />
      )}

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
            <View style={styles.priceFilterContainer}>
              <Text style={styles.priceFilterTitle}>Khoảng giá</Text>
              <View style={styles.priceInputContainer}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Giá thấp nhất"
                  keyboardType="numeric"
                  value={minPrice.toString()}
                  onChangeText={(text) => setMinPrice(parseInt(text) || 0)}
                />
                <Text style={styles.priceSeparator}>-</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Giá cao nhất"
                  keyboardType="numeric"
                  value={maxPrice.toString()}
                  onChangeText={(text) => setMaxPrice(parseInt(text) || 1000000000)}
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={applyFilters}
            >
              <Text style={styles.applyButtonText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#EEEEEE',
  },
  sortButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  productsContainer: {
    padding: 8,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 8,
    width: (width - 48) / 2,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
    color: '#666',
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
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  priceFilterContainer: {
    marginTop: 20,
  },
  priceFilterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  priceSeparator: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  applyButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  applyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});