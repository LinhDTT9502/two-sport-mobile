import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { fetchCustomerLoyalPoints } from "../../services/customerService";

export default function LoyalPoint({ userId }) {
  const [loyalPoints, setLoyalPoints] = useState(null);
  const [level, setLevel] = useState('');

  useEffect(() => {
    const fetchLoyaltyPoints = async () => {
      if (userId) {
        try {
          const points = await fetchCustomerLoyalPoints(userId);
          setLoyalPoints(points.loyaltyPoints);
          setLevel(points.membershipLevel);
        } catch (error) {
          // console.error("Error fetching loyalty points:", error);
        }
      }
    };

    fetchLoyaltyPoints();
  }, [userId]);

  if (loyalPoints === null) {
    return;
  }

  return (
    <View style={styles.container}>
       <Text style={styles.loyalPointsText}>Bạn là thành viên: {level}</Text>
      <Text style={styles.loyalPointsText}>Điểm tích lũy: {loyalPoints}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    alignItems: "center",
  },
  loyalPointsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF9800",
  },
  loadingText: {
    fontSize: 14,
    color: "#888",
  },
});
