import axios from 'axios';
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}/candidate-skills`;

const candidateSkillApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

candidateSkillApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token') || localStorage.getItem('employer_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      throw new Error('Không tìm thấy token xác thực');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Lấy danh sách kỹ năng của ứng viên
export const getCandidateSkills = async (candidateId) => {
  try {
    const response = await candidateSkillApi.get(`/candidate/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching candidate skills:', error);
    throw error;
  }
};

// Thêm kỹ năng cho ứng viên
export const addCandidateSkill = async (candidateId, skillData) => {
  try {
    const response = await candidateSkillApi.post(`/${candidateId}`, skillData);
    return response.data;
  } catch (error) {
    console.error('Error adding candidate skill:', error);
    throw error;
  }
};

// Xóa kỹ năng của ứng viên
export const deleteCandidateSkill = async (candidateId, skillId) => {
  try {
    const response = await candidateSkillApi.delete(`/${candidateId}/skills/${skillId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting candidate skill:', error);
    throw error;
  }
};