import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";

export const ContactInfoSection = ({ formData, handleChange }) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const renderInput = (label, name, icon, verifiable = false) => {
    return (
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <FontAwesome
            name={icon}
            size={20}
            color="#0035FF"
            style={styles.inputIcon}
          />
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={styles.inputWrapper}>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[
                styles.input,
                styles.nonEditableInput,
              ]}
              value={formData[name]}
              editable={false}
              placeholder={`Nhập ${label.toLowerCase()}`}
              placeholderTextColor="#A0AEC0"
            />
            {!formData[`Is${name}Verified`] && (
              <TouchableOpacity
                style={styles.changeButtonVerify}
                onPress={() => {/* Handle verification */}}
              >
                <Text style={styles.changeButtonTextInline}>Verify</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.changeButtonInline}
              onPress={() => name === "Email" ? setShowEmailModal(true) : setShowPhoneModal(true)}
            >
              <Text style={styles.changeButtonTextInline}>Thay đổi</Text>
            </TouchableOpacity>
          </View>
          {verifiable && (
            <FontAwesome
              name={formData[`Is${name}Verified`] ? "check-circle" : "times-circle"}
              size={24}
              color={formData[`Is${name}Verified`] ? "#4CAF50" : "#FF3B30"}
              style={styles.verifiedIcon}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
      {renderInput("Email", "Email", "envelope", true)}
      {renderInput("Số điện thoại", "Phone", "phone", true)}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showEmailModal}
        onRequestClose={() => setShowEmailModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thay đổi Email</Text>
            <TextInput
              style={styles.modalInput}
              value={newEmail}
              onChangeText={setNewEmail}
              placeholder="Nhập email mới"
              keyboardType="email-address"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowEmailModal(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={() => {
                  handleChange("Email", newEmail);
                  setShowEmailModal(false);
                }}
              >
                <Text style={styles.modalButtonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showPhoneModal}
        onRequestClose={() => setShowPhoneModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thay đổi Số điện thoại</Text>
            <TextInput
              style={styles.modalInput}
              value={newPhone}
              onChangeText={setNewPhone}
              placeholder="Nhập số điện thoại mới"
              keyboardType="phone-pad"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowPhoneModal(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={() => {
                  handleChange("Phone", newPhone);
                  setShowPhoneModal(false);
                }}
              >
                <Text style={styles.modalButtonText}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#4A5568",
    marginLeft: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputWithButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    overflow: "hidden",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  nonEditableInput: {
    backgroundColor: "#F7FAFC",
    color: "#718096",
  },
  changeButtonInline: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  changeButtonVerify: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  changeButtonTextInline: {
    color: "#0035FF",
    fontSize: 14,
    fontWeight: "bold",
  },
  verifiedIcon: {
    marginLeft: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#2D3748",
  },
  modalInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalCancelButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginRight: 8,
  },
  modalSaveButton: {
    backgroundColor: "#0035FF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginLeft: 8,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ContactInfoSection;

