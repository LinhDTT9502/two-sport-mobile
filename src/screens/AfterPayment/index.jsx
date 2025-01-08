import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get('window');

const AfterPayment = ({ route }) => {
  const navigation = useNavigation();
  const { id, saleOrderCode, ...order } = route.params || {};

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

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

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.iconContainer}>
          <FontAwesome5 name="check-circle" size={80} color="#fff" />
        </View>
        <Text style={styles.title}>Thành công!</Text>
        <Text style={styles.message}>Cảm ơn bạn đã đặt hàng. Nhân viên sẽ kiểm tra đơn hàng và liên hệ xác nhận với quý khách.</Text>
        <TouchableOpacity
          style={[styles.button, styles.homeButton]}
          onPress={() => navigation.navigate("HomeController")}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, styles.homeButtonText]}>Quay về trang chủ</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#f0f8ff',
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

export default AfterPayment;

