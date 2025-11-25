import axios from "axios";
import { handleError } from '../utils/errorUtils';
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}/invoices`;

// Lấy tất cả hóa đơn (ADMIN)
export const getAllInvoices = async () => {
  try {
    const token = localStorage.getItem('admin_token');
    console.log('Token:', token);
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

// Lấy chi tiết hóa đơn (ADMIN + EMPLOYER)
export const getInvoiceById = async (id) => {
  try {
    const token = localStorage.getItem('employer_token');
    console.log('Token:', token);
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

// Lấy hóa đơn theo subscription (EMPLOYER)
export const getInvoicesBySubscription = async (subscriptionId) => {
  try {
    const token = localStorage.getItem('employer_token');
    console.log('Token:', token);
    const response = await axios.get(`${BASE_URL}/subscription/${subscriptionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Lấy hóa đơn theo employer (ADMIN + EMPLOYER)
export const getInvoicesByEmployer = async (employerId) => {
  try {
    const token = localStorage.getItem('admin_token' || 'employer_token');
    console.log('Token:', token);
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

// Lấy hóa đơn theo trạng thái (ADMIN)
export const getInvoicesByStatus = async (status) => {
  try {
    const token = localStorage.getItem('admin_token');
    console.log('Token:', token);
    const response = await axios.get(`${BASE_URL}/status/${status}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Hủy hóa đơn (EMPLOYER)
export const cancelInvoice = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
}; 