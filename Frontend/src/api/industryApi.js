import axios from "axios";
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}/industries`;

const industryApi = axios.create({
  baseURL: BASE_URL
});

// Thêm interceptor tương tự như candidateApi
industryApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('user_token') || localStorage.getItem('employer_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Lấy danh sách lĩnh vực
export const getAllIndustries = async () => {
  try {
    const response = await axios.get(BASE_URL + '/list');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách lĩnh vực:', error);
    throw error;
  }
};

// Lấy lĩnh vực theo ID
export const getIndustryById = async (id) => {
  try {
    const response = await industryApi.get(`/get-by/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin lĩnh vực:', error);
    throw error;
  }
};

// Tạo lĩnh vực mới
export const createIndustry = async (industryRequestDTO) => {
  try {
    const response = await axios.post(BASE_URL, industryRequestDTO, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Không thể tạo ngành nghề mới");
  }
};

// Cập nhật lĩnh vực
export const updateIndustry = async (id, industryRequestDTO) => {
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, industryRequestDTO, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Không thể cập nhật ngành nghề");
  }
};

// Xóa lĩnh vực
export const deleteIndustry = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/${id}`);
    return true;
  } catch (error) {
    throw new Error(error.response?.data || "Không thể xóa ngành nghề");
  }
};
