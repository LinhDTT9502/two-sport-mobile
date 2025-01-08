import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  primary: "#3366FF",
  dark: "#2C3E50",
};

export default function QuantityControl({ quantity, onIncrease, onDecrease, onQuantityChange }) {
  const [inputQuantity, setInputQuantity] = useState(quantity.toString());

  const handleQuantityChange = (text) => {
    setInputQuantity(text);
    const newQuantity = parseInt(text, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      onQuantityChange(newQuantity);
    }
  };

  const handleBlur = () => {
    const newQuantity = parseInt(inputQuantity, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      setInputQuantity(quantity.toString());
    }
  };

  return (
    <View style={styles.quantityContainer}>
      <TouchableOpacity
        style={styles.quantityButton}
        onPress={onDecrease}
      >
        <Ionicons name="remove" size={20} color={COLORS.primary} />
      </TouchableOpacity>
      <TextInput
        style={styles.quantityInput}
        value={inputQuantity}
        onChangeText={handleQuantityChange}
        onBlur={handleBlur}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={styles.quantityButton}
        onPress={onIncrease}
      >
        <Ionicons name="add" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECF0F1",
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    padding: 8,
  },
  quantityInput: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.dark,
    marginHorizontal: 12,
    minWidth: 30,
    textAlign: 'center',
  },
});