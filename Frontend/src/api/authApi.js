import axios from "axios";
import { handleError } from '../utils/errorUtils';
import {API_URL} from '../utils/config'

const BASE_URL = `${API_URL}/auth`;

//Chức năng đăng ký người dùng
export const registerUser = async (userDTO) => {
  try {
    console.log('Sending registration data:', userDTO); // Log để debug

    const response = await axios.post(`${BASE_URL}/register/user`, 
      {
        fullName: userDTO.fullName,
        email: userDTO.email,
        password: userDTO.password,
        confirmPassword: userDTO.confirmPassword,
        phone: userDTO.phone
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    
    // Lưu email vào localStorage để dùng cho verification
    localStorage.setItem('tempRegistration', JSON.stringify({
      email: userDTO.email,
      timestamp: new Date().getTime()
    }));
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data); // Log chi tiết lỗi
    throw new Error(
      error.response?.data?.message || error.response?.data || "Đăng ký thất bại"
    );
  }
};

// Chức năng đăng ký nhà tuyển dụng
export const registerEmployer = async (employerDTO) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/register/employer`,
      employerDTO,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || "Đăng ký thất bại";
  }
};

// Chức năng tạo tài khoản quản trị viên (yêu cầu vai trò quản trị viên)
export const createAdmin = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/create/admin`, null, {
      params: { email, password },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data : "Admin creation failed"
    );
  }
};

// Chức năng xác minh tài khoản người dùng bằng OTP

export const verifyAccount = async (email, verificationCode) => {
  try {
    console.log('Verifying account:', { email, code: verificationCode }); // Log để debug

    const params = new URLSearchParams({
      email: email,
      code: verificationCode
    });

    const response = await axios.post(
      `${BASE_URL}/verify?${params.toString()}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );
    
    // Log response để debug
    console.log('Verification response:', response.data);
    
    return response.data;
  } catch (error) {
    // Log chi tiết lỗi
    console.error('Verification error:', error.response?.data);
    
    if (error.response?.status === 400) {
      throw {
        status: 400,
        message: 'Mã xác thực không đúng hoặc đã hết hạn. Vui lòng thử lại!'
      };
    }
    
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Có lỗi xảy ra khi xác thực'
    };
  }
};

// Chức năng gửi lại OTP để xác minh tài khoản
export const resendOtp = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/resend-otp`, null, {
      params: { email },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data : "Failed to resend OTP"
    );
  }
};

export const login = async (accountType, credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/login/${accountType}`, credentials);
    console.log('Login response:', response);
    
    if (response.data && response.data.token) {
      return {
        token: response.data.token,
        message: response.data.message,
        email: credentials.email
      };
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    handleError(error, 'Đăng nhập thất bại');
    throw error;
  }
};

// đng xuất
export const logout = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}/logout`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
    throw error;
  }
};

export const getCurrentOAuthUser = async () => {
  try {
    // Lấy token từ URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    console.log('Token from URL:', token); // Log token

    const response = await axios.get(`${BASE_URL}/oauth2/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });
    
    console.log('API Response:', response.data); // Log response
    return response;
  } catch (error) {
    console.error('Full error object:', error); // Log full error
    throw error;
  }
};

// Gửi yêu cầu reset password và nhận OTP
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/forgot-password`, null, {
      params: { email }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('Email không tồn tại');
    }
    throw new Error(error.response?.data || 'Không thể gửi yêu cầu đặt lại mật khẩu');
  }
};

// Reset password với mã OTP
export const resetPassword = async (email, code, newPassword) => {
  try {
    const response = await axios.post(`${BASE_URL}/reset-password`, null, {
      params: {
        email,
        code,
        newPassword
      }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error('Mã xác thực không đúng hoặc đã hết hạn');
    }
    throw new Error(error.response?.data || 'Không thể đặt lại mật khẩu');
  }
};

//  Gửi yêu cầu validate token đến server.
export const validateToken = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/validate-token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.status === 200;
  } catch (error) {
    console.error("Lỗi khi xác thực token:", error);
    return false;
  }
};

