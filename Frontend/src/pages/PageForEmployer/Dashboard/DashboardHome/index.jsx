import React from 'react';
import { Row, Col, Card, Space } from 'antd';
import StatisticCards from './StatisticCards';
import RecentActivities from './RecentActivities';
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

const DashboardHome = () => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Demo data - cần thay thế bằng dữ liệu thực từ API
  const viewsData = [
    { date: 'T1', views: 150, applications: 30 },
    { date: 'T2', views: 220, applications: 45 },
    { date: 'T3', views: 180, applications: 35 },
    { date: 'T4', views: 320, applications: 60 },
    { date: 'T5', views: 250, applications: 50 },
    { date: 'T6', views: 280, applications: 55 },
  ];

  const jobStatusData = [
    { name: 'Đang hiển thị', value: 12 },
    { name: 'Chờ duyệt', value: 5 },
    { name: 'Hết hạn', value: 3 },
  ];

  const applicationStatusData = [
    { status: 'Chờ duyệt', count: 25 },
    { status: 'Đã duyệt', count: 32 },
    { status: 'Phỏng vấn', count: 18 },
    { status: 'Từ chối', count: 15 },
    { status: 'Nhận việc', count: 8 },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <h2>Tổng quan</h2>
      
      <StatisticCards />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Thống kê lượt xem và ứng tuyển" hoverable>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="views"
                  name="Lượt xem"
                  stroke="#1890ff"
                  strokeWidth={2}
                  dot={{ stroke: '#1890ff', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="applications"
                  name="Lượt ứng tuyển"
                  stroke="#52c41a"
                  strokeWidth={2}
                  dot={{ stroke: '#52c41a', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Trạng thái tin tuyển dụng" hoverable>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={jobStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {jobStatusData.map((entry, index) => (
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

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Trạng thái ứng tuyển" hoverable>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={applicationStatusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="status" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="count" 
                  name="Số lượng" 
                  fill="#722ed1"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Hoạt động gần đây" hoverable>
            <RecentActivities />
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default DashboardHome; 