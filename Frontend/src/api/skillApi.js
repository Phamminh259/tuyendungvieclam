import axios from 'axios';
import { handleError } from '../utils/errorUtils';
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}`;

// Lấy danh sách tất cả kỹ năng
export const getAllSkills = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/skills/list`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Lấy kỹ năng theo ID
export const getSkillById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/skills/get-by/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Tạo mới kỹ năng
export const createSkill = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/skills`, data);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Cập nhật kỹ năng
export const updateSkill = async (id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}/skills/${id}`, data);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Xóa kỹ năng
export const deleteSkill = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/skills/${id}`);
  } catch (error) {
    handleError(error);
    throw error;
  }
}; 