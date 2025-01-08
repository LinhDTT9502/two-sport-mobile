import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { fetchAllBlogs } from "../../services/blogService"; 

const screenWidth = Dimensions.get("window").width;

export default function Blog() {
  const navigation = useNavigation();
  const [blogs, setBlogs] = useState([]); 
  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const blogData = await fetchAllBlogs();
        setBlogs(blogData); 
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    loadBlogs(); 
  }, []); 

  const renderBlogItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.blogItem}
      onPress={() => navigation.navigate("BlogDetail", { blog: item })}
    >
      {item.coverImgPath && <Image style={styles.coverImage} source={{ uri: item.coverImgPath }} />}
      <View style={styles.blogContent}>
        <Text style={styles.blogTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.blogSubtitle} numberOfLines={1}>{item.subTitle}</Text>
        <View style={styles.blogFooter}>
          <Image style={styles.avatar} source={{ uri: `https://i.pravatar.cc/100?u=${item.createdByStaffId}` }} />
          <View style={styles.authorInfo}>
            <Text style={styles.userName} numberOfLines={1}>{item.createdByStaffFullName}</Text>
            <Text style={styles.blogTime}>{new Date(item.createAt).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bài viết</Text>
      </View>

      <FlatList
        data={blogs}
        renderItem={renderBlogItem}
        keyExtractor={(item) => item.blogId.toString()} 
        contentContainerStyle={styles.listContainer}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#F0F2F5",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E6EB",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#050505",
  },
  listContainer: {
    padding: 14,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  blogItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: (screenWidth - 32) / 2 - 8,
  },
  coverImage: {
    width: "100%",
    height: 120,
  },
  blogContent: {
    padding: 12,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#050505",
    marginBottom: 4,
  },
  blogSubtitle: {
    fontSize: 12,
    color: "#65676B",
    marginBottom: 8,
  },
  blogFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  authorInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#050505",
  },
  blogTime: {
    fontSize: 10,
    color: "#65676B",
  },
});
