import React, { useContext } from 'react';
import { Alert } from 'antd';
import { AuthContext } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

const PendingVerificationAlert = () => {
  const { pendingVerification } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!pendingVerification) return null;

  return (
    <Alert
      message="Đăng ký chưa hoàn thành"
      description={
        <div>
          Bạn có một đăng ký chưa hoàn thành xác thực với email {pendingVerification.email}.
          <a 
            onClick={() => navigate('/register')}
            style={{ marginLeft: '10px' }}
          >
            Hoàn tất đăng ký
          </a>
        </div>
      }
      type="warning"
      showIcon
      closable
    />
  );
};

export default PendingVerificationAlert; 