import React, { useState } from 'react';
import { Card, Tabs, Row, Col, DatePicker, Select, Space, Button, Table } from 'antd';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell
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

  // Demo data - cần thay thế bằng dữ liệu thực từ API
  const jobData = [
    { name: 'T1', active: 65, pending: 45, expired: 20 },
    { name: 'T2', active: 75, pending: 35, expired: 25 },
    { name: 'T3', active: 85, pending: 40, expired: 30 },
    { name: 'T4', active: 95, pending: 50, expired: 15 },
  ];

  const userTypeData = [
    { name: 'Ứng viên', value: 680 },
    { name: 'Nhà tuyển dụng', value: 320 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const columns = [
    {
      title: 'Ngành nghề',
      dataIndex: 'profession',
      key: 'profession',
    },
    {
      title: 'Số lượng tin',
      dataIndex: 'jobCount',
      key: 'jobCount',
      sorter: (a, b) => a.jobCount - b.jobCount,
    },
    {
      title: 'Lượt ứng tuyển',
      dataIndex: 'applicationCount',
      key: 'applicationCount',
      sorter: (a, b) => a.applicationCount - b.applicationCount,
    },
  ];

  const professionData = [
    { profession: 'CNTT - Phần mềm', jobCount: 234, applicationCount: 1234 },
    { profession: 'Marketing', jobCount: 156, applicationCount: 890 },
    { profession: 'Kế toán', jobCount: 123, applicationCount: 567 },
    { profession: 'Kinh doanh', jobCount: 189, applicationCount: 945 },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title="Thống kê & Báo cáo">
        <Tabs defaultActiveKey="overview">
          <TabPane tab="Tổng quan" key="overview">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {/* Bộ lọc */}
              <Space>
                <Select
                  defaultValue="month"
                  style={{ width: 120 }}
                  onChange={(value) => setTimeRange(value)}
                >
                  <Option value="month">Tháng</Option>
                  <Option value="year">Năm</Option>
                </Select>
                <RangePicker
                  value={dateRange}
                  onChange={(dates) => setDateRange(dates)}
                />
                <Button icon={<ReloadOutlined />}>Làm mới</Button>
                <Button icon={<DownloadOutlined />}>Tải xuống</Button>
              </Space>

              {/* Biểu đồ */}
              <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                  <Card title="Thống kê tin tuyển dụng">
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={jobData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="active" name="Đang hiển thị" fill="#52c41a" />
                        <Bar dataKey="pending" name="Chờ duyệt" fill="#faad14" />
                        <Bar dataKey="expired" name="Hết hạn" fill="#ff4d4f" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
                <Col xs={24} lg={8}>
                  <Card title="Phân bố người dùng">
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={userTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {userTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>

              {/* Thêm biểu đồ đường */}
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card title="Xu hướng ứng tuyển">
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={jobData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="active" 
                          name="Lượt ứng tuyển" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>
                </Col>
              </Row>

              {/* Bảng thống kê giữ nguyên */}
            </Space>
          </TabPane>

          <TabPane tab="Người dùng" key="users">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="Thống kê người dùng theo thời gian">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={jobData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="active" 
                        name="Ứng viên mới" 
                        stroke="#52c41a" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pending" 
                        name="Nhà tuyển dụng mới" 
                        stroke="#1890ff" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Doanh thu" key="revenue">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="Thống kê doanh thu">
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={jobData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="active" name="Doanh thu" fill="#1890ff" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </TabPane>

          <TabPane tab="Hoạt động" key="activities">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="Hoạt động hệ thống">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={jobData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="active" 
                        name="Lượt truy cập" 
                        stroke="#722ed1" 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pending" 
                        name="Lượt tương tác" 
                        stroke="#13c2c2" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </Space>
  );
};

export default Analytics; 