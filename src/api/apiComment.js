// apiComment.js
import axios from 'axios';
import axiosInstance from './axiosInstance';
const API_BASE_URL = 'https://capstone-project-703387227873.asia-southeast1.run.app/api/Comment';

export const fetchCommentsAPI = (productId) => {
    return axios.get(`${API_BASE_URL}/get-all-comments/${productId}`);
  };

  export const postCommentAPI = (productId, content, token) => {
    return axiosInstance.post(
      `${API_BASE_URL}/comment/${productId}`,
      { content },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  };
  

  export const editCommentAPI = (id, content, token) => {
    return axiosInstance.put(
      `${API_BASE_URL}/update-comment/${id}`,
      { content },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  };

export const deleteCommentAPI = (id, token) => {
  return axiosInstance.delete(`${API_BASE_URL}/remove-comment/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

export const replyCommentAPI = (productId, parentCommentId, content, token) => {
  return axiosInstance.post(
    `${API_BASE_URL}/reply-comment/${productId}?parentCommentId=${parentCommentId}`,
    { content },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
};

