import React, { useState, useEffect, useContext } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  message,
  Row,
  Col,
} from "antd";
import "../../../styles/Register.css";
import { registerUser, verifyAccount } from "../../../api/authApi"; // Import API functions
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../../../components/auth/AuthProvider";
import logo from "../../../assets/logos/logo.png";
import TermsAndConditions from '../../../components/Provision';

const { Title, Text } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const { pendingVerification, savePendingRegistration, clearPendingRegistration } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState("register"); // Quản lý bước hiện tại
  const [verificationCode, setVerificationCode] = useState("");
  const [email, setEmail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false); // Trạng thái checkbox
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [termsVisible, setTermsVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (currentStep === 'verify' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentStep, countdown]);

  // Kiểm tra pending verification khi component mount
  useEffect(() => {
    if (pendingVerification) {
      setEmail(pendingVerification.email);
      setCurrentStep("verify");
      message.info('Bạn có một đăng ký chưa hoàn thành xác thực. Vui lòng nhập mã OTP để hoàn tất.');
    }
  }, [pendingVerification]);

  // Xử lý đăng ký
  const handleRegisterSubmit = async (values) => {
    if (!agreeTerms) {
      message.error("Bạn phải đồng ý với điều khoản để tiếp tục!");
      return;
    }

    try {
      const { firstName, lastName, email, password, phone } = values;
      
      // Log để debug
      console.log('Form values:', values);
      
      const userDTO = {
        fullName: `${firstName} ${lastName}`.trim(),
        email: email.trim(),
        password: password,
        confirmPassword: password,
        phone: phone.trim()
      };

      // Log để debug
      console.log('Sending userDTO:', userDTO);

      await registerUser(userDTO);
      message.success("Đăng ký thành công! Hãy nhập mã xác thực.");
      setEmail(email);
      savePendingRegistration(email); // Lưu thông tin đăng ký đang chờ
      setCurrentStep("transition-verify");
      setTimeout(() => setCurrentStep("verify"), 500);
      setCountdown(120);
      setIsResendDisabled(true);
    } catch (error) {
      console.error('Registration error:', error);
      message.error(error?.message || "Đã xảy ra lỗi khi đăng ký.");
    }
  };

  // X lý xác thực
  const handleVerificationSubmit = async () => {
    try {
      if (!verificationCode || verificationCode.length !== 6) {
        message.error('Vui lòng nhập mã xác thực 6 số!');
        return;
      }

      setLoading(true);

      if (!email) {
        message.error('Không tìm thấy thông tin email!');
        return;
      }

      // Log để debug
      console.log('Submitting verification:', { email, code: verificationCode });

      await verifyAccount(email, verificationCode);
      message.success('Xác thực thành công!');
      clearPendingRegistration(); // Xóa thông tin đăng ký đang chờ
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);

    } catch (error) {
      console.error('Lỗi xác thực:', error);
      
      if (error.status === 400) {
        // Nếu mã hết hạn, tự động reset countdown và enable nút gửi lại
        setCountdown(0);
        setIsResendDisabled(false);
      }
      
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Thêm hàm gửi lại mã xác thực
  const handleResendCode = async () => {
    try {
      setLoading(true);
      await resendOtp(email);
      message.success('Đã gửi lại mã xác thực!');
      setCountdown(120);
      setIsResendDisabled(true);
    } catch (error) {
      message.error('Không thể gửi lại mã xác thực. Vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý quay lại bước đăng ký
  const handleBack = () => {
    setCurrentStep("transition-register");
    setTimeout(() => setCurrentStep("register"), 500);
  };

  // Thêm xử lý khi người dùng rời khỏi trang
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (currentStep === "verify") {
        e.preventDefault();
        e.returnValue = "Bạn có đăng ký chưa hoàn thành. Bạn có chắc muốn thoát?";
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentStep]);

  return (
    <div className="register-container">
      <div className="register-content">
        {/* <div className="logo-container">
          <a href="/">
            <img 
              src={logo} 
              alt="Logo" 
              style={{ height: '60px' }} 
            />
          </a>
        </div> */}

        <div className={`form-wrapper ${currentStep}`}>
          {/* Form Đăng ký */}
          <div
            className={`form-content ${
              currentStep === "register" ? "active" : ""
            }`}
          >
            <Title
              level={1}
              style={{
                textAlign: "center",
                marginBottom: "1.5rem",
                color: "#333",
              }}
            >
              Đăng ký tài khoản
            </Title>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleRegisterSubmit}
              requiredMark={false}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Họ"
                    name="firstName"
                    rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
                  >
                    <Input placeholder="Nhập họ" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Tên"
                    name="lastName"
                    rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                  >
                    <Input placeholder="Nhập tên" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" }
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                  { whitespace: true, message: "Email không được chứa khoảng trắng!" }
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu" />
              </Form.Item>

              <Form.Item
                label="Nhập lại mật khẩu"
                name="confirmPassword"
                dependencies={["password"]}
                rules={[
                  { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Mật khẩu không khớp!"));
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu" />
              </Form.Item>

              <Form.Item>
                <Checkbox
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                >
                  Tôi đồng ý với{' '}
                  <a 
                    onClick={(e) => {
                      e.preventDefault();
                      setTermsVisible(true);
                    }}
                    className="terms-link"
                    style={{
                      color: '#1890ff',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontWeight: 500,
                      position: 'relative',
                      display: 'inline-block'
                    }}
                  >
                    điều khoản sử dụng
                    <span style={{
                      position: 'absolute',
                      top: -8,
                      right: -12,
                      color: '#ff4d4f',
                      fontSize: '16px'
                    }}>
                      *
                    </span>
                  </a>
                </Checkbox>
              </Form.Item>

              <Button type="primary" htmlType="submit" block>
                Đăng ký
              </Button>

              <div style={{ 
                textAlign: 'center', 
                marginTop: '1rem',
                fontSize: '14px' 
              }}>
                Đã có tài khoản? {' '}
                <a href="/login" style={{ color: '#1890ff' }}>
                  Đăng nhập ngay
                </a>
              </div>
            </Form>
          </div>

          {/* Form Xác thực */}
          <div
            className={`form-content ${currentStep === "verify" ? "active" : ""}`}
          >
            <Title
              level={3}
              style={{ textAlign: "center", marginBottom: "1rem", color: "#333" }}
            >
              Nhập mã xác thực
            </Title>
            <Text>
              Mã xác thực đã được gửi đến email của bạn. Vui lòng nhập mã gồm 6 số
              để hoàn tất đăng ký.
            </Text>
            
            {/* Thêm hiển thị countdown */}
            <div style={{ textAlign: 'center', margin: '10px 0', color: countdown <= 30 ? '#ff4d4f' : '#1890ff' }}>
              Mã xác thực còn hiệu lực trong: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
            </div>

            <Form layout="vertical" onFinish={handleVerificationSubmit} style={{ marginTop: "1rem" }}>
              <Form.Item
                label="Mã xác thực"
                name="verificationCode"
                rules={[
                  { required: true, message: "Vui lòng nhập mã xác thực!" },
                  { len: 6, message: "Mã xác thực phải gồm 6 số!" },
                  { pattern: /^[0-9]{6}$/, message: "Mã xác thực chỉ được chứa số!" }
                ]}
              >
                <Input
                  placeholder="Nhập mã xác thực"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length <= 6) {
                      setVerificationCode(value);
                    }
                  }}
                  maxLength={6}
                />
              </Form.Item>

              <Button type="primary" htmlType="submit" block loading={loading}>
                Xác thực
              </Button>

              <Button 
                type="link" 
                block 
                onClick={handleResendCode}
                disabled={isResendDisabled}
                style={{ 
                  marginTop: '10px',
                  color: isResendDisabled ? '#d9d9d9' : '#1890ff'
                }}
              >
                {isResendDisabled ? `Gửi lại mã sau ${countdown}s` : 'Gửi lại mã xác thực'}
              </Button>

              <Button
                type="default"
                block
                style={{ marginTop: '10px' }}
                onClick={handleBack}
              >
                Trở lại
              </Button>
            </Form>
          </div>
        </div>
      </div>

      {/* Thêm modal điều khoản */}
      <TermsAndConditions 
        visible={termsVisible}
        onClose={() => setTermsVisible(false)}
      />
    </div>
  );
};

export default Register;
