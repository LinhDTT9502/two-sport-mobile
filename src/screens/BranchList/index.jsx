import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { fetchBranchs } from "../../services/branchService";

const BranchList = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await fetchBranchs();
        setBranches(data);
      } catch (error) {
        console.error("Error fetching branches:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBranches();
  }, []);

  const openPhone = (hotline) => {
    const url = `tel:${hotline}`;
    Linking.openURL(url).catch((err) =>
      console.error("Error opening phone:", err)
    );
  };

  const openGoogleMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url).catch((err) =>
      console.error("Error opening Google Maps:", err)
    );
  };

  const renderBranch = ({ item }) => (
    <View style={styles.branchCard}>
      <Image
        source={{
          uri: item.imgAvatarPath || "https://via.placeholder.com/150",
        }}
        style={styles.branchImage}
      />
      <View style={styles.branchInfo}>
        <Text style={styles.branchName}>{item.branchName}</Text>
        <TouchableOpacity
          onPress={() => openGoogleMaps(item.location)}
          style={styles.addressContainer}
        >
          <Ionicons name="location-outline" size={16} color="#4A90E2" />
          <Text style={styles.branchAddress}>{item.location}</Text>
        </TouchableOpacity>
        <View style={styles.hotlineContainer}>
          <Ionicons name="call-outline" size={16} color="#4A90E2" />
          <Text style={styles.branchHotline}>{item.hotline}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => openPhone(item.hotline)}
            style={styles.callButton}
          >
            <Ionicons name="call" size={16} color="#FFFFFF" />
            <Text style={styles.buttonText}>Gọi ngay</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openGoogleMaps(item.location)}
            style={styles.mapButton}
          >
            <Ionicons name="map" size={16} color="#FFFFFF" />
            <Text style={styles.buttonText}>Xem trên bản đồ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Đang tải danh sách chi nhánh...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4A90E2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Danh sách chi nhánh</Text>
      </View>
      <FlatList
        data={branches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBranch}
        contentContainerStyle={styles.container}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop:30,
    backgroundColor: "#F5F7FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  container: {
    padding: 16,
  },
  branchCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  branchImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  branchInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  branchName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  branchAddress: {
    fontSize: 14,
    color: "#4A90E2",
    marginLeft: 4,
    flex: 1,
  },
  hotlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  branchHotline: {
    fontSize: 14,
    color: "#4A90E2",
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4A90E2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2ecc71",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#4A90E2",
  },
});

export default BranchList;

