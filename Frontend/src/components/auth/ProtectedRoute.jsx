import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children, userType }) => {
  const { isAuthenticated, accountType } = useContext(AuthContext);
  const location = useLocation();

  // Kiểm tra token tương ứng với loại tài khoản
  const token = localStorage.getItem(`${userType}_token`);
  const storedAccountType = localStorage.getItem(`${userType}_type`);

  if (!token || storedAccountType !== userType) {
    return <Navigate 
      to={userType === 'employer' ? '/login-employer' : '/login'} 
      state={{ from: location.pathname }} 
      replace 
    />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  userType: PropTypes.oneOf(['user', 'employer', 'admin']).isRequired,
};

export default ProtectedRoute;
