import axios from "axios";
import { message } from 'antd';
import { handleError } from '../utils/errorUtils';
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}/accounts`;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm interceptor để tự động gắn token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý response
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      message.error('Bạn không có quyền thực hiện thao tác này');
    } else if (error.response?.status === 401) {
      message.error('Phiên làm việc đã hết hạn');
      localStorage.removeItem('admin_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Lấy danh sách tất cả tài khoản
export const getAllAccounts = async () => {
  try {
    const response = await axiosInstance.get('');
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Lấy thông tin tài khoản theo ID
export const getAccountById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Lấy thông tin tài khoản theo username
export const getAccountByUsername = async (username) => {
  try {
    const response = await axiosInstance.get(`/username/${username}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Vô hiệu hóa tài khoản
export const deactivateAccount = async (id) => {
  try {
    const response = await axiosInstance.put(`/${id}/deactivate`);
    message.success('Đã vô hiệu hóa tài khoản thành công');
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Kích hoạt tài khoản
export const activateAccount = async (id) => {
  try {
    const response = await axiosInstance.put(`/${id}/activate`);
    message.success('Đã kích hoạt tài khoản thành công');
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Kiểm tra trạng thái tài khoản
export const checkAccountStatus = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data.status;
  } catch (error) {
    handleError(error);
    throw error;
  }
}; 