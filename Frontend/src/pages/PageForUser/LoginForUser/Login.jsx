import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Divider, Typography, Space, message } from 'antd';
import { GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import { AuthContext } from '../../../components/auth/AuthProvider';
import { login } from '../../../api/authApi'; 
import '../../../styles/Login.css';
import logo from "../../../assets/logos/logo.png";

const { Link, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { login: setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const GOOGLE_AUTH_URL = `http://localhost:8080/oauth2/authorization/google`;
  const GITHUB_AUTH_URL = `http://localhost:8080/oauth2/authorization/github`;

  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };
  const handleGithubLogin = () => {
    window.location.href = GITHUB_AUTH_URL;
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const accountType = 'user';
      const responseData = await login(accountType, values);
      console.log('Response data:', responseData);

      const userData = {
        email: responseData.email || values.email,
        data: {
          token: responseData.token,
          message: responseData.message
        }
      };

      await setAuth(userData, responseData.token, 'user');
      message.success('Đăng nhập thành công!');
      navigate('/');

    } catch (error) {
      console.error('Login error details:', error);
      message.error(
        error.response?.data?.message || 
        error.message || 
        'Đăng nhập thất bại!'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* <div className="logo-container">
          <a href="/">
            <img 
              src={logo} 
              alt="Logo" 
              style={{ height: '60px' }} 
            />
          </a>
        </div> */}

        <div style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="login-title text-white">Đăng nhập</h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="login-form"
            requiredMark={false}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input placeholder="Nhập email của bạn" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password placeholder="Nhập mật khẩu của bạn" />
            </Form.Item>

            <Button type="primary" htmlType="submit" block style={{ marginBottom: '1rem' }} loading={loading}>
              Đăng nhập
            </Button>

            <Divider>Hoặc</Divider>

            <Button
              icon={<GoogleOutlined />}
              block
              style={{ marginBottom: '0.5rem' }}
              onClick={handleGoogleLogin}
            >
              Đăng nhập với Google
            </Button>
            <Button
              icon={<GithubOutlined />}
              block
              onClick={handleGithubLogin}
            >
              Đăng nhập với GitHub
            </Button>

            <Divider />

            <div className="login-footer">
              <Space direction="vertical" size="small">
                <Link href="/forgot-password">Quên mật khẩu?</Link>
                <Text>
                  Chưa có tài khoản?{' '}
                  <Link href="/register">Đăng ký ngay</Link>
                </Text>
                <Text>
                  <Link 
                    href="/" 
                    style={{ 
                      color: '#1890ff',
                      fontSize: '15px',
                      fontWeight: 500,
                      '&:hover': {
                        color: '#40a9ff',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    ← Trở về Trang chủ
                  </Link>
                </Text>
              </Space>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
