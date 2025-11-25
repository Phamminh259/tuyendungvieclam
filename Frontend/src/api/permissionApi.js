import axios from "axios";
import { handleError } from '../utils/errorUtils';
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}/permissions`;

// Tạo quyền
export const createPermission = async (permissionData) => {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.post(BASE_URL, permissionData, {
      headers: {
      'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Cập nhật quyền
export const updatePermission = async (id, permissionData) => {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.put(`${BASE_URL}/${id}`, permissionData, {
      headers: {
        'Authorization': `Bearer ${token}`
    }
  });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Xóa quyền
export const deletePermission = async (id) => {
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

// Lấy danh sách quyền
export const getAllPermissions = async () => {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.get(`${BASE_URL}/list`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Lấy quyền theo ID
export const getPermissionById = async (id) => {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.get(`${BASE_URL}/get-by/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Bật quyền
export const enablePermission = async (id) => {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.put(`${BASE_URL}/enable/${id}`, null, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Tắt quyền
export const disablePermission = async (id) => {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.put(`${BASE_URL}/disable/${id}`, null, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

