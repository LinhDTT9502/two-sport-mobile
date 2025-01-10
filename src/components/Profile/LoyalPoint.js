import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image } from "react-native";
import { fetchCustomerLoyalPoints } from "../../services/customerService";
import { FontAwesome } from "@expo/vector-icons";

export default function LoyalPoint({ userId }) {
  const [loyalPoints, setLoyalPoints] = useState(null);
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      if (userId) {
        try {
          const points = await fetchCustomerLoyalPoints(userId);
          setLoyalPoints(points.loyaltyPoints);
          setLevel(points.membershipLevel);
        } catch (error) {
          console.error("Error fetching loyalty points:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLoyaltyPoints();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFA000" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!loyalPoints) {
    return null;
  }

  const getLevelStyles = () => {
    switch (level) {
      case "Gold_Member":
        return { label: "Thành viên Vàng", color: "#FFD700", backgroundColor: "#FFF8DC" };
      case "Silver_Member":
        return { label: "Thành viên Bạc", color: "#C0C0C0", backgroundColor: "#F5F5F5" };
      case "Diamond_Member":
        return { label: "Thành viên Kim Cương", color: "#1E90FF", backgroundColor: "#E6F7FF" };
      default:
        return { label: "Thành viên Đồng", color: "#CD7F32", backgroundColor: "#FDF5E6" };
    }
  };

  const levelStyles = getLevelStyles();

  return (
    <View style={styles.container}>
      <View style={[styles.levelBadge, { backgroundColor: levelStyles.backgroundColor }]}>
        <FontAwesome name="trophy" size={20} color={levelStyles.color} />
        <Text style={[styles.levelText, { color: levelStyles.color }]}>{levelStyles.label}</Text>
      </View>
      <View style={styles.pointsContainer}>
        <FontAwesome name="star" size={18} color="#FFA000" style={styles.icon} />
        <Text style={styles.pointsText}>Điểm tích lũy: {loyalPoints}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  levelText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 5,
  },
  icon: {
    marginRight: 5,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#888",
  },
});
