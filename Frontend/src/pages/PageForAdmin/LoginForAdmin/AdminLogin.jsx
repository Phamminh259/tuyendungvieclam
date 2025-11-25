import React, { useContext } from "react";
import { Button, Form, Input, Typography, Card, message } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../../components/auth/AuthProvider";
import { login } from '../../../api/authApi';
import styles from "../../../styles/AdminLogin.module.css";

const { Title } = Typography;

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setAuth } = useContext(AuthContext);

  const handleLogin = async (values) => {
    try {
      const accountType = 'admin';
      const response = await login(accountType, values);
      
      console.log('Raw response:', response); // Debug log

      if (!response || !response.token) {
        throw new Error('Token không hợp lệ');
      }

      const userData = {
        email: response.email || values.email,
        fullName: 'Admin',
        token: response.token
      };

      localStorage.setItem('admin_token', response.token);
      
      await setAuth(userData, response.token, 'admin');
      
      message.success('Đăng nhập thành công!');
      const from = location.state?.from || '/admin';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      message.error(error.message || 'Đăng nhập thất bại!');
    }
  };

  return (
    <div className={styles["login-container"]}>
      <Card className={`${styles["login-card"]}`}>
        <div style={{ marginBottom: 30 }}>
          <Title level={3} style={{ color: "rgb(204, 10, 157)", textAlign: 'center' }}>
            Đăng nhập Admin
          </Title>
          <p style={{ color: "rgba(0, 0, 0, 0.6)" }}>
            Xin Chào Quản Trị Viên! Vui lòng đăng nhập tài khoản
          </p>
        </div>
        <Form name="admin_login" onFinish={handleLogin}>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập Email!" },
              { type: "text", message: "Định dạng Email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              style={{ borderRadius: 5 }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập Password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              style={{ borderRadius: 5 }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.btn}
              style={{
                width: "100%",
                borderRadius: 5,
                background: "rgb(204, 10, 157)",
                border: "none",
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLogin;
