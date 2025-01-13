import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  Modal,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, updateUser } from "../../redux/slices/authSlice";
import {
  fetchUserProfile,
  saveUserProfile,
  sendSmsOtpService,
  sendOtpForEmailChangeService,
  changeEmailService,
} from "../../services/userService";
import { Picker } from "@react-native-picker/picker";
import { uploadAvatar } from "../../services/userService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import * as ImagePicker from 'expo-image-picker';
import { updateProfileApi } from "../../api/apiUser";
import { sendSmsOtp } from "../../services/authService";

export default function EditProfile() {
  const navigation = useNavigation();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [initialData, setInitialData] = useState({});
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  console.log(newPhone)
  const [avatarFile, setAvatarFile] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");

  const [token, setToken] = useState("");

  const handleAvatarChange = async (file) => {
    if (!file) {
      Alert.alert("Thông báo", "Vui lòng chọn ảnh trước khi tải lên.");
      return;
    }

    try {
      const response = await uploadAvatar(user.UserId, file);

      // console.log("Response upload avatar:", response);

      if (response) {
        Alert.alert("Thành công", "Ảnh đại diện đã được cập nhật.");

        const updatedProfile = await fetchUserProfile(user.UserId);
        dispatch(
          updateUser({ ...user, ImgAvatarPath: response.imgAvatarPath })
        );

        setFormData((prev) => ({
          ...prev,
          ImgAvatarPath: response.imgAvatarPath,
        }));
      }
    } catch (error) {
      console.error(
        "Error in handleAvatarChange:",
        error?.response || error?.message
      );
      const errorMessage =
        error?.response?.data?.message || "Không thể tải lên ảnh đại diện.";
      Alert.alert("Lỗi", errorMessage);
    }
  };

  const requestMediaLibraryPermission = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Cấp quyền bị từ chối",
          "Ứng dụng cần quyền truy cập thư viện ảnh để chọn ảnh. Vui lòng cấp quyền trong cài đặt thiết bị."
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error requesting media library permissions:", error);
      return false;
    }
  };

  const pickImage = async () => {
    // lấy quyền
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return null;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Chọn ảnh vuông
        quality: 0.5, // Nén chất lượng ảnh
      });

      if (!result.canceled) {
        const file = {
          uri: result.assets[0].uri,
          name: result.assets[0].uri.split("/").pop(),
          type: "image/jpeg",
        };
        return file;
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Lỗi", "Không thể chọn ảnh.");
    }
    return null;
  };

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profileData = await fetchUserProfile(user.UserId);
        if (profileData) {
          const newData = {
            UserName: profileData.userName || "",
            ImgAvatarPath: profileData.imgAvatarPath || "",
            FullName: profileData.fullName || "",
            Gender: profileData.gender || "",
            BirthDate: profileData.dob || "",
            Email: profileData.email || "",
            Address: profileData.address || "",
            Phone: profileData.phoneNumber || "",
            IsEmailVerified: profileData.emailConfirmed || false,
            IsPhoneVerified: profileData.phoneConfirmed || false,
          };
          setFormData(newData);
          setInitialData(newData);
        } else {
          Alert.alert("Thông báo", "Không có dữ liệu người dùng.");
        }
      } catch (error) {
        Alert.alert("Lỗi", "Không thể tải thông tin người dùng.");
      }
    };

    loadUserProfile();
  }, [user.UserId]);

  const handleChange = async (name, value) => {
    try {
      const data = {
        "fullName": formData?.FullName,
        "gender": formData?.Gender || 'male',
        "phone": formData?.Phone,
        "address": formData?.Address || '1',
        "birthDate": "2024-12-01T18:21:18.775Z"
      };
      if (name === "Phone") {
        data.phone = value;
      }
      const res = await updateProfileApi(user?.UserId, data);
      setFormData({ ...formData, [name]: value });
    } catch (error) {
      // console.log("🚀 ~ handleChange ~ error:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (JSON.stringify(formData) === JSON.stringify(initialData)) {
      Alert.alert("Cảnh báo", "Không có thay đổi nào được thực hiện.");
      return;
    }

    try {
      await saveUserProfile(user.UserId, formData);
      setIsEditing(false);
      dispatch(updateUser(formData));
      Alert.alert("Thành công", "Thông tin đã được cập nhật.");
      setInitialData(formData);
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Lỗi",
        `Cập nhật thất bại: ${
          error.response?.data?.message || "Vui lòng thử lại."
        }`
      );
    }
  };

  const handleCancel = () => {
    setFormData(initialData);
    setIsEditing(false);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = formatDateForAPI(selectedDate);
      handleChange("BirthDate", formattedDate);
    }
  };

  const formatDateForAPI = (date) => {
    return date.toISOString().split("T")[0];
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString || dateString === "0001-01-01T00:00:00") return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return `${date.getDate().toString().padStart(2, "0")}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const handleEmailChange = () => {
    setNewEmail(formData.Email);
    setShowEmailModal(true);
  };

  const handlePhoneChange = () => {
    setNewPhone(formData.Phone);
    
    setShowPhoneModal(true);
  };

  const handleEmailSave = async () => {
    if (!newEmail) {
      Alert.alert("Lỗi", "Vui lòng nhập email mới.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      Alert.alert("Lỗi", "Email không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }

    try {
      const data = await sendOtpForEmailChangeService(user.UserId, newEmail);
      // console.log(data)

      setToken(data.token);
      setOtpSent(true);
      Alert.alert("Thông báo", "Mã OTP đã được gửi đến email mới của bạn.");
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  const handleOtpVerification = async () => {
    if (!otp) {
      setOtpError("Vui lòng nhập mã OTP.");
      return;
    }
  
    try {
      const response = await changeEmailService(user.UserId, token, newEmail, otp);
      // console.log(response)
      if (response.isSuccess === true) {
        
        handleChange("Email", newEmail); 
        setShowEmailModal(false);
        Alert.alert("Thông báo", "Email đã được thay đổi thành công.");
      } else {
        setOtpError("Mã OTP không hợp lệ. Vui lòng thử lại.");
      }
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };
  

  const handlePhoneSave = async () => {
    if (newPhone) {
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
      // if (!phoneRegex.test(newPhone)) {
      //   Alert.alert(
      //     "Lỗi",
      //     "Số điện thoại không hợp lệ. Vui lòng kiểm tra lại."
      //   );
      //   return;
      // }
    }
    await handleChange("Phone", newPhone);
    setShowPhoneModal(false);
  };

  const handleVerify = async (val) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await sendSmsOtp(formData?.Phone, token);
      setShowVerify(true);
    } catch (error) {
      // console.log("🚀 ~ handleVerify ~ error:", error);
    }
  };

  const renderInput = (
    label,
    name,
    icon,
    editable = isEditing,
    verifiable = false
  ) => {
    return <View style={styles.inputContainer}>
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
            {formData.BirthDate ? dayjs(formData.BirthDate).format("DD/MM/YYYY") : "Chọn ngày"}
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
        <View style={styles.inputWithButton}>
          <TextInput
            style={[
              styles.input,
              !editable && styles.disabledInput,
              editable && styles.editableInput,
              (name === "Email" || name === "Phone") &&
                styles.nonEditableInput,
            ]}
            value={name === 'BirthDate' ? dayjs(formData.BirthDate).format("DD/MM/YYYY") : formData[name]}
            onChangeText={(value) => handleChange(name, value)}
            editable={editable && name !== "Email" && name !== "Phone"}
            placeholder={`Nhập ${label.toLowerCase()}`}
            placeholderTextColor="#A0AEC0"
          />
          {(name === "Email" || name === "Phone") && !formData[`Is${name}Verified`] && (
            <TouchableOpacity
              style={styles.changeButtonVerify}
              onPress={
                () => handleVerify(name)
              }
            >
              <Text style={styles.changeButtonTextInline}>Verify</Text>
            </TouchableOpacity>
          )}
          {(name === "Email" || name === "Phone") && (
            <TouchableOpacity
              style={styles.changeButtonInline}
              onPress={
                name === "Email" ? handleEmailChange : handlePhoneChange
              }
            >
              <Text style={styles.changeButtonTextInline}>Thay đổi</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {verifiable && (
        <FontAwesome
          name={
            formData[`Is${name}Verified`] ? "check-circle" : "times-circle"
          }
          size={24}
          color={formData[`Is${name}Verified`] ? "#4CAF50" : "#FF3B30"}
          style={styles.verifiedIcon}
        />
      )}
    </View>
  </View>
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <FontAwesome name="arrow-left" size={24} color="#0035FF" />
        </TouchableOpacity>
        <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: `${formData.ImgAvatarPath}?t=${new Date().getTime()}`,
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={async () => {
              const selectedFile = await pickImage();
              if (selectedFile) {
                setAvatarFile(selectedFile);
                await handleAvatarChange(selectedFile);
              }
            }}
          >
            <FontAwesome name="camera" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
          {renderInput("Email", "Email", "envelope", true, true)}
          {renderInput("Số điện thoại", "Phone", "phone", true, true)}
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={
            new Date(
              formData.BirthDate && formData.BirthDate !== "0001-01-01T00:00:00"
                ? formData.BirthDate
                : Date.now()
            )
          }
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showEmailModal}
        onRequestClose={() => setShowEmailModal(false)}
      >
        <View style={styles.modalContainer}>z
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thay đổi Email</Text>
            {!otpSent ? (
              <>
                <TextInput
                  style={styles.modalInput}
                  value={newEmail}
                  onChangeText={setNewEmail}
                  placeholder="Nhập email mới"
                  keyboardType="email-address"
                />
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleEmailSave}
                >
                  <Text style={styles.modalButtonText}>Gửi OTP</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.modalInput}
                  value={otp}
                  onChangeText={setOtp}
                  placeholder="Nhập mã OTP"
                  keyboardType="numeric"
                />
                {otpError ? (
                  <Text style={styles.errorText}>{otpError}</Text>
                ) : null}
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleOtpVerification}
                >
                  <Text style={styles.modalButtonText}>Xác nhận</Text>
                </TouchableOpacity>
              </>
            )}
            <View style={styles.navButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowEmailModal(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
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
              // maxLength={10}
            />
            <View style={styles.navButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowPhoneModal(false)}
              >
                <Text style={styles.modalButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handlePhoneSave}
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
        visible={showVerify}
        onRequestClose={() => setShowVerify(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Nhập mã OTP đã gửi tới email của bạn:</Text>
            <TextInput
              placeholder="Mã OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={() => {}}>
              <Text>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: "#F0F4F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D3748",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  profileImageContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#0035FF",
  },
  changePhotoButton: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#0035FF",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
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
    color: "#2D3748",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  editableInput: {
    backgroundColor: "#EDF2F7",
  },
  disabledInput: {
    backgroundColor: "#F7FAFC",
    color: "#718096",
  },
  inputIcon: {
    marginRight: 8,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#2D3748",
  },
  verifiedIcon: {
    marginLeft: 12,
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
  nonEditableInput: {
    flex: 1,
    backgroundColor: "#F7FAFC",
    color: "#718096",
    paddingRight: 80, // Make room for the inline button
  },
  changeButtonInline: {
    position: "absolute",
    right: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  changeButtonVerify: {
    position: "absolute",
    right: 80,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  changeButtonTextInline: {
    color: "#0035FF",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    width: "100%",
  },
  modalButton: {
    backgroundColor: "#0035FF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  modalCancelButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },

  navButtonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    width: "100%",
  },
});