import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

const OrderSuccessScreen = ({ route }) => {
  const navigation = useNavigation();
  const { id, saleOrderCode, rentalOrderCode, children, ...order } = route.params || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  console.log("Navigating to SelectPayment with order:", {
    id,
    saleOrderCode,
    rentalOrderCode,
    totalAmount: order?.saleCosts?.totalAmount || order?.rentalCosts?.totalAmount,
    tranSportFee: order?.tranSportFee || 0,
    ...order, 
  });

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderOrderDetails = () => {
    if (saleOrderCode) {
      return (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>
            <Text style={styles.boldText}>Mã đơn hàng:</Text> {saleOrderCode}
          </Text>
        </View>
      );
    } else if (rentalOrderCode) {
      return (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>
            <Text style={styles.boldText}>Mã đơn thuê:</Text> {rentalOrderCode}
          </Text>
          {children && children.length > 0 && (
            <View>
              <Text style={[styles.detailsText, styles.boldText, styles.childrenTitle]}>Đơn con:</Text>
              {children.map((child, index) => (
                <View key={index} style={styles.childOrder}>
                  <Text style={styles.detailsText}>
                    <Text style={styles.boldText}>Mã đơn con:</Text> {child.rentalOrderCode}
                  </Text>
                  <Text style={styles.detailsText}>
                    <Text style={styles.boldText}>Sản phẩm:</Text> {child.productName}
                  </Text>
                  <Text style={styles.detailsText}>
                    <Text style={styles.boldText}>Số lượng:</Text> {child.quantity}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      );
    } else {
      return <Text style={styles.errorText}>Lỗi: Thiếu thông tin đơn hàng.</Text>;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.iconContainer}>
            <FontAwesome5 name="check-circle" size={80} color="#fff" />
          </View>
          <Text style={styles.title}>Đặt hàng thành công!</Text>
          <Text style={styles.message}>Cảm ơn bạn đã đặt hàng.</Text>
          {renderOrderDetails()}
          <TouchableOpacity
  style={[styles.button, styles.paymentButton]}
  onPress={() =>
    navigation.navigate("SelectPayment", {
      order: {
        id,
        saleOrderCode,
        rentalOrderCode,
        totalAmount: order?.saleCosts?.totalAmount || order?.rentalCosts?.totalAmount,
        tranSportFee: order?.tranSportFee || 0,
        children: order.childOrders?.["$values"], // Truyền danh sách đơn con nếu có
        ...order,
      },
    })
  }
  
  activeOpacity={0.8}
>
  <Text style={styles.buttonText}>Tiếp tục thanh toán</Text>
</TouchableOpacity>


          <TouchableOpacity
            style={[styles.button, styles.homeButton]}
            onPress={() => navigation.navigate("HomeController")}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, styles.homeButtonText]}>Quay về trang chủ</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#f0f8ff',
    paddingVertical: 32,
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: width * 0.9,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  iconContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },
  detailsContainer: {
    backgroundColor: "#f7f7f7",
    padding: 20,
    borderRadius: 16,
    width: "100%",
    marginBottom: 28,
  },
  detailsText: {
    fontSize: 16,
    color: "#333",
    marginVertical: 6,
  },
  boldText: {
    fontWeight: "bold",
    color: "#4CAF50",
  },
  childrenTitle: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 18,
  },
  childOrder: {
    marginLeft: 16,
    marginBottom: 12,
    borderLeftWidth: 2,
    borderLeftColor: "#4CAF50",
    paddingLeft: 12,
  },
  errorText: {
    fontSize: 16,
    color: "#ff3b30",
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  paymentButton: {
    backgroundColor: "#4CAF50",
  },
  homeButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  homeButtonText: {
    color: "#4CAF50",
  },
});

export default OrderSuccessScreen;

