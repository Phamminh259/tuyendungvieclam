import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Spin, message, Space, Button, Divider } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { paymentApi } from '../../../../api/paymentApi';

const { Title, Text } = Typography;

const PayPalCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const processedRef = useRef(false);

  useEffect(() => {
    const handlePayPalCallback = async () => {
      if (processedRef.current || isProcessing) {
        return;
      }

      try {
        setIsProcessing(true);
        processedRef.current = true;

        const urlParams = new URLSearchParams(window.location.search);
        const paymentId = urlParams.get('paymentId');
        const PayerID = urlParams.get('PayerID');
        const token = urlParams.get('token');
        const subscriptionId = localStorage.getItem('pending_subscription_id');

        console.log('PayPal URL Params:', {
          paymentId,
          PayerID,
          token,
          subscriptionId,
          fullUrl: window.location.href
        });

        if (!paymentId || !PayerID || !token || !subscriptionId) {
          throw new Error('Thiếu thông tin thanh toán PayPal');
        }

        const response = await paymentApi.handlePayPalCallback({
          paymentId,
          PayerID,
          token,
          subscriptionId: parseInt(subscriptionId, 10)
        });

        console.log('PayPal Success Response:', response);

        if (response?.status === 'success') {
          setStatus('success');
          message.success('Thanh toán PayPal thành công!');
          setTimeout(() => {
            navigate('/dashboard/subscription');
          }, 2000);
          return;
        }
        
        throw new Error(response?.message || 'Thanh toán thất bại');

      } catch (error) {
        console.error('PayPal Error Full Details:', {
          message: error.message,
          response: error.response?.data,
          stack: error.stack
        });
        setStatus('error');
        message.error(error.response?.data?.message || error.message || 'Xử lý thanh toán thất bại');
      } finally {
        setLoading(false);
        setIsProcessing(false);
      }
    };

    handlePayPalCallback();

    return () => {
      if (processedRef.current) {
        localStorage.removeItem('pending_subscription_id');
      }
    };
  }, [navigate, isProcessing]);

  const renderContent = () => {
    if (loading) {
      return (
        <Space direction="vertical" align="center" style={{ width: '100%' }}>
          <Spin size="large" />
          <Title level={3}>Đang xử lý thanh toán...</Title>
          <Text type="secondary">Vui lòng không đóng trình duyệt</Text>
        </Space>
      );
    }

    return (
      <Space direction="vertical" align="center" style={{ width: '100%' }}>
        {status === 'success' ? (
          <>
            <div className="result-icon success">
              <CheckCircleOutlined style={{ fontSize: 64, color: '#52c41a' }} />
            </div>
            <Title level={2} style={{ color: '#52c41a', margin: '16px 0' }}>
              Thanh toán thành công!
            </Title>
            <Text>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi</Text>
          </>
        ) : (
          <>
            <div className="result-icon error">
              <CloseCircleOutlined style={{ fontSize: 64, color: '#ff4d4f' }} />
            </div>
            <Title level={2} style={{ color: '#ff4d4f', margin: '16px 0' }}>
              Thanh toán thất bại
            </Title>
            <Text>Đã xảy ra lỗi trong quá trình thanh toán</Text>
          </>
        )}

        <Divider />

        <Space>
          <Button 
            type="primary" 
            size="large" 
            onClick={() => navigate('/dashboard/subscription')}
          >
            Về trang chủ
          </Button>
          {status === 'error' && (
            <Button 
              size="large" 
              onClick={() => navigate('/employer/checkout')}
            >
              Thử lại
            </Button>
          )}
        </Space>

        <div className="payment-footer" style={{ marginTop: 24 }}>
          <Text type="secondary">Thanh toán qua</Text>
          <img 
            src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" 
            alt="PayPal" 
            style={{ height: 40, marginLeft: 8 }} 
          />
        </div>
      </Space>
    );
  };

  return (
    <div style={{ 
      maxWidth: 600, 
      margin: '50px auto', 
      padding: '0 20px' 
    }}>
      <Card style={{ textAlign: 'center', padding: '24px' }}>
        {renderContent()}
      </Card>
    </div>
  );
};

export default PayPalCallback; 