// Footer.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Footer() {
  const navigation = useNavigation();

  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('HomePage')}>
        <Ionicons name="home-outline" size={24} color="#333" />
        <Text style={styles.footerText}>Trang chủ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('ProductList')}>
        <Ionicons name="grid-outline" size={24} color="#333" />
        <Text style={styles.footerText}>Sản phẩm</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Introduction')}>
        <Ionicons name="information-circle-outline" size={24} color="#333" />
        <Text style={styles.footerText}>Giới thiệu</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('ContactUs')}>
        <Ionicons name="call-outline" size={24} color="#333" />
        <Text style={styles.footerText}>Liên hệ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerItem: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#333',
    marginTop: 2,
  },
});
