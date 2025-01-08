import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Feather } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export default function BlogDetail({ route }) {
  const { blog } = route.params;
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#050505" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blog Detail</Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {blog.coverImgPath && (
          <Image style={styles.coverImage} source={{ uri: blog.coverImgPath }} />
        )}
        <Text style={styles.title}>{blog.title}</Text>
        <Text style={styles.subtitle}>{blog.subTitle}</Text>
        <View style={styles.authorContainer}>
          <Image
            style={styles.avatar}
            source={{
              uri: `https://i.pravatar.cc/100?u=${blog.createdByStaffId}`,
            }}
          />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{blog.createdByStaffFullName}</Text>
            <Text style={styles.date}>
              {new Date(blog.createAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <Text style={styles.content}>{blog.content}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#FFFFFF",
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#050505",
  },
  placeholder: {
    width: 40,
  },
  contentContainer: {
    padding: 16,
  },
  coverImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#050505",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#65676B",
    marginBottom: 16,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#050505",
  },
  date: {
    fontSize: 14,
    color: "#65676B",
  },
  content: {
    fontSize: 16,
    color: "#050505",
    lineHeight: 24,
  },
});
