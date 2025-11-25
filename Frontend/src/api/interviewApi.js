import axios from "axios";
import { message } from 'antd';
import { handleError } from '../utils/errorUtils';
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}/interviews`;

// Tạo instance của axios với cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm interceptor để tự động gắn token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('employer_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Nếu không có token, chuyển về trang login
      window.location.href = '/login';
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
      // Token không có quyền truy cập
      message.error('Bạn không có quyền thực hiện thao tác này');
      // Có thể chuyển hướng về trang chủ hoặc trang error
      // window.location.href = '/';
    } else if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('employer_token');
      window.location.href = '/login'; // Chuyển về trang login
    }
    return Promise.reject(error);
  }
);

// Lấy danh sách phỏng vấn theo nhà tuyển dụng
export const getInterviewsByEmployer = async (employerId) => {
  try {
    if (!employerId) {
      throw new Error('employerId is required');
    }
    const response = await axiosInstance.get(`/employer/${employerId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error in getInterviewsByEmployer:', error);
    if (error.response?.status === 404) {
      return []; // Return empty array if no interviews found
    }
    handleError(error);
    throw error;
  }
};

// Lấy danh sách phỏng vấn của ứng viên
export const getInterviewsByCandidate = async (candidateId) => {
  try {
    const response = await axios.get(`${BASE_URL}/candidate/${candidateId}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Lấy danh sách phỏng vấn của đơn ứng tuyển
export const getInterviewsByApplication = async (applicationId) => {
  try {
    const response = await axios.get(`${BASE_URL}/application/${applicationId}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Lên lịch phỏng vấn
export const scheduleInterview = async (interviewData) => {
  try {
    console.log('Sending interview data:', interviewData);
    const response = await axiosInstance.post('', {
      applicationId: interviewData.applicationId,
      title: interviewData.title,
      interviewDate: interviewData.interviewDate,
      interviewTime: interviewData.interviewTime,
      type: interviewData.type,
      location: interviewData.location,
      note: interviewData.note,
      status: interviewData.status
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      message.error(error.response.data.message);
    }
    handleError(error);
    throw error;
  }
};

// Cập nhật lịch phỏng vấn
export const updateInterview = async (interviewId, updateData) => {
  try {
    const response = await axiosInstance.put(`/${interviewId}`, updateData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Xóa lịch phỏng vấn
export const deleteInterview = async (interviewId) => {
  try {
    const response = await axiosInstance.delete(`/${interviewId}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Thêm function cập nhật phỏng vấn theo applicationId
export const updateInterviewByApplication = async (applicationId, interviewData) => {
  try {
    console.log('Updating interview for application:', applicationId, interviewData); // Debug log
    
    // Format dữ liệu trước khi gửi
    const formattedData = {
      title: interviewData.title,
      interviewDate: interviewData.interviewDate,
      interviewTime: interviewData.interviewTime,
      type: interviewData.type,
      location: interviewData.location,
      note: interviewData.note || ''
    };

    const response = await axiosInstance.put(`/application/${applicationId}`, formattedData);
    
    if (response.data) {
      message.success('Cập nhật lịch phỏng vấn thành công');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating interview:', error);
    if (error.response?.status === 403) {
      message.error('Bạn không có quyền cập nhật lịch phỏng vấn');
    } else if (error.response?.status === 404) {
      message.error('Không tìm thấy lịch phỏng vấn cho đơn ứng tuyển này');
    } else {
      message.error('Lỗi khi cập nhật lịch phỏng vấn');
    }
    handleError(error);
    throw error;
  }
}; 