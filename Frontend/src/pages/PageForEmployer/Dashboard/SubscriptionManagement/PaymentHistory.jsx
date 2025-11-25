import React, { useState, useEffect, useContext } from 'react';
import { Table, Tag, Spin, message, Empty, Modal, Button } from 'antd';
import { AuthContext } from '../../../../components/auth/AuthProvider';
import { paymentApi } from '../../../../api/paymentApi';
import { getInvoicesBySubscription, getInvoiceById } from '../../../../api/invoiceApi';
import InvoiceDetails from './InvoiceDetails';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);

  useEffect(() => {
    console.log('Current user:', user);
    if (user?.id) {
      console.log('Fetching payment history for user ID:', user.id);
      fetchPaymentHistory();
    }
  }, [user]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user?.id) {
        console.error('User ID not found');
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      const data = await paymentApi.getPaymentHistory(user.id);
      console.log('Fetched payment history data:', data);
      
      if (!data) {
        console.error('No data returned from API');
        throw new Error('Không thể tải dữ liệu');
      }

      const formattedData = await Promise.all(data.map(async (payment) => {
        const invoiceData = await getInvoicesBySubscription(payment.subscriptionId);
        const invoiceNumber = invoiceData?.invoiceNumber || 'N/A';
        return {
          key: payment.id,
          id: payment.id,
          transactionId: payment.transactionId || 'N/A',
          amount: payment.amount || 0,
          paymentDate: payment.paymentDate || new Date(),
          paymentMethod: payment.paymentMethod || 'N/A',
          status: payment.status || 'UNKNOWN',
          invoiceNumber,
        };
      }));

      // Sắp xếp các giao dịch theo thứ tự ưu tiên: SUCCESS, PENDING, và FAILED
      formattedData.sort((a, b) => {
        const statusOrder = ['SUCCESS', 'PENDING', 'FAILED'];
        return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      });

      console.log('Formatted and sorted payment data:', formattedData);
      setPayments(formattedData);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setError(error.message || 'Có lỗi xảy ra khi tải lịch sử thanh toán');
      message.error(error.message || 'Có lỗi xảy ra khi tải lịch sử thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const handleViewInvoiceDetails = async (invoiceId) => {
    try {
      const invoiceDetails = await getInvoiceById(invoiceId);
      setSelectedInvoice(invoiceDetails);
      setInvoiceModalVisible(true);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
      message.error('Có lỗi xảy ra khi tải chi tiết hóa đơn');
    }
  };

  const columns = [
    {
      title: 'Mã thanh toán',
      dataIndex: 'transactionId',
      key: 'transactionId',
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => {
        try {
          return `${Number(amount).toLocaleString('vi-VN')} VND`;
        } catch (error) {
          return '0 VND';
        }
      },
    },
    {
      title: 'Ngày thanh toán',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (date) => {
        try {
          return new Date(date).toLocaleDateString('vi-VN');
        } catch (error) {
          return 'N/A';
        }
      },
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        let text = 'Thành công';
        
        switch (status?.toUpperCase()) {
          case 'PENDING':
            color = 'gold';
            text = 'Đang xử lý';
            break;
          case 'SUCCESS':
            color = 'green';
            text = 'Thành công';
            break;
          case 'FAILED':
            color = 'red';
            text = 'Thất bại';
            break;
          default:
            color = 'blue';
            text = 'Không xác định';
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Số hóa đơn',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewInvoiceDetails(record.id)}>
          Chi tiết
        </Button>
      ),
    }
  ];

  if (loading) {
    return <Spin size="large" />;
  }

  if (!user) {
    return (
      <Empty
        description="Vui lòng đăng nhập để xem lịch sử thanh toán"
      />
    );
  }

  if (error) {
    return (
      <Empty
        description={
          <span>
            {error}
            <br />
            <a onClick={fetchPaymentHistory}>Thử lại</a>
          </span>
        }
      />
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Empty description="Chưa có lịch sử thanh toán" />
    );
  }

  return (
    <div>
      <Table
        columns={columns}
        dataSource={payments}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} giao dịch`,
        }}
        scroll={{ x: true }}
      />
      <InvoiceDetails
        visible={invoiceModalVisible}
        onClose={() => setInvoiceModalVisible(false)}
        invoice={selectedInvoice}
      />
    </div>
  );
};

export default PaymentHistory; 