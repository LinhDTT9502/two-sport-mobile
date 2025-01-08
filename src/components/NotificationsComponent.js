import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";

const notifications = [
  { id: '1', message: 'Your order #1234 has been shipped.' },
  { id: '2', message: 'A new product has been added to your wishlist.' },
  { id: '3', message: 'Your password was changed successfully.' },
  { id: '4', message: 'Limited-time offer: 20% off on select items!' },
];

export default function NotificationComponent({ onClose }) {
  const renderNotification = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationText}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>X</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 100,
    right: 20,
    width: 300,
    backgroundColor: "#FFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    padding: 16,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 16,
    color: "#FF6B6B",
  },
  notificationItem: {
    paddingVertical: 10,
    borderBottomColor: "#EEE",
    borderBottomWidth: 1,
  },
  notificationText: {
    fontSize: 14,
    color: "#333",
  },
});
