import axios from 'axios';
import uploadService from './uploadApi';
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}`;

export const uploadCV = async (file, token) => {
  try {
    const cvUrl = await uploadService.uploadCV(file, token);
    return cvUrl;
  } catch (error) {
    console.error('Upload CV error:', error);
    throw error;
  }
};

export const updateCandidateCV = async (candidateId, cvUrl) => {
  const token = localStorage.getItem('user_token');
  try {
    const currentProfile = await axios.get(`${BASE_URL}/candidates/get-by/${candidateId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const response = await axios.put(`${BASE_URL}/candidates/${candidateId}`, {
      ...currentProfile.data,
      attachedFile: cvUrl
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}; 