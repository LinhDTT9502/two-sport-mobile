import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const StatusTabs = ({ statusList, selectedStatus, setSelectedStatus }) => {
  const renderTab = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.tab,
        selectedStatus === item.value && styles.activeTab,
      ]}
      onPress={() => setSelectedStatus(item.value)}
    >
      <Text
        style={[
          styles.tabText,
          selectedStatus === item.value && styles.activeTabText,
        ]}
        numberOfLines={1}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={statusList}
        renderItem={renderTab}
        keyExtractor={item => item.value}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tabsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
    backgroundColor: '#F5F5F5',
    minWidth: 90,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FF9900',
  },
  tabText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default StatusTabs;

