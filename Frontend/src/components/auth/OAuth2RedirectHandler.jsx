import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { API_URL } from '../../utils/config';
import { message } from 'antd';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const handleOAuthLogin = async () => {
      try {
        // Lấy token từ URL params
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const error = params.get('error');

        if (error) {
          message.error('Đăng nhập thất bại: ' + error);
          navigate('/login');
          return;
        }

        if (!token) {
          message.error('Không nhận được token!');
          navigate('/login');
          return;
        }

        // Gọi API để lấy thông tin user
        const response = await fetch(`${API_URL}/auth/oauth2/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to get user info');
        }

        const userData = await response.json();

        // Lưu thông tin user và token
        await login({
          email: userData.email,
          fullName: userData.name || userData.email.split('@')[0],
          avatar: userData.imageUrl
        }, token, 'user');
        navigate('/');

      } catch (error) {
        console.error('OAuth login error:', error);
        message.error('Đăng nhập thất bại!');
        navigate('/login');
      }
    };

    handleOAuthLogin();
  }, [navigate, login]);

  return null;
};

export default OAuth2RedirectHandler; 