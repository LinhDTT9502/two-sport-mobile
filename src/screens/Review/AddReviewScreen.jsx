import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating } from 'react-native-ratings';

const AddReviewScreen = ({ navigation, route }) => {
  const { orderId } = route.params;
  const [products, setProducts] = useState([]);
  const [selectedProductCode, setSelectedProductCode] = useState(null);
  const [star, setStar] = useState(0);
  const [reviewContent, setReviewContent] = useState('');
  console.log(selectedProductCode);
  

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          Alert.alert('Error', 'User is not authenticated.');
          return;
        }

        const response = await fetch(
          `https://capstone-project-703387227873.asia-southeast1.run.app/api/SaleOrder/get-sale-order-detail?orderId=${orderId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await response.json();

        if (data.isSuccess) {
          const uniqueProducts = Array.from(
            new Map(
              data.data.saleOrderDetailVMs.$values.map(product => [product.productCode, product])
            ).values()
          );
          setProducts(uniqueProducts);
        } else {
          Alert.alert('Error', data.message || 'Failed to fetch order details.');
        }
      } catch (error) {
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleSubmit = async () => {
    if (!selectedProductCode) {
      Alert.alert('Error', 'Chọn sản phẩm để đánh giá!');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Error', 'User is not authenticated.');
        return;
      }

      const response = await fetch(
        `https://capstone-project-703387227873.asia-southeast1.run.app/api/Review/add-review/${orderId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: selectedProductCode,
            star,
            reviewContent,
          }),
        }
      );
console.log(response);

      if (response.ok) {
        Alert.alert('Success', '2Sport cảm ơn bạn đã chia sẻ cảm nhận!');
        setProducts(prevProducts => prevProducts.filter(product => product.productCode !== selectedProductCode));
        setStar(0);
        setReviewContent('');
        setSelectedProductCode(null);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Failed to submit review.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => setSelectedProductCode(item.productId)}
    >
      <Image source={{ uri: item.imgAvatarPath }} style={styles.productImage} />
      <Text style={styles.productName}>{item.productName}</Text>
      {selectedProductCode === item.productCode && <Text style={styles.selected}>Đã chọn</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Hãy chọn sản phẩm để đánh giá:</Text>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.productCode}
      />

      {selectedProductCode && (
        <>
          <Text style={styles.label}>Đánh giá chất lượng sản phẩm:</Text>
          <Rating
            type="star"
            startingValue={0}
            ratingCount={5}
            imageSize={30}
            onFinishRating={setStar}
          />

          
          <TextInput
            style={styles.textArea}
            placeholder="Hãy chia sẻ nhận xét của bạn nhé!"
            multiline
            numberOfLines={4}
            value={reviewContent}
            onChangeText={setReviewContent}
          />

          <Button title="Submit Review" onPress={handleSubmit} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  productName: {
    flex: 1,
    fontSize: 14,
  },
  selected: {
    color: 'green',
    fontWeight: 'bold',
  },
});

export default AddReviewScreen;
