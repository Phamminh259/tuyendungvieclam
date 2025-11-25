import axios from 'axios';
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}/professions`;

const professionApi = axios.create({
  baseURL: BASE_URL
});

export const getAllProfessions = async () => {
  try {
    const response = await professionApi.get('/list');
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách ngành nghề:', error);
    throw error;
  }
};

export const getProfessionById = async (id) => {
  try {
    const response = await professionApi.get(`/get-by/${id}`);
    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin ngành nghề:', error);
    throw error;
  }
}; 