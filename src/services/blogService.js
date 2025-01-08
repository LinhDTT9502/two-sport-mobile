import {
    getAllBlogs as getAllBlogsApi,
    createBlog as createBlogApi,
    editBlog as editBlogApi,
    toggleBlogVisibility as toggleBlogVisibilityApi,
    deleteBlog as deleteBlogApi
  } from '../api/apiBlog';
  
  export const fetchAllBlogs = async () => {
    try {
      const response = await getAllBlogsApi();
    //   console.log("API Response:", response);
      return response.data?.data?.$values || []; 
    } catch (error) {
      console.error('Error fetching all blogs:', error);
      throw error;
    }
  };
  
  
  export const createNewBlog = async (blogData) => {
    try {
      const response = await createBlogApi(blogData);
      return response.data; 
    } catch (error) {
      console.error('Error creating new blog:', error);
      throw error;
    }
  };
  
  export const updateBlog = async (blogId, updatedData) => {
    try {
      const response = await editBlogApi(blogId, updatedData);
      return response.data; 
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  };
  
  export const toggleBlogVisibility = async (blogId) => {
    try {
      const response = await toggleBlogVisibilityApi(blogId);
      return response.data; 
    } catch (error) {
      console.error('Error toggling blog visibility:', error);
      throw error;
    }
  };
  
  export const removeBlog = async (blogId) => {
    try {
      const response = await deleteBlogApi(blogId);
      return response.data; 
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  };