import axios from "axios";
import { handleError } from '../utils/errorUtils';
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}/subscriptions`;

// tạo subscription (EMPLOYER)
export const createSubscription = async (subscriptionData) => {
  try {
    const token = localStorage.getItem('employer_token');
    const response = await axios.post(BASE_URL, subscriptionData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// lấy tất cả subscription (ADMIN)
export const getAllSubscriptions = async () => {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.get(BASE_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Lấy tất cả subcription đã thanh toán
export const getAllSubscriptionsActive = async () => {
  try {
    const token = localStorage.getItem('admin_token');
    const response = await axios.get(`${BASE_URL}/active`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// lấy subscription theo id (EMPLOYER)
export const getSubscriptionById = async (id) => {
  try {
    const token = localStorage.getItem('employer_token');
    const response = await axios.get(`${BASE_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// lấy subscription theo employer (EMPLOYER)
export const getSubscriptionsByEmployer = async (employerId) => {
  try {
    const token = localStorage.getItem('employer_token');
    const response = await axios.get(`${BASE_URL}/employer/${employerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Lấy danh sách subcription theo employer đã thanh toán (EMPLOYER)
export const getSubscriptionsByEmployerActive = async (employerId) => {
  try {
    const token = localStorage.getItem('employer_token');
    const response = await axios.get(`${BASE_URL}/employer/${employerId}/active`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// hủy subscription
export const cancelSubscription = async (id) => {
  try {
    const token = localStorage.getItem('employer_token');
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

// gia hạn subscription (EMPLOYER)
export const renewSubscription = async (id, duration) => {
  try {
    const token = localStorage.getItem('employer_token');
    const response = await axios.put(`${BASE_URL}/${id}/renew?duration=${duration}`, null, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    handleError(error);
  }
};

// kiểm tra subscription có hoạt động không
export const isSubscriptionActive = async (employerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/active/${employerId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Lấy gói hiện tại của employer (EMPLOYER)
export const getCurrentPackage = async (employerId) => {
  try {
    const token = localStorage.getItem('employer_token');
    const response = await axios.get(`${BASE_URL}/current/${employerId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};
