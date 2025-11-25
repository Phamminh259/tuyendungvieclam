import axios from 'axios';
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}/files`;

const uploadApi = axios.create({
  baseURL: BASE_URL
});

const uploadService = {
  uploadAvatar: async (file, token) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await uploadApi.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Upload response:', response.data);
      return response.data.url;
    } catch (error) {
      console.error('Upload error:', error.response || error);
      throw new Error('Lỗi khi upload ảnh: ' + (error.response?.data?.message || error.message));
    }
  },

  uploadCV: async (file, token) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await uploadApi.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Upload CV response:', response.data);
      const optimizedUrl = response.data.url.replace('/upload/', '/upload/f_auto,q_auto/');
      return optimizedUrl;
    } catch (error) {
      console.error('Upload CV error:', error.response || error);
      throw new Error('Lỗi khi upload CV: ' + (error.response?.data?.message || error.message));
    }
  },
};

export default uploadService;