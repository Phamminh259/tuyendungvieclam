import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, message, Typography } from 'antd';
import { motion } from 'framer-motion';
import { PhoneOutlined, LockOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Text } = Typography;

const OTPContainer = styled.div`
  text-align: center;
  padding: 2rem;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const PhoneDisplay = styled.div`
  font-size: 1.2rem;
  color: #333;
  margin: 1rem 0;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const OTPInputContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 2rem 0;
`;

const OTPInput = styled.input`
  width: 45px;
  height: 45px;
  padding: 0;
  border-radius: 8px;
  border: 2px solid #d9d9d9;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  transition: all 0.3s;

  &:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    outline: none;
  }
`;

const Timer = styled.div`
  margin-top: 1rem;
  color: ${props => props.isExpired ? '#ff4d4f' : '#666'};
  font-size: 0.9rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const OTPVerification = ({ phone, onVerificationSuccess, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    let timer;
    if (otpSent && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, timeLeft]);

  const handleInputChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const sendOTP = async () => {
    try {
      setLoading(true);
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Giả lập mã OTP (trong thực tế không nên làm thế này)
      window.mockOTP = "123456";
      
      setOtpSent(true);
      setTimeLeft(60);
      message.success('Mã OTP đã được gửi!');
    } catch (error) {
      console.error('Lỗi khi gửi OTP:', error);
      message.error('Không thể gửi mã OTP. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      message.error('Vui lòng nhập đủ 6 số!');
      return;
    }

    try {
      setLoading(true);
      
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Kiểm tra với mã OTP giả lập
      if (otpValue === window.mockOTP) {
        message.success('Xác thực thành công!');
        onVerificationSuccess();
      } else {
        throw new Error('Mã OTP không đúng');
      }
    } catch (error) {
      console.error('Lỗi xác thực OTP:', error);
      message.error('Mã OTP không đúng. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <OTPContainer>
        <h2 style={{ color: '#333', marginBottom: '1.5rem' }}>Xác thực số điện thoại</h2>
        
        <PhoneDisplay>
          <PhoneOutlined />
          {phone}
        </PhoneDisplay>

        <OTPInputContainer>
          {otp.map((digit, index) => (
            <OTPInput
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              value={digit}
              onChange={e => handleInputChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              maxLength={1}
              disabled={!otpSent}
              style={{
                ...(!otpSent && {
                  background: '#f5f5f5',
                  cursor: 'not-allowed',
                  borderColor: '#d9d9d9'
                })
              }}
              placeholder={otpSent ? "" : "•"}
            />
          ))}
        </OTPInputContainer>

        {otpSent && (
          <Timer isExpired={timeLeft === 0}>
            {timeLeft > 0 ? (
              `Mã OTP sẽ hết hạn sau ${timeLeft} giây`
            ) : (
              'Mã OTP đã hết hạn'
            )}
          </Timer>
        )}

        <ButtonGroup>
          <Button 
            type="default" 
            onClick={onBack}
          >
            Quay lại
          </Button>
          
          {!otpSent ? (
            <Button
              type="primary"
              onClick={sendOTP}
              loading={loading}
              icon={<LockOutlined />}
            >
              Gửi mã OTP
            </Button>
          ) : (
            <>
              <Button
                type="primary"
                onClick={verifyOTP}
                loading={loading}
                disabled={otp.join('').length !== 6}
              >
                Xác thực
              </Button>
              {timeLeft === 0 && (
                <Button
                  onClick={sendOTP}
                  loading={loading}
                >
                  Gửi lại mã
                </Button>
              )}
            </>
          )}
        </ButtonGroup>

        {!otpSent && (
          <Text style={{ 
            marginTop: '1rem', 
            color: '#666', 
            fontSize: '0.9rem',
            textAlign: 'center',
            display: 'block'
          }}>
            Vui lòng nhấn "Gửi mã OTP" để nhận mã xác thực
          </Text>
        )}
      </OTPContainer>
    </motion.div>
  );
};

export default OTPVerification; 