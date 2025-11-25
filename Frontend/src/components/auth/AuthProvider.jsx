import React, { createContext, useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { getEmployerByEmail } from "../../api/employerApi";
import { getCandidateProfileByEmail } from "../../api/candidateApi";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountType, setAccountType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingVerification, setPendingVerification] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const types = ['user', 'employer', 'admin'];
        for (const type of types) {
          const token = localStorage.getItem(`${type}_token`);
          const userStr = localStorage.getItem(`${type}_user`);
          
          if (token && userStr) {
            const userData = JSON.parse(userStr);
            
            // Nếu là candidate, lấy thêm thông tin từ API
            if (type === 'user' && userData.email) {
              try {
                const candidateData = await getCandidateProfileByEmail(userData.email);
                userData.id = candidateData.id; // Cập nhật id từ API
                // Lưu lại vào localStorage với id mới
                localStorage.setItem(`${type}_user`, JSON.stringify(userData));
              } catch (error) {
                console.error('Error fetching candidate data:', error);
              }
            }

            
            // Nếu là employer, lấy thêm thông tin từ API
            if (type === 'employer' && userData.email) {
              try {
                const employerData = await getEmployerByEmail(userData.email);
                userData.id = employerData.id; // Cập nhật id từ API
                // Lưu lại vào localStorage với id mới
                localStorage.setItem(`${type}_user`, JSON.stringify(userData));
              } catch (error) {
                console.error('Error fetching employer data:', error);
              }
            }
            
            setUser(userData);
            setIsAuthenticated(true);
            setAccountType(type);
            break;
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userData, token, type) => {
    try {
      // Xóa thông tin đăng nhập của loại người dùng khác
      if (type === 'user') {
        logout('employer');
      } else if (type === 'employer') {
        logout('user');
      }
  
      // Lưu token
      localStorage.setItem(`${type}_token`, token);
  
      // Cấu trúc cơ bản của user
      const userToSave = {
        email: userData.email,
        fullName: type === 'admin' ? 'Admin' : (userData.fullName || userData.email.split('@')[0]),
        token: token
      };
  
      // Lưu thông tin user cơ bản
      localStorage.setItem(`${type}_user`, JSON.stringify(userToSave));
      localStorage.setItem(`${type}_type`, type);
  
      // Set state cơ bản
      setUser(userToSave);
      setIsAuthenticated(true);
      setAccountType(type);
  
      // Sau khi đã có token, mới gọi API để lấy thêm thông tin
      if (type === 'user') {
        try {
          const candidateData = await getCandidateProfileByEmail(userData.email);
          userToSave.id = candidateData.id;
          // Cập nhật lại localStorage với id mới
          localStorage.setItem(`${type}_user`, JSON.stringify(userToSave));
          // Cập nhật lại state
          setUser(userToSave);
        } catch (error) {
          console.error('Error fetching candidate data:', error);
          // Không throw error ở đây để không ảnh hưởng đến luồng đăng nhập
        }
      }
  
      if (type === 'employer') {
        try {
          const employerData = await getEmployerByEmail(userData.email);
          userToSave.id = employerData.id;
          localStorage.setItem(`${type}_user`, JSON.stringify(userToSave));
          setUser(userToSave);
        } catch (error) {
          console.error('Error fetching employer data:', error);
        }
      }
  
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  const logout = (type) => {
    localStorage.removeItem(`${type}_token`);
    localStorage.removeItem(`${type}_user`);
    localStorage.removeItem(`${type}_type`);
  
    // Reset state nếu cần
    if (accountType === type) {
      setUser(null);
      setIsAuthenticated(false);
      setAccountType(null);
    }
  };
  

  // const logout = async (type) => {
  //   try {
  //     setUser(null);
  //     setIsAuthenticated(false);
  //     setAccountType(null);
      
  //     localStorage.clear();
  //   } catch (error) {
  //     console.error('Logout error:', error);
  //     throw error;
  //   }
  // };

  const savePendingRegistration = (email) => {
    setPendingVerification({ email });
    localStorage.setItem('pendingVerification', JSON.stringify({ email }));
  };

  const clearPendingRegistration = () => {
    setPendingVerification(null);
    localStorage.removeItem('pendingVerification');
  };

  useEffect(() => {
    const stored = localStorage.getItem('pendingVerification');
    if (stored) {
      setPendingVerification(JSON.parse(stored));
    }
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      accountType,
      login, 
      logout,
      pendingVerification,
      savePendingRegistration,
      clearPendingRegistration
    }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;