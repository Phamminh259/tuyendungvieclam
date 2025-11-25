import React, { useState } from 'react';
import { Card, Tabs, Row, Col, DatePicker, Select, Space, Button, Table } from 'antd';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [dateRange, setDateRange] = useState(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Demo data - cần thay thế bằng dữ liệu thực từ API
  const jobPerformanceData = [
    { name: 'Frontend Dev', views: 450, applications: 45, interviews: 15 },
    { name: 'Backend Dev', views: 380, applications: 35, interviews: 12 },
    { name: 'UI/UX', views: 320, applications: 28, interviews: 8 },
    { name: 'Project Manager', views: 280, applications: 25, interviews: 10 },
  ];

  const applicationSourceData = [
    { name: 'Tìm kiếm', value: 45 },
    { name: 'Đề xuất', value: 25 },
    { name: 'Link trực tiếp', value: 20 },
    { name: 'Khác', value: 10 },
  ];

  const applicationTrendData = [
    { month: 'T1', received: 65, processed: 55, hired: 12 },
    { month: 'T2', received: 75, processed: 65, hired: 15 },
    { month: 'T3', received: 85, processed: 70, hired: 18 },
    { month: 'T4', received: 95, processed: 80, hired: 20 },
    { month: 'T5', received: 88, processed: 75, hired: 16 },
    { month: 'T6', received: 92, processed: 82, hired: 22 },
  ];

  const columns = [
    {
      title: 'Vị trí tuyển dụng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Lượt xem',
      dataIndex: 'views',
      key: 'views',
      sorter: (a, b) => a.views - b.views,
    },
    {
      title: 'Lượt ứng tuyển',
      dataIndex: 'applications',
      key: 'applications',
      sorter: (a, b) => a.applications - b.applications,
    },
    {
      title: 'Phỏng vấn',
      dataIndex: 'interviews',
      key: 'interviews',
      sorter: (a, b) => a.interviews - b.interviews,
    },
    {
      title: 'Tỷ lệ chuyển đổi',
      key: 'conversion',
      render: (text, record) => 
        `${((record.applications / record.views) * 100).toFixed(1)}%`,
      sorter: (a, b) => (a.applications / a.views) - (b.applications / b.views),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title="Báo cáo & Thống kê">
        <Tabs defaultActiveKey="overview">
          <TabPane tab="Tổng quan" key="overview">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Bộ lọc */}
              <Space>
                <Select
                  defaultValue="month"
                  style={{ width: 120 }}
                  onChange={value => setTimeRange(value)}
                >
                  <Select.Option value="week">Tuần</Select.Option>
                  <Select.Option value="month">Tháng</Select.Option>
                  <Select.Option value="quarter">Quý</Select.Option>
                  <Select.Option value="year">Năm</Select.Option>
                </Select>
                <RangePicker 
                  onChange={(dates) => setDateRange(dates)}
                />
                <Button icon={<ReloadOutlined />}>Làm mới</Button>
                <Button type="primary" icon={<DownloadOutlined />}>
                  Xuất báo cáo
                </Button>
              </Space>

              {/* Biểu đồ xu hướng ứng tuyển */}
              <Card title="Xu hướng ứng tuyển" hoverable>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={applicationTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="received" 
                      name="Nhận hồ sơ" 
                      stroke="#1890ff" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="processed" 
                      name="Đã xử lý" 
                      stroke="#52c41a" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="hired" 
                      name="Tuyển dụng" 
                      stroke="#722ed1" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Biểu đồ hiệu suất và nguồn ứng tuyển */}
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                  <Card title="Hiệu suất tuyển dụng" hoverable>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={jobPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="views" name="Lượt xem" fill="#1890ff" />
                        <Bar dataKey="applications" name="Ứng tuyển" fill="#52c41a" />
                        <Bar dataKey="interviews" name="Phỏng vấn" fill="#722ed1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col xs={24} lg={8}>
                  <Card title="Nguồn ứng tuyển" hoverable>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={applicationSourceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {applicationSourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>

              {/* Bảng chi tiết */}
              <Card title="Chi tiết theo vị trí" hoverable>
                <Table 
                  columns={columns} 
                  dataSource={jobPerformanceData} 
                  rowKey="name"
                />
              </Card>
            </Space>
          </TabPane>

          <TabPane tab="Chi tiết ứng viên" key="candidates">
            {/* Thêm nội dung phân tích chi tiết ứng viên */}
          </TabPane>

          <TabPane tab="Hiệu quả đăng tin" key="performance">
            {/* Thêm nội dung phân tích hiệu quả đăng tin */}
          </TabPane>
        </Tabs>
      </Card>
    </Space>
  );
};

export default Analytics; 