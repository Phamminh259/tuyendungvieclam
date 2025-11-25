// src/pages/PageForEmployer/Dashboard/PaymentResult/index.jsx
import React, { useEffect, useState } from 'react';
import { Result, Button, Spin, Typography, Card, Space, Divider } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { paymentApi } from '../../../../api/paymentApi';
import { getInvoicesBySubscription } from '../../../../api/invoiceApi';
import logo from '../../../../assets/logos/logo.png';
import '../../../../styles/PaymentResult.css';

const { Title, Text } = Typography;

const PaymentResult = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        const params = {
          responseCode: searchParams.get('vnp_ResponseCode'),
          transactionRef: searchParams.get('vnp_TxnRef'),
          transactionStatus: searchParams.get('vnp_TransactionStatus'),
          amount: searchParams.get('vnp_Amount'),
          bankCode: searchParams.get('vnp_BankCode'),
          orderInfo: searchParams.get('vnp_OrderInfo'),
          transactionNo: searchParams.get('vnp_TransactionNo')
        };

        const response = await paymentApi.updatePaymentStatus(params);

        if (params.responseCode === '00' && params.transactionStatus === '00') {
          setStatus('success');
          
          const storedPackage = localStorage.getItem('selected_package');
          if (storedPackage) {
            const packageData = JSON.parse(storedPackage);
            const invoice = await getInvoicesBySubscription(packageData.subscriptionId);
            console.log('Invoice response:', invoice);
            
            setPaymentDetails({
              amount: Number(params.amount) / 100,
              bankCode: params.bankCode,
              orderInfo: params.orderInfo,
              transactionNo: params.transactionNo,
              invoiceNumber: invoice.invoiceNumber,
              issueDate: invoice.issueDate,
              description: invoice.description
            });
          }
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Error processing payment:', error);
        setStatus('error');
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="payment-result-container loading">
        <Card className="payment-card loading-card">
          <Space direction="vertical" align="center" size="large">
            <img src={logo} alt="Logo" className="company-logo" />
            <Spin size="large" />
            <Text>Đang xử lý kết quả thanh toán...</Text>
          </Space>
        </Card>
      </div>
    );
  }

  return (
    <div className="payment-result-container">
      <Card className="payment-card">
        <Space direction="vertical" align="center" size="large" style={{ width: '100%' }}>
          <img src={logo} alt="Logo" className="company-logo" />
          
          {status === 'success' ? (
            <CheckCircleFilled className="status-icon success" />
          ) : (
            <CloseCircleFilled className="status-icon error" />
          )}

          <Title level={2}>
            {status === 'success' ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
          </Title>

          <Text type="secondary">
            {status === 'success' 
              ? 'Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.'
              : 'Rất tiếc, có lỗi xảy ra trong quá trình thanh toán.'}
          </Text>

          {paymentDetails && status === 'success' && (
            <>
              <Divider />
              <div className="payment-details">
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div className="detail-item">
                    <Text type="secondary">Số tiền:</Text>
                    <Text strong>{paymentDetails.amount.toLocaleString('vi-VN')} VNĐ</Text>
                  </div>
                  <div className="detail-item">
                    <Text type="secondary">Mã giao dịch:</Text>
                    <Text code>{paymentDetails.transactionNo}</Text>
                  </div>
                  <div className="detail-item">
                    <Text type="secondary">Mã hóa đơn:</Text>
                    <Text code>{paymentDetails.invoiceNumber || 'N/A'}</Text>
                  </div>
                  <div className="detail-item">
                    <Text type="secondary">Ngân hàng:</Text>
                    <Text>{paymentDetails.bankCode}</Text>
                  </div>
                  <div className="detail-item">
                    <Text type="secondary">Thời gian thanh toán:</Text>
                    <Text>{paymentDetails.issueDate ? new Date(paymentDetails.issueDate).toLocaleString('vi-VN') : 'N/A'}</Text>
                  </div>
                  {paymentDetails.description && (
                    <div className="detail-item">
                      <Text type="secondary">Mô tả:</Text>
                      <Text>{paymentDetails.description}</Text>
                    </div>
                  )}
                </Space>
              </div>
            </>
          )}

          <Divider />

          <Space>
            <Button type="primary" size="large" onClick={() => navigate('/dashboard/subscription')}>
              Về trang chủ
            </Button>
            {status === 'error' && (
              <Button size="large" onClick={() => navigate('/employer/checkout')}>
                Thử lại
              </Button>
            )}
          </Space>

          <div className="payment-footer">
            <Text type="secondary">Thanh toán qua</Text>
            <img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSutP9weqAPNNrV0V616bloZn2fwAdAOHqnFQ&s'} alt="VNPAY" className="vnpay-logo" />
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default PaymentResult;