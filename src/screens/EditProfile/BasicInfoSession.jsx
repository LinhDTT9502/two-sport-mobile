import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import dayjs from "dayjs";

export const BasicInfoSection = ({ 
  formData, 
  isEditing, 
  handleChange, 
  handleEdit, 
  handleSave, 
  handleCancel,
  showDatePicker,
  setShowDatePicker
}) => {
  const renderInput = (label, name, icon, editable = isEditing) => {
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
          {name === "BirthDate" && isEditing ? (
            <TouchableOpacity
              onPress={() => isEditing && setShowDatePicker(true)}
              style={[
                styles.input,
                !isEditing && styles.disabledInput,
                isEditing && styles.editableInput,
              ]}
            >
              <Text style={styles.dateButtonText}>
                {formData.BirthDate
                  ? dayjs(formData.BirthDate).format('DD/MM/YYYY')
                  : 'Chọn ngày'}
              </Text>
            </TouchableOpacity>
          ) : name === "Gender" ? (
            <Picker
              selectedValue={formData.Gender}
              onValueChange={(itemValue) => handleChange("Gender", itemValue)}
              enabled={isEditing}
              style={[
                styles.input,
                !isEditing && styles.disabledInput,
                isEditing && styles.editableInput,
              ]}
            >
              <Picker.Item label="Chọn giới tính" value="" />
              <Picker.Item label="Nam" value="male" />
              <Picker.Item label="Nữ" value="female" />
              <Picker.Item label="Khác" value="other" />
            </Picker>
          ) : (
            <TextInput
              style={[
                styles.input,
                !editable && styles.disabledInput,
                editable && styles.editableInput,
              ]}
              value={formData[name]}
              onChangeText={(value) => handleChange(name, value)}
              editable={editable}
              placeholder={`Nhập ${label.toLowerCase()}`}
              placeholderTextColor="#A0AEC0"
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>
        {isEditing ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
            <Text style={styles.buttonText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        )}
      </View>
      {renderInput("Tên người dùng", "UserName", "user", false)}
      {renderInput("Họ và tên", "FullName", "user")}
      {renderInput("Giới tính", "Gender", "venus-mars")}
      {renderInput("Ngày sinh", "BirthDate", "calendar")}
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3748",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#0035FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButton: {
    backgroundColor: "#28A745",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
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
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  editableInput: {
    backgroundColor: '#EDF2F7',
  },
  disabledInput: {
    backgroundColor: '#F7FAFC',
    color: '#718096',
  },
  inputIcon: {
    marginRight: 8,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#2D3748",
  },
});

