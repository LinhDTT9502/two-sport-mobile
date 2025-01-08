import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const BuyNowButton = ({ onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <FontAwesome name="shopping-bag" size={20} color="#FFF" />
    <Text style={styles.text}>Mua Ngay</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0035FF',
    paddingVertical: 14,
    borderRadius: 8,
    elevation: 2,
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default BuyNowButton;