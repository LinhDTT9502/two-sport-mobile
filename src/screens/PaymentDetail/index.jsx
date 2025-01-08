import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";

export default function PaymentDetail() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Chi tiết thanh toán</Text>
      </View>

      <View style={styles.content}>
        <FontAwesomeIcon
          icon={faCheckCircle}
          size={80}
          color="#FF9900"
          style={styles.icon}
        />
        <Text style={styles.successMessage}>Thanh toán thành công.</Text>
        <Text style={styles.paymentTotal}>Tổng tiền: 2.000.000 VND</Text>

        <View style={styles.detailsSection}>
          <Text style={styles.detailLabel}>Ngày</Text>
          <Text style={styles.detailValue}>24 Tháng 4, 2024</Text>
          <Text style={styles.detailLabel}>Đơn hàng</Text>
          <Text style={styles.detailValue}>1.500.000 VND</Text>
          <Text style={styles.detailLabel}>Phí vận chuyển</Text>
          <Text style={styles.detailValue}>500.000 VND</Text>
          <Text style={styles.detailLabel}>Tổng cộng</Text>
          <Text style={styles.detailValue}>2.000.000 VND</Text>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  icon: {
    marginVertical: 20,
  },
  successMessage: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  paymentTotal: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF9900",
    marginBottom: 24,
  },
  detailsSection: {
    width: "100%",
    paddingHorizontal: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
});
