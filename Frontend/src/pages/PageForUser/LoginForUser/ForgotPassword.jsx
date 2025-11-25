import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../../../api/authApi';
import '../../../styles/ForgotPassword.css';

const { Title, Text } = Typography;

// =============================
// OTP FORM MEMOIZED (quan trọng)
// =============================
const OTPForm = React.memo(
  ({ email, countdown, isResendDisabled, loading, handleOTPSubmit, handleResendOTP, backToEmail }) => {

    return (
      <Form onFinish={handleOTPSubmit}>
        <Title level={3}>Nhập mã xác thực</Title>
        <Text>Mã xác thực đã được gửi đến email {email}</Text>

        <div
          style={{
            textAlign: 'center',
            margin: '10px 0',
            color: countdown <= 30 ? '#ff4d4f' : '#1890ff',
          }}
        >
          Mã xác thực còn hiệu lực trong:{' '}
          {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
        </div>

        <Form.Item
          name="otp"
          rules={[
            { required: true, message: 'Vui lòng nhập mã xác thực!' },
            { len: 6, message: 'Mã xác thực phải có 6 số!' },
            { pattern: /^[0-9]{6}$/, message: 'Mã xác thực chỉ được chứa số!' },
          ]}
        >
          <Input maxLength={6} placeholder="Nhập mã xác thực" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block>
          Tiếp tục
        </Button>

        <Button
          type="link"
          block
          onClick={handleResendOTP}
          disabled={isResendDisabled}
          style={{
            marginTop: '10px',
            color: isResendDisabled ? '#d9d9d9' : '#1890ff',
          }}
        >
          {isResendDisabled ? `Gửi lại mã sau ${countdown}s` : 'Gửi lại mã xác thực'}
        </Button>

        <Button type="link" onClick={backToEmail} block>
          Quay lại
        </Button>
      </Form>
    );
  }
);

// =============================
// MAIN COMPONENT
// =============================
const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [countdown, setCountdown] = useState(120);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const navigate = useNavigate();

  // =============================
  // COUNTDOWN — KHÔNG RENDER OTPFORM
  // =============================
  useEffect(() => {
    if (currentStep !== 'otp') return;

    if (countdown <= 0) {
      setIsResendDisabled(false);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, currentStep]);

  // =============================
  // EMAIL SUBMIT
  // =============================
  const handleEmailSubmit = async (values) => {
    setLoading(true);
    try {
      await forgotPassword(values.email);
      setEmail(values.email);
      setCountdown(120);
      setIsResendDisabled(true);
      message.success('Mã xác thực đã được gửi đến email của bạn!');
      setCurrentStep('otp');
    } catch (error) {
      message.error(error.message || 'Có lỗi xảy ra!');
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // OTP SUBMIT (useCallback để không re-render OTPForm)
  // =============================
  const handleOTPSubmit = useCallback(async (values) => {
    setLoading(true);
    try {
      setVerificationCode(values.otp);
      message.success('Vui lòng nhập mật khẩu mới');
      setCurrentStep('newPassword');
    } catch {
      message.error('Mã xác thực không đúng!');
    } finally {
      setLoading(false);
    }
  }, []);

  // =============================
  // RESEND OTP (useCallback)
  // =============================
  const handleResendOTP = useCallback(async () => {
    setLoading(true);
    try {
      await forgotPassword(email);
      setCountdown(120);
      setIsResendDisabled(true);
      message.success('Đã gửi lại mã xác thực!');
    } catch {
      message.error('Không thể gửi lại mã!');
    } finally {
      setLoading(false);
    }
  }, [email]);

  // =============================
  // RESET PASSWORD
  // =============================
  const handlePasswordSubmit = async (values) => {
    setLoading(true);
    try {
      await resetPassword(email, verificationCode, values.newPassword);
      message.success('Đặt lại mật khẩu thành công!');
      setTimeout(() => navigate('/login'), 1200);
    } catch (error) {
      message.error(error.message || 'Không thể đặt lại mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // EMAIL FORM
  // =============================
  const EmailForm = () => (
    <Form onFinish={handleEmailSubmit}>
      <Title level={3}>Quên mật khẩu</Title>
      <Text>Nhập email của bạn để nhận mã xác thực</Text>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Vui lòng nhập email!' },
          { type: 'email', message: 'Email không hợp lệ!' },
        ]}
      >
        <Input placeholder="Nhập email" />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading} block>
        Gửi mã xác thực
      </Button>

      <Button type="link" onClick={() => navigate('/login')} block>
        Quay lại đăng nhập
      </Button>
    </Form>
  );

  // =============================
  // PASSWORD FORM
  // =============================
  const NewPasswordForm = () => (
    <Form onFinish={handlePasswordSubmit}>
      <Title level={3}>Đặt lại mật khẩu</Title>

      <Form.Item
        name="newPassword"
        rules={[
          { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
          { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
        ]}
      >
        <Input.Password placeholder="Nhập mật khẩu mới" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={['newPassword']}
        rules={[
          { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
              return Promise.reject(new Error('Mật khẩu không khớp!'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="Xác nhận mật khẩu mới" />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading} block>
        Đặt lại mật khẩu
      </Button>
    </Form>
  );

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-content">
        <div className="form-container">
          {currentStep === 'email' && <EmailForm />}
          {currentStep === 'otp' && (
            <OTPForm
              email={email}
              countdown={countdown}
              loading={loading}
              isResendDisabled={isResendDisabled}
              handleOTPSubmit={handleOTPSubmit}
              handleResendOTP={handleResendOTP}
              backToEmail={() => setCurrentStep('email')}
            />
          )}
          {currentStep === 'newPassword' && <NewPasswordForm />}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
