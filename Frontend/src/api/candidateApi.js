import axios from 'axios';
import { handleError } from '../utils/errorUtils';
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}/candidates`;

// Tạo instance axios cho candidate
const candidateApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Thêm interceptor để tự động gắn token
candidateApi.interceptors.request.use(
  (config) => {
    // Kiểm tra URL để quyết định dùng token nào
    if (config.url === '/list' || config.url.includes('/search')) {
      // Các API cần employer token
      const employerToken = localStorage.getItem('employer_token');
      if (employerToken) {
        config.headers['Authorization'] = `Bearer ${employerToken}`;
      }
    } else {
      // Các API khác dùng user token
      const userToken = localStorage.getItem('user_token');
      if (userToken) {
        config.headers['Authorization'] = `Bearer ${userToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Lấy thông tin ứng viên
export const getCandidateProfile = async (id) => {
  try {
    console.log('Fetching profile for id:', id);
    const response = await candidateApi.get(`/get-by/${id}`);
    console.log('Profile API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy thông tin profile');
    }
    handleError(error, 'Lỗi khi lấy thông tin ứng viên');
  }
};

// Lấy danh sách tất cả ứng viên
export const getAllCandidates = async () => {
  try {
    const response = await candidateApi.get('/list');
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Tìm kiếm ứng viên
export const searchCandidates = async (params) => {
  try {
    const response = await candidateApi.get('/search', { 
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cập nhật trạng thái sẵn sàng tìm việc
export const updateAvailability = async (id, isAvailable) => {
  try {
    const response = await candidateApi.put(
      `/${id}/availability?isAvailable=${isAvailable}`,
      null,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cập nhật thông tin ứng viên
export const updateCandidate = async (id, profileData) => {
  try {
    const response = await candidateApi.put(`/${id}`, profileData);
    return response.data;
  } catch (error) {
    handleError(error, 'Lỗi khi cập nhật thông tin ứng viên');
  }
};

// Xóa ứng viên
export const deleteCandidate = async (id) => {
  try {
    const response = await candidateApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    handleError(error, 'Lỗi khi xóa thông tin ứng viên');
  }
};

// Thêm hàm lấy profile theo email
export const getCandidateProfileByEmail = async (email) => {
  try {
    console.log('Fetching profile for email:', email);
    const response = await candidateApi.get(`/get-by-email/${email}`);
    console.log('Profile API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    if (error.response?.status === 404) {
      throw new Error('Không tìm thấy thông tin profile');
    }
  }
}; 

// Thêm lịch sử làm việc
export const addWorkHistory = async (id, workHistoryData) => {
  try {
    const response = await candidateApi.post(
      `/${id}/work-histories`,
      workHistoryData,
    );
    return response.data;
  } catch (error) {
    handleError(error, 'Lỗi khi thêm kinh nghiệm làm việc');
  }
};

// Lấy lịch sử làm việc theo id
export const getWorkHistory = async (candidateId, workHistoryId) => {
  try {
    const response = await candidateApi.get(
      `/${candidateId}/work-histories/${workHistoryId}`
    );
    return response.data;
  } catch (error) {
    handleError(error, 'Lỗi khi lấy thông tin kinh nghiệm làm việc');
  }
};

// Cập nhật lịch sử làm việc
export const updateWorkHistory = async (candidateId, workHistoryId, workHistoryData) => {
  try {
    const response = await candidateApi.put(
      `/${candidateId}/work-histories/${workHistoryId}`,
      workHistoryData
    );
    return response.data;
  } catch (error) {
    handleError(error, 'Lỗi khi cập nhật kinh nghiệm làm việc');
  }
};

// Xóa lịch sử làm việc
export const deleteWorkHistory = async (candidateId, workHistoryId) => {
  try {
    const response = await candidateApi.delete(
      `/${candidateId}/work-histories/${workHistoryId}`
    );
    return response.data;
  } catch (error) {
    handleError(error, 'Lỗi khi xóa kinh nghiệm làm việc');
  }
};

// Lấy tất cả lịch sử làm việc theo id
export const getAllWorkHistories = async (candidateId) => {
  try {
    const response = await candidateApi.get(
      `/${candidateId}/work-histories`
    );
    return response.data;
  } catch (error) {
    handleError(error, 'Lỗi khi lấy danh sách kinh nghiệm làm việc');
  }
};

// Gửi gợi ý việc làm cho ứng viên
export const sendJobSuggestions = async (candidateId) => {
  try {
    const response = await candidateApi.post(`/${candidateId}/send-job-suggestions`);
    return response.data;
  } catch (error) {
    handleError(error, 'Lỗi khi gửi gợi ý việc làm');
  }
};

// Lưu công việc
export const saveJob = async (candidateId, jobId) => {
  try {
    const response = await candidateApi.post(`/${candidateId}/save-job/${jobId}`);
    return response.data;
  } catch (error) {
    handleError(error, 'Lỗi khi lưu công việc');
  }
};

// Lấy danh sách công việc đã lưu
export const getSavedJobs = async (candidateId) => {
  try {
    const response = await candidateApi.get(`/${candidateId}/saved-jobs`);
    return response.data;
  } catch (error) {
    handleError(error, 'Lỗi khi lấy danh sách công việc đã lưu');
  }
};

// Xóa công việc đã lưu
export const unsaveJob = async (candidateId, jobId) => {
  try {
    const response = await candidateApi.delete(`/${candidateId}/saved-jobs/${jobId}`);
    return response.data;
  } catch (error) {
    handleError(error, 'Lỗi khi xóa công việc đã lưu');
  }
};
