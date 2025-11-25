import React, { useState, useEffect, useContext } from 'react';
import { Timeline, Card, Tag, Row, Col, Statistic, Progress, Table, Space, Typography, message } from 'antd';
import { 
  UserOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ClockCircleOutlined,
  FileDoneOutlined
} from '@ant-design/icons';
import { getCandidatesByEmployerId } from '../../../../../api/applicationApi';
import { getInterviewsByCandidate } from '../../../../../api/interviewApi';
import { AuthContext } from '../../../../../components/auth/AuthProvider';

const { Title, Text } = Typography;

const CandidateTracking = () => {
  const [applications, setApplications] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0, 
    pending: 0,
    reviewing: 0,
    accepted: 0,
    rejected: 0
  });
  const [interviews, setInterviews] = useState({});
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.id) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const data = await getCandidatesByEmployerId(user.id);
      console.log('Applications data:', data);
      console.log('First application status:', data[0]?.applications[0]?.status);
      setApplications(data);
      calculateStatistics(data);
      
      // Lấy lịch phỏng vấn cho mỗi ứng viên
      const interviewsData = {};
      for (const candidate of data) {
        try {
          const candidateInterviews = await getInterviewsByCandidate(candidate.id);
          if (candidateInterviews && candidateInterviews.length > 0) {
            interviewsData[candidate.id] = candidateInterviews;
          }
        } catch (error) {
          console.error(`Error fetching interviews for candidate ${candidate.id}:`, error);
        }
      }
      setInterviews(interviewsData);
    } catch (error) {
      console.error('Error fetching applications:', error);
      message.error('Lỗi khi tải danh sách ứng viên');
    }
  };

  const calculateStatistics = (data) => {
    const stats = {
      total: 0,
      pending: 0,
      reviewing: 0,
      accepted: 0,
      rejected: 0
    };

    data.forEach(applicant => {
      applicant.applications.forEach(application => {
        if (application.status === 'PENDING') {
          stats.pending++;
        } else if (application.status === 'REVIEWING') {
          stats.reviewing++;
        } else if (application.status === 'ACCEPTED' || application.status === 'Accepted' || application.status === 'accepted') {
          stats.accepted++;
        } else if (application.status === 'REJECTED' || application.status === 'Rejected' || application.status === 'rejected') {
          stats.rejected++;
        }
      });
    });

    stats.total = stats.accepted + stats.rejected;

    setStatistics(stats);
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'SCHEDULED': 'blue',
      'COMPLETED': 'green',
      'CANCELLED': 'red'
    };
    return statusColors[status] || 'default';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'SCHEDULED': 'Đã lên lịch',
      'COMPLETED': 'Đã hoàn thành',
      'CANCELLED': 'Đã hủy'
    };
    return statusTexts[status] || status;
  };

  const columns = [
    {
      title: 'Ứng viên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Vị trí ứng tuyển',
      key: 'jobTitle',
      render: (record) => record.applications[0]?.jobTitle || 'Chưa có thông tin'
    },
    {
      title: 'Ngày ứng tuyển',
      key: 'applyDate',
      render: (record) => record.applications[0]?.createdDate 
        ? new Date(record.applications[0].createdDate).toLocaleDateString('vi-VN')
        : 'Chưa có thông tin'
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (record) => {
        const status = record.applications[0]?.status;
        if (!status) return <Tag>Không xác định</Tag>;
      
        const statusConfig = {
          'Pending': { color: 'blue', text: 'Chờ xử lý' },
          'Reviewing': { color: 'orange', text: 'Đang xem xét' },
          'Accepted': { color: 'green', text: 'Đã chấp nhận' },
          'Rejected': { color: 'red', text: 'Đã từ chối' }
        };

        const config = statusConfig[status] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      }
    },
    {
      title: 'Lịch phỏng vấn',
      key: 'interview',
      render: (record) => {
        const candidateInterviews = interviews[record.id] || [];
        
        if (candidateInterviews.length === 0) {
          return <Tag>Chưa có lịch</Tag>;
        }

        // Sắp xếp theo ngày gần nhất
        const sortedInterviews = [...candidateInterviews].sort((a, b) => 
          new Date(b.interviewDate) - new Date(a.interviewDate)
        );

        const latestInterview = sortedInterviews[0];
        const interviewDate = new Date(latestInterview.interviewDate).toLocaleDateString('vi-VN');
        const interviewTime = latestInterview.interviewTime;

        return (
          <Space direction="vertical" size="small">
            <Tag color={latestInterview.status === 'COMPLETED' ? 'green' : 'blue'}>
              Đã đặt lịch: {interviewDate} {interviewTime}
            </Tag>
            {candidateInterviews.length > 1 && (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                +{candidateInterviews.length - 1} lịch khác
              </Text>
            )}
          </Space>
        );
      }
    }
  ];

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số đơn"
              value={statistics.total}
              prefix={<FileDoneOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang xử lý"
              value={statistics.pending + statistics.reviewing}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã chấp nhận"
              value={statistics.accepted}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã từ chối"
              value={statistics.rejected}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }}>
        <Title level={4}>Tỷ lệ chấp nhận</Title>
        <Progress
          percent={
            statistics.total > 0 
              ? Math.round((statistics.accepted / statistics.total) * 100) 
              : 0
          }
          status="active"
          format={(percent) => {
            if (statistics.total === 0) return '0%';
            return `${percent}% (${statistics.accepted}/${statistics.total})`;
          }}
        />
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Title level={4}>Danh sách ứng viên</Title>
        <Table
          columns={columns}
          dataSource={applications}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default CandidateTracking; 