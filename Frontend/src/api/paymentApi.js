// src/api/paymentApi.js
import axios from "axios";
import { handleError } from "../utils/errorUtils";
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}/payments`;

export const paymentApi = {
  // Tạo payment và lấy URL thanh toán VNPay
  createPayment: async (paymentData) => {
    try {
      const token = localStorage.getItem("employer_token");
      const response = await axios.post(
        `${BASE_URL}/create-payment`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Payment API Error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      throw error;
    }
  },

  // xử lý thanh toán VNPay
  updatePaymentStatus: async ({ responseCode, transactionRef, transactionStatus }) => {
    try {
      const token = localStorage.getItem("employer_token");
      const response = await axios.get(`${BASE_URL}/vnpay-return`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          vnp_ResponseCode: responseCode,
          vnp_TxnRef: transactionRef,
          vnp_TransactionStatus: transactionStatus
        }
      });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // hủy thanh toán
  cancelPayment: async (paymentId) => {
    try {
      const token = localStorage.getItem("employer_token");
      const response = await axios.delete(`${BASE_URL}/${paymentId}/cancel`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    } 
  },

  // Lấy lịch sử thanh toán theo employer
  getPaymentHistory: async (employerId) => {
    try {
      const token = localStorage.getItem("employer_token");
      const response = await axios.get(`${BASE_URL}/employer/${employerId}/payments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Kiểm tra trạng thái thanh toán
  checkPaymentStatus: async (paymentId) => {
    try {
      const token = localStorage.getItem("employer_token");
      const response = await axios.get(`${BASE_URL}/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  // Lấy lịch sử thanh toán (ADMIN)
  getPaymentHistoryAdmin: async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.get(`${BASE_URL}/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Lấy lịch sử thanh toán theo khoảng thời gian (ADMIN)
  getPaymentHistoryByDateRange: async (startDate, endDate) => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.get(`${BASE_URL}/history/date-range`, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          startDate: startDate,
          endDate: endDate
        }
      });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Lấy thống kê thanh toán (ADMIN)
  getPaymentStatistics: async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await axios.get(`${BASE_URL}/statistics`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      handleError(error);
      throw error;
    }
  },

  // Thêm hàm xử lý PayPal callback
  handlePayPalCallback: async (callbackData) => {
    try {
      const token = localStorage.getItem("employer_token");
      console.log('PayPal Request Data:', callbackData);
      
      const response = await axios.get(
        `${BASE_URL}/paypal/success`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: {
            paymentId: callbackData.paymentId,
            PayerID: callbackData.PayerID,
            token: callbackData.token,
            subscriptionId: callbackData.subscriptionId
          }
        }
      );
      
      console.log('PayPal Full Response:', response.data);
      return response.data;
    } catch (error) {
      console.error("PayPal Error Details:", {
        message: error.message,
        data: error.response?.data
      });
      throw error;
    }
  }

};
