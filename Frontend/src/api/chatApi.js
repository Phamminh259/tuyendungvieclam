import axios from 'axios';
import { handleError } from '../utils/errorUtils';
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}/chatroom`;

// Tạo phòng chat mới
export const createChatRoom = async (employerId, candidateId) => {
  try {
    const token = localStorage.getItem('employer_token');
    const response = await axios.post(`${BASE_URL}/create`, null, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params: {
        employerId: employerId,
        candidateId: candidateId
      }
    });
    return response.data;
  } catch (error) {
    console.error('ChatRoom API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Lấy tin nhắn của phòng chat
export const getRoomMessages = async (roomId, page = 0, size = 20) => {
  try {
    const token = localStorage.getItem('employer_token') || localStorage.getItem('token');
    const response = await axios.get(`${BASE_URL}/messages/${roomId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        page,
        size,
        sort: 'timestamp,desc'
      }
    });
    console.log('Messages response:', response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Get Messages Error:', error.response?.data || error);
    return [];
  }
};

// Đánh dấu tin nhắn đã đọc
export const markMessagesAsRead = async (roomId, userId) => {
  try {
    const token = localStorage.getItem('employer_token');
    const response = await axios.put(`${BASE_URL}/messages/read`, null, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        roomId,
        userId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Mark Messages Read Error:', error);
    throw error;
  }
};

// Lấy danh sách phòng chat
export const getChatRooms = async (userId) => {
  try {
    const token = localStorage.getItem('employer_token');
    const response = await axios.get(`${BASE_URL}/list/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get Chat Rooms Error:', error);
    return [];
  }
};

// Lấy số tin nhắn chưa đọc
export const getUnreadCount = async (roomId, userId) => {
  try {
    const token = localStorage.getItem('employer_token');
    const response = await axios.get(`${BASE_URL}/unread/${roomId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        userId
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get Unread Count Error:', error);
    return 0;
  }
}; 