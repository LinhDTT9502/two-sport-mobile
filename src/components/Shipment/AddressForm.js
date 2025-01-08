import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  fetchDistrict,
  fetchProvince,
  fetchWard,
} from "../../services/GHN/GHNService";
import { Ionicons } from "@expo/vector-icons";

const AddressForm = ({ onAddressChange }) => {
  const [formData, setFormData] = useState({
    province: "",
    district: "",
    ward: "",
    street: "",
  });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "province") {
      setDistricts([]);
      setWards([]);
      fetchDistricts(value);
    } else if (name === "district") {
      setWards([]);
      fetchWards(value);
    }
  };

  useEffect(() => {
    if (formData.province && formData.district && formData.ward) {
      const addressString = getAddressString();
      onAddressChange(addressString);
    }
  }, [formData]);

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const result = await fetchProvince();
        setProvinces(result);
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải danh sách tỉnh thành.");
      } finally {
        setLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  const fetchDistricts = async (provinceId) => {
    setLoading(true);
    try {
      const result = await fetchDistrict(provinceId);
      setDistricts(result);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách quận/huyện.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWards = async (districtId) => {
    setLoading(true);
    try {
      const result = await fetchWard(districtId);
      setWards(result);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách phường/xã.");
    } finally {
      setLoading(false);
    }
  };

  const getAddressString = () => {
    const selectedWard = wards.find((w) => w.WardCode === formData.ward);
    const selectedDistrict = districts.find(
      (d) => d.DistrictID === Number(formData.district)
    );
    const selectedProvince = provinces.find(
      (p) => p.ProvinceID === Number(formData.province)
    );

    const wardName = selectedWard ? selectedWard.WardName : "";
    const districtName = selectedDistrict ? selectedDistrict.DistrictName : "";
    const provinceName = selectedProvince ? selectedProvince.ProvinceName : "";

    return `${formData.street}, ${wardName}, ${districtName}, ${provinceName}`.trim();
  };

  const renderPicker = (
    value,
    onValueChange,
    items,
    placeholder,
    enabled = true
  ) => (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={value}
        onValueChange={onValueChange}
        enabled={enabled}
        style={styles.picker}
      >
        <Picker.Item label={placeholder} value="" />
        {items.map((item) => (
          <Picker.Item key={item.id} label={item.name} value={item.id} />
        ))}
      </Picker>
      <Ionicons
        name="chevron-down"
        size={24}
        color="#999"
        style={styles.pickerIcon}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Địa chỉ chi tiết</Text>
      <TextInput
        style={styles.input}
        placeholder="Số nhà, tên đường (VD: 123 đường Mạc Đĩnh Chi)"
        value={formData.street}
        onChangeText={(text) => handleInputChange("street", text)}
        placeholderTextColor="#999"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#FFA500" style={styles.loader} />
      ) : (
        <>
          <Text style={styles.label}>Tỉnh/Thành phố</Text>
          {renderPicker(
            formData.province,
            (value) => handleInputChange("province", value),
            provinces.map((p) => ({ id: p.ProvinceID, name: p.ProvinceName })),
            "Chọn tỉnh thành"
          )}

          <Text style={styles.label}>Quận/Huyện</Text>
          {renderPicker(
            formData.district,
            (value) => handleInputChange("district", value),
            districts.map((d) => ({ id: d.DistrictID, name: d.DistrictName })),
            "Chọn quận/huyện",
            !!formData.province
          )}

          <Text style={styles.label}>Phường/Xã</Text>
          {renderPicker(
            formData.ward,
            (value) => handleInputChange("ward", value),
            wards.map((w) => ({ id: w.WardCode, name: w.WardName })),
            "Chọn phường/xã",
            !!formData.district
          )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#F8F8F8",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    backgroundColor: "#F8F8F8",
    marginBottom: 20,
    position: "relative",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  pickerIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  loader: {
    marginTop: 20,
  },
});

export default AddressForm;
