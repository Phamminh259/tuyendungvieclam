import axios from "axios";
import { handleError } from "../utils/errorUtils";
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}/employers`;
// Tạo instance axios cho employer
const employerApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để tự động thêm token vào header
employerApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("employer_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý response
employerApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.clear();
      window.location.href = "/login-employer";
    }
    return Promise.reject(error);
  }
);

// Lấy thông tin nhà tuyển dụng theo email
export const getEmployerByEmail = async (email) => {
  try {
    const response = await employerApi.get(`/get-by-email/${email}`);
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi lấy thông tin nhà tuyển dụng");
    throw error;
  }
};

// Lấy thông tin nhà tuyển dụng theo ID
export const getEmployerById = async (id) => {
  try {
    const response = await employerApi.get(`/get-by/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi lấy thông tin nhà tuyển dụng");
    throw error;
  }
};

// Lấy danh sách nhà tuyển dụng
export const getAllEmployers = async () => {
  try {
    const response = await employerApi.get("/list");
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi lấy danh sách nhà tuyển dụng");
    throw error;
  }
};

// Cập nhật thông tin nhà tuyển dụng
export const updateEmployer = async (id, employerData) => {
  try {
    const response = await employerApi.put(`/${id}`, employerData);
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi cập nhật thông tin nhà tuyển dụng");
    throw error;
  }
};

// Xóa nhà tuyển dụng
export const deleteEmployer = async (id) => {
  try {
    const response = await employerApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi xóa nhà tuyển dụng");
    throw error;
  }
};

// API liên quan đến gói dịch vụ và thống kê
export const employerServices = {
  // Lấy danh sách gói dịch vụ
  getSubscriptions: async (id) => {
    try {
      const response = await employerApi.get(`/${id}/subscriptions`);
      return response.data;
    } catch (error) {
      handleError(error, "Lỗi khi lấy danh sách gói dịch vụ");
      throw error;
    }
  },

  // Lấy danh sách việc làm
  getJobs: async (id) => {
    try {
      const response = await employerApi.get(`/${id}/jobs`);
      return response.data;
    } catch (error) {
      handleError(error, "Lỗi khi lấy danh sách việc làm");
      throw error;
    }
  },

  // Lấy thống kê
  getStatistics: async (id) => {
    try {
      const response = await employerApi.get(`/${id}/statistics`);
      return response.data;
    } catch (error) {
      handleError(error, "Lỗi khi lấy thống kê");
      throw error;
    }
  },
};

// Duyệt tài khoản nhà tuyển dụng
export const approveEmployer = async (id) => {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.put(`${BASE_URL}/approve/${id}`, null, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi duyệt tài khoản nhà tuyển dụng");
    throw error;
  }
};

// Tạm ngưng tài khoản nhà tuyển dụng  
export const suspendEmployer = async (id) => {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.put(`${BASE_URL}/suspend/${id}`, null, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error, "Lỗi khi tạm ngưng tài khoản nhà tuyển dụng");
    throw error;
  }
};
