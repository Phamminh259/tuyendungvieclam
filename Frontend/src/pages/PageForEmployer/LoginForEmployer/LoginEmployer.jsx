import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout, Form, Input, Button, Typography, message } from "antd";
import { AuthContext } from "../../../components/auth/AuthProvider";
import { motion } from "framer-motion";
import { login } from '../../../api/authApi';
import {
  TeamOutlined,
  RocketOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import logo from "../../../assets/logos/logo.png";
import "../../../styles/LoginEmployer.css";

const { Title, Text } = Typography;

const LoginEmployer = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const { login: setAuth } = useContext(AuthContext);

  useEffect(() => {
    if (location.state?.registrationSuccess) {
      message.success("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.", 3);

      if (location.state.email) {
        form.setFieldsValue({
          email: location.state.email,
        });
      }

      window.history.replaceState({}, document.title);
    }
  }, [location, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const accountType = 'employer';
      const response = await login(accountType, values);
      console.log('Full response:', response);

      // Kiểm tra response
      if (!response || !response.token) {
        throw new Error('Response không hợp lệ');
      }

      // Lưu token trước
      localStorage.setItem('employer_token', response.token);

      // Lưu user data
      const userData = {
        email: values.email,
        fullName: values.email.split('@')[0],
        token: response.token
      };
      localStorage.setItem('employer_user', JSON.stringify(userData));
      localStorage.setItem('accountType', 'employer');

      // Log để kiểm tra
      console.log('Saved token:', localStorage.getItem('employer_token'));
      console.log('Saved user:', localStorage.getItem('employer_user'));

      await setAuth(userData, response.token, 'employer');
      message.success('Đăng nhập thành công!');
      navigate('/dashboard');

    } catch (error) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || error.message || 'Đăng nhập thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleBackHome = () => {
    const container = document.querySelector(".login-container");
    if (container) {
      container.style.transition = "all 0.5s ease";
      container.style.transform = "scale(0.95)";
      container.style.opacity = "0";
    }

    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  return (
    <div
      style={{ display: "flex", height: "100vh" }}
      className="login-container"
    >
      {/* Bên trái - Animation và thông tin */}
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          flex: 4,
          background: "linear-gradient(to right, #020024, #cc0a9d)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Logo animation */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0.1,
            backgroundImage: `url(${logo})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Nội dung chính */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ color: "#fff", textAlign: "center", zIndex: 1 }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              marginBottom: "2rem",
              background: "linear-gradient(45deg, #fff, #f0f0f0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Chào mừng trở lại!
          </h1>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <div style={{ marginBottom: "2rem" }}>
              <motion.div whileHover={{ scale: 1.05 }} className="feature-card">
                <TeamOutlined
                  style={{ fontSize: "2rem", marginBottom: "1rem" }}
                />
                <h3>Quản lý tuyển dụng hiệu quả</h3>
                <p>Tiếp cận ứng viên phù hợp nhanh chóng</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="feature-card">
                <RocketOutlined
                  style={{ fontSize: "2rem", marginBottom: "1rem" }}
                />
                <h3>Đăng tin dễ dàng</h3>
                <p>Đăng tin tuyển dụng chỉ với vài bước</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="feature-card">
                <SafetyCertificateOutlined
                  style={{ fontSize: "2rem", marginBottom: "1rem" }}
                />
                <h3>Bảo mật thông tin</h3>
                <p>Thông tin của bạn luôn được bảo vệ</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Nút về trang chủ */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="home-button"
              type="default"
              ghost
              size="large"
              onClick={handleBackHome}
              style={{
                borderColor: "#fff",
                color: "#fff",
                marginTop: "2rem",
                padding: "0 2rem",
                height: "45px",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <motion.span initial={{ x: 0 }} whileHover={{ x: -5 }}>
                ←
              </motion.span>
              Quay về trang chủ
            </Button>
          </motion.div>
        </motion.div>

        {/* Particles animation */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              animate={{
                y: [-20, window.innerHeight],
                x: Math.random() * window.innerWidth,
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                width: Math.random() * 5 + 2 + "px",
                height: Math.random() * 5 + 2 + "px",
                background: "#fff",
                borderRadius: "50%",
                opacity: Math.random() * 0.5 + 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Bên phải - Form đăng nhập */}
      <div className="login-form-container">
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="login-form-wrapper"
        >
          <Title level={2} className="login-title">
            Đăng nhập
          </Title>

          {error && (
            <Text type="danger" className="login-error">
              {error}
            </Text>
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="login-form"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input size="large" placeholder="Nhập email của bạn" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password size="large" placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="login-button"
                block
                size="large"
              >
                Đăng nhập
              </Button>
            </Form.Item>

            <div className="login-links">
              <a href="/forgot-password" className="forgot-password">
                Quên mật khẩu?
              </a>
              <div className="register-link">
                Chưa có tài khoản? <a href="/register-employer">Đăng ký ngay</a>
              </div>
            </div>
          </Form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginEmployer;
