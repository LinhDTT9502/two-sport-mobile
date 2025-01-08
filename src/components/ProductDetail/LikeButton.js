import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const LikeButton = ({ isLiked, likes, onPress, disabled }) => {


  
  return (
    <TouchableOpacity
      style={styles.likeButton}
      onPress={onPress}
      disabled={disabled}
    >
      <AntDesign
        name={isLiked ? "like1" : "like2"}
        size={24}
        color={isLiked ? "#0035FF" : "#2C323A"}
      />
      {likes !== null && <Text style={styles.likeCount}>{likes}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    marginLeft: 5,
    fontSize: 16,
  },
});

export default LikeButton;