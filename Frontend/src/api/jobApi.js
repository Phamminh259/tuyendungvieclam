import axios from "axios";
import { handleError } from "../utils/errorUtils";
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}`;

// Tạo axios instance với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm interceptor để tự động gắn token vào header

axiosInstance.interceptors.request.use(
  (config) => {
    // Sửa lại key để lấy đúng token từ localStorage
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

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("employer_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Tạo tin tuyển dụng mới
export const createJob = async (data) => {
  try {
    // Log request
    console.log('Creating job with data:', data);
    
    const response = await axiosInstance.post("/jobs", data);
    console.log('Create job response:', response.data);
    return response.data;
  } catch (error) {
    // Log error details
    console.error('Create job error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    handleError(error);
    throw error;
  }
};

// Lấy tin tuyển dụng theo ID
export const getJobById = async (id) => {
  try {
    const response = await axiosInstance.get(`/jobs/get-by/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Lấy tất cả tin tuyển dụng
export const getAllJobs = async () => {
  try {
    const response = await axiosInstance.get("/jobs/list");
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Lấy tin tuyển dụng theo ID của nhà tuyển dụng
export const getJobsByEmployerId = async (employerId) => {
  try {
    const response = await axiosInstance.get(`/jobs/employer/${employerId}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Cập nhật tin tuyển dụng
export const updateJob = async (id, data) => {
  try {
    console.log('Request URL:', `/jobs/${id}`);
    console.log('Request Data:', JSON.stringify(data, null, 2));
    const response = await axiosInstance.put(`/jobs/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Update Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    handleError(error);
    throw error;
  }
};
// Xóa tin tuyển dụng
export const deleteJob = async (id) => {
  try {
    await axiosInstance.delete(`/jobs/${id}`);
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Lấy tin tuyển dụng hot
export const getHotJobs = async (limit = 10) => {
  try {
    const response = await axiosInstance.get(`/jobs/hot?limit=${limit}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Lấy tin tuyển dụng mới nhất
export const getLatestJobs = async (limit = 10) => {
  try {
    const response = await axiosInstance.get(`/jobs/latest?limit=${limit}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Duyệt tin tuyển dụng (Admin only)
export const approveJob = async (id) => {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.put(`${BASE_URL}/jobs/${id}/approve`, null, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Từ chối tin tuyển dụng (Admin only)
export const rejectJob = async (id) => {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.put(`${BASE_URL}/jobs/${id}/reject`, null, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Lấy giới hạn tin thường và tin nổi bật
export const getJobLimits = async (employerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/jobs/quota/${employerId}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

