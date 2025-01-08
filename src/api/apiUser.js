import axios from "axios";
import axiosInstance from "./axiosInstance";

const API_BASE_URL =
  "https://capstone-project-703387227873.asia-southeast1.run.app/api/User";

// GET all users
export const getAllUsers = () => {
  return axios.get(`${API_BASE_URL}/get-all-users`);
};


// GET search for users
export const searchUsers = (fullName, username) => {
  return axios.get(`${API_BASE_URL}/search`, {
    params: {
      ...(fullName && { fullName }),
      ...(username && { username }),
    },
  });
};

// GET user profile
export const getUserProfile = (userId) => {
  return axiosInstance.get(`${API_BASE_URL}/get-profile?userId=${userId}`);
};

export const getUserDetail = (userId) => {
  return axiosInstance.get(`${API_BASE_URL}/get-users-detail?userId=${userId}`);
};


// PUT update user profile
export const updateProfileApi = (userId, profileData) => {
  return axiosInstance.put(`${API_BASE_URL}/update-profile?id=${userId}`, profileData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// DELETE user
export const deleteUser = (userId) => {
  return axios.delete(`${API_BASE_URL}/delete-user/${userId}`);
};

// POST send verification email
export const sendVerificationEmail = (email) => {
  return axios.post(
    `${API_BASE_URL}/send-verification-email`,
    { email },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

// GET verify email
export const verifyEmail = (token) => {
  return axios.get(`${API_BASE_URL}/verify-email`, {
    params: { token },
  });
};

// POST upload avatar
export const uploadAvatarApi = (userId, avatarFile) => {
  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("Avatar", {
    uri: avatarFile.uri,
    name: avatarFile.name || "avatar.jpg",
    type: avatarFile.type || "image/jpeg",
  });

  // console.log("Uploading FormData:", formData);

  return axiosInstance.post(`${API_BASE_URL}/upload-avatar`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// POST gửi OTP để thay đổi email
export const sendOtpForEmailChange = (id, newEmail) => {
  // console.log(id)
  return axios.post(
    `${API_BASE_URL}/send-otp-to-email/${id}?email=${newEmail}`,
    {
      params: { id },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

// PUT thay đổi email
export const changeEmail = (userId, token, email, otpCode) => {
  // console.log(userId, token, email, otpCode);
  return axiosInstance.put(
    `${API_BASE_URL}/update-email/${userId}`,
    {  email, otpCode, token}, 
    {
      headers: {
        "Content-Type": "application/json",
       'Accept': '*/*',
      "Authorization": `Bearer ${token}`,
      },
    }
  );
};

