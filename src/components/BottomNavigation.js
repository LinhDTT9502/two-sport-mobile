import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faSearch, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';

export default function BottomNavigation({ setActiveScreen, activeScreen }) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => setActiveScreen('LandingPage')} style={styles.tabButton}>
        <View style={[styles.iconContainer, activeScreen === 'LandingPage' && styles.activeIconContainer]}>
          <FontAwesomeIcon icon={faHome} size={24} color={activeScreen === 'LandingPage' ? '#4A90E2' : '#999'} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setActiveScreen('SearchingPage')} style={styles.tabButton}>
        <View style={[styles.iconContainer, activeScreen === 'SearchingPage' && styles.activeIconContainer]}>
          <FontAwesomeIcon icon={faSearch} size={24} color={activeScreen === 'SearchingPage' ? '#4A90E2' : '#999'} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setActiveScreen('Cart')} style={styles.tabButton}>
        <View style={[styles.iconContainer, activeScreen === 'Cart' && styles.activeIconContainer]}>
          <FontAwesomeIcon icon={faShoppingCart} size={24} color={activeScreen === 'Cart' ? '#4A90E2' : '#999'} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setActiveScreen('Account')} style={styles.tabButton}>
        <View style={[styles.iconContainer, activeScreen === 'Account' && styles.activeIconContainer]}>
          <FontAwesomeIcon icon={faUser} size={24} color={activeScreen === 'Account' ? '#4A90E2' : '#999'} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    padding: 10,
    borderRadius: 20,
  },
  activeIconContainer: {
    backgroundColor: '#F0F4F8',
    elevation: 6,
    shadowColor: '#4A90E2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
