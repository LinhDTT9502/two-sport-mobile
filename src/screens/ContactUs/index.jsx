import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../layouts/Header';
import contactus_bg from './images/contactus_bg.jpg';

const { width } = Dimensions.get('window');

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!name || !email || !subject || !message) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }
    Alert.alert('Success', 'Your message has been sent!');
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "android" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView>
        <Header />

        <View style={styles.bannerContainer}>
          <Image
            source={contactus_bg}
            style={styles.bannerImage}
          />
          <View style={styles.bannerOverlay}>
            <Text style={styles.bannerText}>Contact Us</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Get In Touch</Text>
            <Text style={styles.infoText}>
              We're here to help! If you have any questions or feedback, please don't hesitate to reach out.
            </Text>
            <View style={styles.contactInfo}>
              <View style={styles.contactItem}>
                <Ionicons name="location-outline" size={24} color="#524FF5" />
                <Text style={styles.contactText}>123 Sport Street, City, Country</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="call-outline" size={24} color="#524FF5" />
                <Text style={styles.contactText}>+1 234 567 890</Text>
              </View>
              <View style={styles.contactItem}>
                <Ionicons name="mail-outline" size={24} color="#524FF5" />
                <Text style={styles.contactText}>info@2sport.com</Text>
              </View>
            </View>
            <View style={styles.hoursInfo}>
              <Text style={styles.hoursTitle}>Open Hours:</Text>
              <Text style={styles.hoursText}>Mon to Fri: 9 AM - 6 PM</Text>
              <Text style={styles.hoursText}>Sat: 9 AM - 1 PM</Text>
              <Text style={styles.hoursText}>Sun: Closed</Text>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Send Us a Message</Text>
            <TextInput
              placeholder="Your Full Name"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Your Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Subject"
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
            />
            <TextInput
              placeholder="Message"
              style={[styles.input, styles.textArea]}
              value={message}
              onChangeText={setMessage}
              multiline={true}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {[
            { q: "What is 2Sport?", a: "2Sport is a global platform for sports enthusiasts to connect and enjoy events." },
            { q: "Do I need an account?", a: "Yes, having an account allows you to track your orders and event participation." },
            { q: "Do you offer international shipping?", a: "Yes, we offer international shipping to selected countries." },
          ].map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.faqQuestion}>{faq.q}</Text>
              <Text style={styles.faqAnswer}>{faq.a}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:30,
    backgroundColor: '#F5F7FA',
  },
  bannerContainer: {
    position: 'relative',
    height: 200,
    marginBottom: 20,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  contentContainer: {
    padding: 20,
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  contactInfo: {
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  hoursInfo: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 15,
  },
  hoursTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  hoursText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F5F7FA',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#524FF5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  faqSection: {
    padding: 20,
  },
  faqItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faqQuestion: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  faqAnswer: {
    fontSize: 16,
    color: '#666',
  },
});