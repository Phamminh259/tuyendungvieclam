import React, { useEffect } from 'react';
import { Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PaymentProcessing = ({ paymentUrl }) => {
  useEffect(() => {
    // Chuyển hướng sau 2 giây
    const timer = setTimeout(() => {
      window.location.href = paymentUrl;
    }, 2000);

    return () => clearTimeout(timer);
  }, [paymentUrl]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh'
    }}>
      <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} />
      <Title level={3} style={{ marginTop: 20 }}>Đang chuyển đến cổng thanh toán</Title>
      <Text type="secondary">Vui lòng không tắt trình duyệt</Text>
    </div>
  );
};

export default PaymentProcessing;