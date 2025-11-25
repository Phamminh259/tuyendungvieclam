import axios from "axios";
import { handleError } from "../utils/errorUtils";
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}`;

// Hàm helper để lấy token
const getAuthHeader = () => {
  const token = localStorage.getItem("employer_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Tạo một skill cho job
export const createJobSkill = async (data) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/job-skills`, 
      data,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Tạo nhiều skills cho job
export const createMultipleJobSkills = async (jobId, skillData) => {
  try {
    console.log('Creating job skills with:', {
      jobId,
      skillData
    });
    
    // Lấy token từ localStorage
    const token = localStorage.getItem("employer_token");

    const response = await axios.post(
      `${BASE_URL}/job-skills/batch/${jobId}`, 
      skillData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Job skills response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create job skills error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      data: error.config?.data
    });
    handleError(error);
    throw error;
  }
};

// Lấy tất cả skills của một job
export const getJobSkillsByJobId = async (jobId) => {
  try {
    const response = await axios.get(`${BASE_URL}/job-skills/job/${jobId}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Lấy các skills bắt buộc của job
export const getRequiredJobSkills = async (jobId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/job-skills/job/${jobId}/required`
    );
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Lấy skills theo mức độ thành thạo
export const getJobSkillsByProficiencyLevel = async (jobId, level) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/job-skills/job/${jobId}/level/${level}`
    );
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Cập nhật một job skill
export const updateJobSkill = async (id, data) => {
  try {
    console.log('Updating job skill:', {
      id,
      requestData: data
    });

    const response = await axios.put(
      `${BASE_URL}/job-skills/${id}`, 
      data,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error('Update job skill error:', {
      status: error.response?.status,
      data: error.response?.data,
      requestData: data
    });
    handleError(error);
    throw error;
  }
};

// Xóa một job skill
export const deleteJobSkill = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/job-skills/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
