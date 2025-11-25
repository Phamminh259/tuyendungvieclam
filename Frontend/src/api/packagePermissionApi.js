import axios from "axios";
import { handleError } from '../utils/errorUtils';
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}/package-permissions`;

// Gán quyền cho gói dịch vụ
export const assignPermissionToPackage = async (assignData) => {
  const token = localStorage.getItem('admin_token');
  const response = await axios.post(`${BASE_URL}/assign`, assignData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// Lấy danh sách quyền của gói dịch vụ
export const getPermissionsByPackageId = async (packageId) => {
  const token = localStorage.getItem('admin_token');
  const response = await axios.get(`${BASE_URL}/package/${packageId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// Tắt quyền cho gói dịch vụ
export const disablePermissionForPackage = async (packageId, permissionId) => {
  const token = localStorage.getItem('admin_token');
  const response = await axios.put(`${BASE_URL}/disable/${packageId}/permission/${permissionId}`, null, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

// Bật quyền cho gói dịch vụ
export const enablePermissionForPackage = async (packageId, permissionId) => {
  const token = localStorage.getItem('admin_token');
  const response = await axios.put(`${BASE_URL}/enable/${packageId}/permission/${permissionId}`, null, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data;
};

// Xóa quyền khỏi gói dịch vụ
export const removePermissionFromPackage = async (packageId, permissionId) => {
  const token = localStorage.getItem('admin_token');
  const response = await axios.delete(`${BASE_URL}/package/${packageId}/permission/${permissionId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};
