import React, { useState, useEffect } from 'react';
import { Card, Table, DatePicker, Space, Tag, message } from 'antd';
import { paymentApi } from '../../../../api/paymentApi';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(null);

  const getPaymentStatusPriority = (status) => {
    const priorityMap = {
      'SUCCESS': 1,
      'PAID': 2,
      'PENDING': 3,
      'FAILED': 4,
      'CANCELLED': 5
    };
    return priorityMap[status] || 999; // Các trạng thái khác sẽ xuống cuối
  };

  // Columns cho bảng lịch sử thanh toán
  const columns = [
    {
      title: 'Mã thanh toán',
      dataIndex: 'paymentId',
      key: 'paymentId',
      width: 120,
    },
    {
      title: 'Công ty',
      dataIndex: 'companyName',
      key: 'companyName',
      width: 200,
    },
    {
      title: 'Gói dịch vụ',
      dataIndex: 'packageName',
      key: 'packageName',
      width: 150,
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (amount) => `${amount?.toLocaleString()} VNĐ`,
    },
    {
      title: 'Ngày thanh toán',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      width: 180,
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm:ss'),
      sorter: (a, b) => dayjs(a.paymentDate).unix() - dayjs(b.paymentDate).unix(),
    },
    {
      title: 'Thời hạn sử dụng',
      key: 'duration',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <div>Từ: {dayjs(record.startDate).format('DD/MM/YYYY')}</div>
          <div>Đến: {dayjs(record.endDate).format('DD/MM/YYYY')}</div>
        </Space>
      ),
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      width: 120,
      render: (method) => {
        const methodMap = {
          'VNPAY': 'VNPay',
          'BANK_TRANSFER': 'Chuyển khoản',
          'CREDIT_CARD': 'Thẻ tín dụng'
        };
        return methodMap[method] || method;
      }
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 150,
      render: (status) => {
        const statusConfig = {
          'SUCCESS': { color: 'success', text: 'Thành công' },
          'PAID': { color: 'success', text: 'Đã thanh toán' },
          'FAILED': { color: 'error', text: 'Thất bại' },
          'PENDING': { color: 'warning', text: 'Đang xử lý' },
          'CANCELLED': { color: 'default', text: 'Đã hủy' }
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
      filters: [
        { text: 'Thành công', value: 'SUCCESS' },
        { text: 'Đã thanh toán', value: 'PAID' },
        { text: 'Đang xử lý', value: 'PENDING' },
        { text: 'Thất bại', value: 'FAILED' },
        { text: 'Đã hủy', value: 'CANCELLED' }
      ],
      onFilter: (value, record) => record.paymentStatus === value,
      sorter: (a, b) => getPaymentStatusPriority(a.paymentStatus) - getPaymentStatusPriority(b.paymentStatus),
      defaultSortOrder: 'ascend', // Mặc định sắp xếp theo thứ tự ưu tiên
    },
    {
      title: 'Trạng thái hóa đơn',
      dataIndex: 'invoiceStatus',
      key: 'invoiceStatus',
      width: 150,
      render: (status) => {
        const statusConfig = {
          'PAID': { color: 'success', text: 'Đã thanh toán' },
          'PENDING': { color: 'warning', text: 'Chờ thanh toán' },
          'CANCELLED': { color: 'error', text: 'Đã hủy' }
        };
        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Mã hóa đơn',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      width: 150,
    },
    {
      title: 'Mã giao dịch',
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 200,
    }
  ];

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  // Fetch lịch sử thanh toán
  const fetchPaymentHistory = async () => {
    setLoading(true);
    try {
      const data = await paymentApi.getPaymentHistoryAdmin();
      // Sắp xếp dữ liệu theo trạng thái trước khi set state
      const sortedData = data.sort((a, b) => 
        getPaymentStatusPriority(a.paymentStatus) - getPaymentStatusPriority(b.paymentStatus)
      );
      setPayments(sortedData);
    } catch (error) {
      message.error('Không thể tải lịch sử thanh toán');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi thay đổi khoảng thời gian
  const handleDateRangeChange = async (dates) => {
    if (!dates) {
      setDateRange(null);
      fetchPaymentHistory();
      return;
    }

    setDateRange(dates);
    setLoading(true);
    try {
      const data = await paymentApi.getPaymentHistoryByDateRange(
        dates[0].format('YYYY-MM-DD'),
        dates[1].format('YYYY-MM-DD')
      );
      // Sắp xếp dữ liệu theo trạng thái
      const sortedData = data.sort((a, b) => 
        getPaymentStatusPriority(a.paymentStatus) - getPaymentStatusPriority(b.paymentStatus)
      );
      setPayments(sortedData);
    } catch (error) {
      message.error('Không thể tải lịch sử thanh toán theo khoảng thời gian');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Lịch sử thanh toán"
      extra={
        <Space>
          <RangePicker
            onChange={handleDateRangeChange}
            format="DD/MM/YYYY"
            value={dateRange}
            placeholder={['Từ ngày', 'Đến ngày']}
          />
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={payments}
        loading={loading}
        rowKey="paymentId"
        scroll={{ x: 1800 }}
        pagination={{
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} giao dịch`,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '50', '100']
        }}
      />
    </Card>
  );
};

export default PaymentHistory; 