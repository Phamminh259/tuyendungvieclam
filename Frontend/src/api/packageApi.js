import axios from "axios";
import { handleError } from '../utils/errorUtils';
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}/packages`;

// Tạo gói dịch vụ (ADMIN)
export const createPackage = async (packageData) => {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.post(BASE_URL, packageData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Lấy gói dịch vụ theo ID (EMPLOYER)
export const getPackageById = async (id) => {
  try {
    const token = localStorage.getItem('employer_token' );
    const response = await axios.get(`${BASE_URL}/get-by/${id}`, {
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

// Lấy danh sách gói dịch vụ
export const getAllPackages = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/list`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Cập nhật gói dịch vụ (ADMIN)
export const updatePackage = async (id, packageData) => {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.put(`${BASE_URL}/${id}`, packageData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Xóa gói dịch vụ (ADMIN)
export const deletePackage = async (id) => {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.delete(`${BASE_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
