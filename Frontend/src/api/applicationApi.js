import axios from "axios";
import { message } from 'antd';
import { handleError } from '../utils/errorUtils';
import {API_URL} from '../utils/config'
 
export const BASE_URL = `${API_URL}/applications`;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm interceptor để tự động gắn token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    // Kiểm tra xem request có phải từ employer không
    const isEmployerRequest = config.url.includes('/employer/');
    
    // Chọn token phù hợp dựa vào loại request
    const token = isEmployerRequest 
      ? localStorage.getItem('employer_token')
      : localStorage.getItem('user_token');
      
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
      // Kiểm tra URL để xác định loại user
      const isEmployerRequest = error.config.url.includes('/employer/');
      if (isEmployerRequest) {
        localStorage.removeItem('employer_token');
        window.location.href = '/login-employer';
      } else {
        localStorage.removeItem('user_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Lấy danh sách đơn ứng tuyển
export const getApplicationById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Lấy danh sách đơn ứng tuyển
export const getAllApplications = async () => {
  try {
    const response = await axiosInstance.get('/list');
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Tạo đơn ứng tuyển
export const createApplication = async (applicationData) => {
  try {
    const response = await axiosInstance.post('', applicationData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Cập nhật trạng thái đơn ứng tuyển
export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const token = localStorage.getItem('employer_token');
    const response = await axios.put(`${BASE_URL}/${applicationId}/status?status=${status}`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Xóa đơn ứng tuyển
export const deleteApplication = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Lấy danh sách đơn ứng tuyển theo id công việc
export const getApplicationsByJobId = async (jobId) => {
  try {
    const response = await axiosInstance.get(`/job/${jobId}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

const checkToken = () => {
  const token = localStorage.getItem('user_token');
  if (!token) {
    throw new Error('Không tìm thấy token xác thực');
  }
  return token;
};

// Lấy danh sách đơn ứng tuyển theo id ứng viên
export const getApplicationsByCandidateId = async (candidateId) => {
  try {
    console.log('Calling API for candidateId:', candidateId);
    const response = await axiosInstance.get(`/candidate/${candidateId}`);
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    handleError(error);
    throw error;
  }
};

// Lấy danh sách ứng viên đã ứng tuyển công việc của nhà tuyển dụng
export const getCandidatesByEmployerId = async (employerId) => {
  try {
    if (!employerId) {
      throw new Error('employerId is required');
    }
    const response = await axiosInstance.get(`/employer/${employerId}/candidates`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Lấy danh sách đơn ứng tuyển đã được chấp nhận theo id nhà tuyển dụng
export const getAcceptedApplicationsByEmployer = async (employerId) => {
  try {
    const token = localStorage.getItem('employer_token');
    const response = await axios.get(`${BASE_URL}/employer/${employerId}/accepted-candidates`,{
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

// Lấy danh sách CV của tất cả job của employer
export const getCVsByEmployer = async (employerId) => {
  try {
    if (!employerId) {
      throw new Error('employerId is required');
    }
    
    // Sử dụng getApplicationsByJobId thay vì tạo endpoint mới
    const response = await axiosInstance.get(`/employer/${employerId}/candidates`);
    return response.data;
  } catch (error) {
    console.error('Error fetching CVs:', error);
    if (error.response?.status === 403) {
      message.error('Bạn không có quyền truy cập danh sách CV');
    }
    handleError(error);
    throw error;
  }
};