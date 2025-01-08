import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../layouts/Header';

const members = [
  {
    name: "Nguyễn Quốc Nhân",
    specialisations: "CEO",
    image: require('./images/nhan-cu-li.jpg'),
  },
  {
    name: "Nguyễn Tuấn Vũ",
    specialisations: "CTO",
    image: require('./images/sep-tong.jpg'),
  },
  {
    name: "Dương Thị Trúc Linh",
    specialisations: "CHRO",
    image: require('./images/shark-linh.jpg'),
  },
  {
    name: "Dương Chí Khang",
    specialisations: "CHRO",
    image: require('./images/kdc.jpg'),
  },
];

const { width } = Dimensions.get('window');

export default function IntroductionScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.headerSection}>
          <Image
            source={require('./images/AboutUs.png')}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>Giới thiệu về chúng tôi</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Chào mừng đến với 2Sport!</Text>
          <Text style={styles.description}>
            Chúng tôi là một công ty chuyên cung cấp các dịch vụ thể thao và chăm sóc sức khỏe cho cộng đồng. Sứ mệnh của chúng tôi là giúp bạn phát triển một lối sống lành mạnh thông qua các sản phẩm và dịch vụ thể thao chất lượng cao.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Giá trị của chúng tôi</Text>
          <Text style={styles.description}>
            Chúng tôi luôn cung cấp các sản phẩm và dịch vụ tốt nhất đến khách hàng.
          </Text>
          <Image
            source={require('./images/about-us-1.jpg')}
            style={styles.valueImage}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Tầm nhìn và Sứ mệnh</Text>
          {['Chất lượng hàng đầu', 'Dịch vụ tận tâm', 'Cộng đồng phát triển'].map((text, index) => (
            <View key={index} style={styles.iconSection}>
              <Ionicons name="checkmark-circle" size={24} color="#4A90E2" />
              <Text style={styles.iconText}>{text}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.title, styles.teamTitle]}>Đội ngũ của chúng tôi</Text>
        <View style={styles.teamGrid}>
          {members.map((member, index) => (
            <View key={index} style={styles.memberCard}>
              <Image source={member.image} style={styles.memberImage} />
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberSpecialisations}>{member.specialisations}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:30,
    backgroundColor: '#F5F5F5',
  },
  content: {
    marginTop:30,

    paddingHorizontal: 16,
  },
  headerSection: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 28,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  valueImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 12,
  },
  iconSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  iconText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  teamTitle: {
    marginTop: 24,
    marginBottom: 16,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  memberCard: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  memberImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  memberSpecialisations: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});