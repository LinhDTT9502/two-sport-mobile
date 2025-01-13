import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { fetchReviewsByProductCode } from '../../services/reviewService';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';

const ProductReviews = ({ productCode }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useSelector(selectUser);
  const [visibleCount, setVisibleCount] = useState(5);
  const REVIEWS_PER_LOAD = 5;

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const fetchedReviews = await fetchReviewsByProductCode(productCode);
        setReviews(fetchedReviews);
      } catch (err) {
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [productCode]);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + REVIEWS_PER_LOAD);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6600" />
      </View>
    );
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (reviews.length === 0) {
    return <Text style={styles.noReviewsText}>Sản phẩm chưa có đánh giá nào.</Text>;
  }

  const renderReviewItem = ({ item: review }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          {/* <Image
            source={{ uri: review.userAvatar || 'https://via.placeholder.com/40' }}
            style={styles.userAvatar}
          /> */}
          <View>
            <Text style={styles.userName}>{review.userName}</Text>
            <Text style={styles.reviewDate}>
              {new Date(review.createdAt || Date.now()).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.starContainer}>
          {[...Array(5)].map((_, i) => (
            <FontAwesome
              key={i}
              name="star"
              size={16}
              color={i < review.star ? '#FFD700' : '#E0E0E0'}
            />
          ))}
        </View>
      </View>
      <Text style={styles.purchaseInfo}>
        Đã mua: {review.color} - {review.size} - {review.condition}%
      </Text>
      <Text style={styles.reviewContent}>{review.reviewContent}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đánh giá của khách hàng</Text>
      <FlatList
        data={reviews.slice(0, visibleCount)}
        renderItem={renderReviewItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.reviewList}
      />
      {visibleCount < reviews.length && (
        <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
          <Text style={styles.loadMoreText}>Xem thêm đánh giá</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      marginTop: 24,
      marginBottom: 16,
      paddingHorizontal: 16,
      backgroundColor: '#FAFAFA',
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 16,
      color: '#333',
      textAlign: 'center',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: 100,
    },
    errorText: {
      color: '#FF3B30',
      textAlign: 'center',
      marginTop: 16,
      fontSize: 16,
    },
    noReviewsText: {
      color: '#999',
      textAlign: 'center',
      marginTop: 16,
      fontStyle: 'italic',
      fontSize: 16,
    },
    reviewList: {
      paddingBottom: 16,
    },
    reviewItem: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
      borderWidth: 1,
      borderColor: '#F0F0F0',
    },
    reviewHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    userName: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#333',
    },
    starContainer: {
      flexDirection: 'row',
    },
    reviewContent: {
      color: '#444',
      marginTop: 12,
      fontSize: 15,
      lineHeight: 22,
      fontStyle: 'normal',
    },
    reviewDate: {
      color: '#BBB',
      fontSize: 12,
      marginTop: 4,
    },
    purchaseInfo: {
      fontSize: 14,
      color: '#666',
      marginBottom: 8,
      fontStyle: 'italic',
    },
    loadMoreButton: {
      alignItems: 'center',
      marginTop: 16,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: '#FF6600',
      shadowColor: '#FF6600',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    loadMoreText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },

  });
  

export default ProductReviews;

